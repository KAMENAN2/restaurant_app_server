import express from "express";
import mongoose from "mongoose";
import MongoClient from "mongodb"
import bodyParser from "body-parser";


let app = express();
const uri ="mongodb://localhost:27017";
app.use(bodyParser.json());
 // let size =10;
// let page = 1;
MongoClient.connect(uri,(error,db)=>{
    if(!error){
        console.log("success to mongodb connector");
        const dbClient = db.db("test").collection("restaurants").find() ;


        //-------------------------------CRUD Function for Esatic Server side node js project-----------------------------------------------------------


        /* Requête HTTP GET http://localhost:8080/restaurants */
        app.get("/restaurants",(req,res)=>{
            let page = parseInt(req.query.page || 1) ;
            // idem si present on prend la valeur, sinon 10
            let size = parseInt(req.query.size || 10) ;

            dbClient.skip(size*page)
                .limit(size)
                .toArray()
                .then(arr => res.send(arr));
        });


        //------------------------------- End CRUD Function for Esatic Server side node js project-----------------------------------------------------------

    }else {
        console.log("Failed to mongodb connector");
        console.log(error);
    }
});
app.get("/",(req,res)=>{

    res.send("Express is ok to work")
});



app.listen(8080,()=>{
    console.log("Server Started");
});



