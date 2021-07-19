const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var items = ["Buy Food", "Cook Food", "Eat Food"];

app.get("/", (req, res)=>{
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };

    // for format of date
    var day = today.toLocaleDateString("en-US", options);

    res.render("list", {kindOf : day, addTasks: items});

});

app.post("/", (req, res)=>{
    var item = req.body.newTask;
    items.push(item);
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is running on port 3000");
});