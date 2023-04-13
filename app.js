import express from "express";
import mongoose, { mongo } from "mongoose";
import bodyParser from "body-parser";

const app=express();

// using middlewares..

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

// connecting to database..

mongoose.connect("mongodb://localhost:27017/sample2",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("mongodb connected..")
}).catch((err)=>{
    console.log(err);
})


// Product schema...

const productView=new mongoose.Schema({
    name:String,
    description:String,
    price:Number,
})

// creating model..

const product=mongoose.model("product",productView);

// Apis..

app.get("/",(req,res)=>{
     res.send("Hii ");
})

// 1.create product..

app.post("/api/v1/products/new",async(req,res)=>{
    const Products=await product.create(req.body);
    res.status(200).json({
        success:true,
        Products
    })
})

// 2.get all products..

app.get("/api/v1/allproducts",async(req,res)=>{
    const Products=await product.find();
    res.status(200).json({
        success:true,
        Products
    })
})

// 3.update a product..

app.put("/api/v1/updateproducts/:id",async(req,res)=>{
    let Products=await product.findById(req.params.id);
    if(!Products){
        res.status(500).json({
            success:false,
            message:"Product Not found"
        })
    }
    Products=await product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        useFindAndModify:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        Products
    })
})

// 4.delete a product

app.delete("/api/v1/deleteproduct/:id",async(req,res)=>{
    let Products=await product.findById(req.params.id);
    if(!Products){
        res.status(500).json({
            success:false,
            message:"product not found"
        })
    }

    await product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        message:"product deleted"
    })
})

// listening the app to the port..

app.listen(4500,(req,res)=>{
    console.log(`running on port http://localhost:${4500}`);
})