import express from "express";
import mongoose, {Schema, Types} from "mongoose";
import MongoClient from "mongodb"
import bodyParser from "body-parser";
import ObjectId = mongoose.Types.ObjectId;






let app = express();
const uri ="mongodb://localhost:27017";
app.use(bodyParser.json());
 // let size =10;
// let page = 1;
MongoClient.connect(uri,(error,db)=>{
    if(!error){
        console.log("success to mongodb connector");
        const dbClient = db.db("test").collection("restaurants") ;


        //-------------------------------CRUD Function for Esatic Server side node js project-----------------------------------------------------------


        /* Requête HTTP GET http://localhost:8080/restaurants */
        app.get("/restaurants",(req,res)=>{
            let page = parseInt(req.query.page || 1) ;
            // idem si present on prend la valeur, sinon 10
            let size = parseInt(req.query.size || 10) ;

            dbClient.find()
                .skip(size*page)
                .limit(size)
                .toArray()
                .then(arr => res.send(arr));
        });

        app.get("/restaurants/:id",(req,rep)=>{
            let id = req.params.id;
            console.log(id);
            let reponse;
            let idObject = {_id:ObjectId(id)}
            dbClient.findOne(idObject,(error,data)=>{
                if(!error){
                    reponse = {
                        succes: true,
                        restaurant : data,
                        error : null,
                        msg:"Details du restaurant envoyés"
                    };
                } else{
                    reponse = {
                        succes: false,
                        restaurant : null,
                        error : error,
                        msg: "erreur lors du find"

                    };
                };
                rep.send(reponse);
            })

        });


        //------------------------------- End CRUD Function for Esatic Server side node js project-----------------------------------------------------------

    }else {
        console.log("Failed to mongodb connector");
        console.log(error);
    }
});
app.get("/",(req,res)=>{

    res.send("Express fonctionne correctement")
});



app.listen(8080,()=>{
    console.log("Server Started");
});



