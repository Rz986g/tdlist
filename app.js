//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname+"/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemsSchema = new mongoose.Schema({
  datei:String,
  item:String
})

const Item = mongoose.model("Item",itemsSchema);

const listSchema =new mongoose.Schema({
  name:String,
  items:[itemsSchema]
});

const List = mongoose.model("List",listSchema)

// try===============================================
const item1 =new Item({
  datei:date.listDay(),
  item:"Welcome! I go to school by bus."
})



const defaultItems = []



// /try==============================================

app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/views/public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function(req, res) { 
  Item.find((err,item)=>{
    if(err){console.log(err);}else{
      res.render("list", { theList:"MyList", newitem:item})

    }
  })})


app.post("/", function(req, res) {
  const itemName=req.body.todo
  const list =req.body.list;
  const item = new Item({
    datei:date.listDay(),
    item:itemName
  });
  console.log(list);

  if (list === "MyList"){
  item.save()
  res.redirect("/");}else{
    List.findOne({name:list},(err, foundList)=>
    {foundList.items.push(item);
    foundList.save();
    res.redirect("/"+list);
  });
};
})


app.post("/delete",(req,res)=>{
  const itemId = req.body.checkbox;
  const listName =req.body.listName;
  // console.log(itemId);
  console.log(req.body)
  if (listName==="MyList"){console.log("delete "+itemId);

  Item.findByIdAndRemove(itemId,(err,item)=>{
    if (err){console.log(err);}else{
      // console.log(item.item+" delted");
      findCollection(Item)
    }
  })
  res.redirect("/")}
  else{List.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemId}}},(err,foundList)=>{
    if(!err){console.log("delete "+foundList.items);
  res.redirect("/"+listName)}
  })}
})

const findCollection =(Oj)=>{
  Oj.find((err,object)=>{
    if (err){
      console.log(err);}
    else{
      object.forEach((object)=>{
         console.log(object._id + " " +object.item);
      });
    }
  })};


app.get("/:customerListName",(req,res)=>{
  console.log(req.params.customerListName);
  const customerListName = _.capitalize(req.params.customerListName);

  List.findOne({name: customerListName},(err,docs)=>{
    if (!err){
      // Create a new list==========
      if (!docs){

      const list = new List({
        name:customerListName,
        items:defaultItems
      });
      list.save()
      res.redirect("/"+customerListName)
      console.log("Create List: "+customerListName);
      
    
    }
      else{ 
        res.render("list", { theList: docs.name, newitem:docs.items});
        
      }
    }
  });

  
  // res.render("about")
})

app.get("/about",function(req,res){
  res.render("about");
})


app.listen(4000, function() {
  console.log("The Server is running on Port 4000")
});