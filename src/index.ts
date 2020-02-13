import express , {Request, Response} from "express";
import mongoose, {Schema, Types} from "mongoose";
import serveStatic from "serve-static";
import MongoClient from "mongodb"
import bodyParser from "body-parser";
import ObjectId = mongoose.Types.ObjectId;
import cors from "cors";
//-----------Schema of restaurant document ----------------------------------
import Restaurants from "./RestaurantSchema";
import {Client} from "@googlemaps/google-maps-services-js";
const client = new Client({});


/*
client.elevation({

        params: {
            locations: [{ lat: 45, lng: -110 }],
            key: "AIzaSyAkpUGAONeOjm5Kkl_J88eCaGm17euAjCU"
        },
        timeout: 1000 // milliseconds
    })
    .then(r => {
        console.log("Google maps API")
        console.log(r.data.results[0].elevation);
    })
    .catch(e => {
        console.log(e);
    });
*/



var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
let app = express();
let reponse;
//const uri ="mongodb://localhost:27017";
//app.use(bodyParser.json());
app.use(cors(corsOptions));
app.options('*', cors())
 // let size =10;
// let page = 1;
//--------------------------- mongoose --------------------------------------
const uri:string="mongodb://localhost:27017/test";
mongoose.connect(uri,(err)=>{
    if(err){ console.log(err); }
    else{ console.log("Mongo db connection sucess"); }
});
//Requête HTTP GET http://localhost:8080/find-all-resto
app.get("/find-all-resto",(req:Request,resp:Response)=>{
    Restaurants.find((err,books)=>{
        if(err){ resp.status(500).send(err); }
        else{ resp.send(books); }
    })
});
//Requête HTTP GET http://localhost:8080/find-all-resto?size=10&page=2
app.get("/find-paginate-resto",(req:Request,resp:Response)=>{
    let p:number=parseInt(req.query.page || 1);
    let size:number=parseInt(req.query.size || 5);
    Restaurants.paginate({}, { page: p, limit: size }, function(err, result) {
        if(err) resp.status(500).send(err);
        else resp.send(result);
    });
});

//Requête HTTP GET http://localhost:8080/find-all-resto?size=10&page=2&name=Morri
app.get("/find-resto-by-name",(req:Request,resp:Response)=>{
    let p:number=parseInt(req.query.page || 1);
    let size:number=parseInt(req.query.size || 5);
    let keyword:string=req.query.name || '';
    Restaurants.paginate({name:{$regex:".*(?i)"+keyword+".*"}}, { page: p, limit:
        size }, function(err, result) {
        if(err) resp.status(500).send(err);
        else resp.send(result);
    });
});

//---------------------------End mongoose --------------------------------------

//--------------------------- MongoClient --------------------------------------

MongoClient.connect(uri,(error,db)=>{
    if(!error){
        console.log("success to mongodb connector");
        const dbClient = db.db("test").collection("restaurants") ;


        //-------------------------------CRUD Function for Esatic Server side node js project-----------------------------------------------------------


        //Requête HTTP GET http://localhost:8080/restaurants
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

        app.get("/restau-cords",(req,res)=>{

           let latSup = parseFloat(req.query.lat) + 10 ;
           let latInf = parseFloat(req.query.lat ) - 10;
            console.log("Cords GPS sending")

            let longSup = parseFloat(req.query.long ) + 10 ;
            let longInf = parseFloat(req.query.long ) - 10;

            dbClient.find({"address.coord.0":{$lt:parseFloat(req.query.lat)}}).sort({"address.coord.0":-1,"address.coord.1":-1})
                .skip(3)
                .limit(3)
                .toArray()
                .then(arr => res.send(arr));

            // res.send({msg:"la partie de recherche en fonction de la position la marche bien",
            // lat:req.query.lat,
            // long:req.query.long})

        });

        app.get("/restaurants/:id",(req,rep)=>{
            let id = req.params.id;
            console.log(id);

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
        app.post("/restaurants",(req,rep)=>{
            dbClient.insertOne(req.body,(error,data)=>{
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
        app.put("/restaurants/:id",(req,rep)=>{
            let id = req.params.id;
            console.log(id);
            let idObject = {_id:ObjectId(id)};
            dbClient.replaceOne(idObject,req.body, (error, data)=>{
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

        app.delete("/restaurants/:id",(req,rep)=>{
            let id = req.params.id;
            console.log(id);
            let idObject = {_id:ObjectId(id)};
            dbClient.deleteOne(idObject,(error,data)=>{
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
        })
//--------------------------- MongoClient --------------------------------------


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



