const express=require("express");
const bodyParser=require("body-parser");
//const ejs=require("ejs");
const mongoose=require("mongoose");
const _=require("lodash");

app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://anshuman_chaurasia:test123@cluster0-9nuyr.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});

let itemSchema={
    name: String,

};
//let customListName="item";
let Item=mongoose.model("item",itemSchema);

let list={
    title: String,
    items: [itemSchema]
};

let List=mongoose.model("List",list);

// const item2=new Item({
//     name:"first"
// });

// const item1=new Item({
//     name:"second"
// });

// const defaultitem=[item2,item1];

app.set("view engine","ejs");

//const todolist=["first"];

// Item.insertMany(defaultitem,function(err){
//     if(err)
//         console.log("error: "+err);
//     else
//     console.log("success");
// });


app.get("/:customListName",function(req,res){
    customName=_.capitalize(req.params.customListName);
    //customName="Items";

    console.log("inside root get title "+customName);

    List.find({title:customName},function(err,founditem) {
        if(err)
            console.log("inside get err");

        if(founditem){
            console.log("inside root if "+founditem);
            res.render("home",{"customListName":customName,"list":founditem});
            
        }
        else{
        console.log("inside root else "+founditem);
        res.render("home",{"customListName":customName,"list":founditem});
    }
       });

});

app.post("/delete/:customListName",function(req,res){
    customName=_.capitalize(req.params.customListName);
    const id=req.body.id;
    
    
    List.findByIdAndRemove(id,function(err,suc){
        console.log("Successfully deleted... "+id+" t "+customName);
        res.redirect("/"+customName);
    });
});

app.post("/:customListName",function(req,res){    
    customName=_.capitalize(req.params.customListName);

    const item=new Item({name:req.body.todo});
    
   const list1=new List({
       "title":customName,
        "items":item
    });
    
   console.log("inside post "+list1);

   list1.save();

    // res.render("home",{"customListName":"Home","list":founditem});
     console.log("inside post insert");
     
     res.redirect("/"+customName);
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server running");
});