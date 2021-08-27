const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("loadsh");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-dinesh:dinesh1997@cluster0.cuuqa.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
  name : String,
};

const Item = mongoose.model("item", itemsSchema);

const firstTodo = new Item({
  name: "Welcome to your todolist!",
});

const secondTodo = new Item({
  name: "Hit the + button to add a new item",
});

const thirdTodo = new Item({
  name: "<-- Hit this to delete item.",
});

const defaultItems = [firstTodo, secondTodo, thirdTodo];

const listSchema = {
  name : String,
  items : [itemsSchema],
}

const List = mongoose.model("List", listSchema);

// to pull data from mongodb
app.get("/", function(req, res) {
  // const day = date.getDate();
  Item.find({}, (err, result)=>{
    const size = result.length;
    if(size === 0){
        Item.insertMany(defaultItems, function(error){
          if(!err){
            mongoose.connection.close();
            // console.log("successfully inserted many data");
            res.redirect("/");
          }
      });
    } 
    
    res.render("list", {listTitle: "Today", newListItems: result});

  })
});

// to add a data into mongoDB
app.post("/", function(req, res){

  const item = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name: item,
  })

  if(listName === "Today"){
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, foundList)=>{
          // append new data to array
          foundList.items.push(newItem);
          foundList.save();

          res.redirect("/" + listName);
    });
  }
});


app.post("/delete", function(req, res){
  const itemChecked = req.body.checkbox;
  const listName = req.body.listName;
  // to delete data from mongodb

  if(itemChecked === "Today"){
    Item.findByIdAndRemove(itemChecked, function(err){
      if(!err){
        res.redirect("/");
      } 
    });
  } else {
    List.findOneAndRemove({name: listName}, {$pull: {_id: itemChecked}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }
});

app.get("/:customListName", function(req, res){
  let customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, (err, foundList)=>{
    if(!err){
      if(!foundList){
        // create a new list 
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        
        list.save();

        res.redirect("/" + customListName);
  
      } else {
        // show exiting database

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});

      }
    }
  });

})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
