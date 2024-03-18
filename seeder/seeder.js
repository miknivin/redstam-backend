import mongoose from "mongoose"
import Products from '../models/product.js'
import products from "./data.js"
const seedProducts = async () => {
    try{
        await mongoose.connect("mongodb+srv://nivinmongo23o:v29IZzzu5EGumrcg@cluster0.ltsaofl.mongodb.net/ecom?retryWrites=true&w=majority")

        await Products.deleteMany();
        console.log('Products are deleted');

        await Products.insertMany(products);
        console.log('Products are added');
        process.exit()
    }
    catch (error){
        console.log(error.message);
        process.exit();
    }
}

seedProducts();