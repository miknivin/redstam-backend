import mongoose from "mongoose";

export const connectDatabase = ()=>{
    let DB_URI = ""

    if (process.env.NODE_ENV==='DEVELOPMENT') {
        DB_URI = process.env.DB_LOCAL_URI
        //console.log(DB_URI);
    }

    if (process.env.NODE_ENV==='PRODUCTION') {
        DB_URI= process.env.DB_URI
        //console.log(DB_URI);
    }

    mongoose.connect(DB_URI).then((c)=>{
        console.log(`Mongo db connected with HOST: ${c?.connection?.host}`);
    })
    .catch((err)=>{
        console.log('Mongodb connection error'+err);
    })
}

