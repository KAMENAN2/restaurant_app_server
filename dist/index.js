"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var mongodb_1 = __importDefault(require("mongodb"));
var ObjectId = mongoose_1.default.Types.ObjectId;
var cors_1 = __importDefault(require("cors"));
//-----------Schema of restaurant document ----------------------------------
var RestaurantSchema_1 = __importDefault(require("./RestaurantSchema"));
var google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
var client = new google_maps_services_js_1.Client({});
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
};
var app = express_1.default();
var reponse;
//const uri ="mongodb://localhost:27017";
//app.use(bodyParser.json());
app.use(cors_1.default(corsOptions));
app.options('*', cors_1.default());
// let size =10;
// let page = 1;
//--------------------------- mongoose --------------------------------------
var uri = "mongodb://localhost:27017/test";
mongoose_1.default.connect(uri, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Mongo db connection sucess");
    }
});
//Requête HTTP GET http://localhost:8080/find-all-resto
app.get("/find-all-resto", function (req, resp) {
    RestaurantSchema_1.default.find(function (err, books) {
        if (err) {
            resp.status(500).send(err);
        }
        else {
            resp.send(books);
        }
    });
});
//Requête HTTP GET http://localhost:8080/find-all-resto?size=10&page=2
app.get("/find-paginate-resto", function (req, resp) {
    var p = parseInt(req.query.page || 1);
    var size = parseInt(req.query.size || 5);
    RestaurantSchema_1.default.paginate({}, { page: p, limit: size }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
//Requête HTTP GET http://localhost:8080/find-all-resto?size=10&page=2&name=Morri
app.get("/find-resto-by-name", function (req, resp) {
    var p = parseInt(req.query.page || 1);
    var size = parseInt(req.query.size || 5);
    var keyword = req.query.name || '';
    RestaurantSchema_1.default.paginate({ name: { $regex: ".*(?i)" + keyword + ".*" } }, { page: p, limit: size }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
//---------------------------End mongoose --------------------------------------
//--------------------------- MongoClient --------------------------------------
mongodb_1.default.connect(uri, function (error, db) {
    if (!error) {
        console.log("success to mongodb connector");
        var dbClient_1 = db.db("test").collection("restaurants");
        //-------------------------------CRUD Function for Esatic Server side node js project-----------------------------------------------------------
        //Requête HTTP GET http://localhost:8080/restaurants
        app.get("/restaurants", function (req, res) {
            var page = parseInt(req.query.page || 1);
            // idem si present on prend la valeur, sinon 10
            var size = parseInt(req.query.size || 10);
            dbClient_1.find()
                .skip(size * page)
                .limit(size)
                .toArray()
                .then(function (arr) { return res.send(arr); });
        });
        app.get("/restau-cords", function (req, res) {
            var latSup = parseFloat(req.query.lat) + 10;
            var latInf = parseFloat(req.query.lat) - 10;
            console.log("Cords GPS sending");
            var longSup = parseFloat(req.query.long) + 10;
            var longInf = parseFloat(req.query.long) - 10;
            dbClient_1.find({ "address.coord.0": { $lt: parseFloat(req.query.lat) } }).sort({ "address.coord.0": -1, "address.coord.1": -1 })
                .skip(3)
                .limit(3)
                .toArray()
                .then(function (arr) { return res.send(arr); });
            // res.send({msg:"la partie de recherche en fonction de la position la marche bien",
            // lat:req.query.lat,
            // long:req.query.long})
        });
        app.get("/restaurants/:id", function (req, rep) {
            var id = req.params.id;
            console.log(id);
            var idObject = { _id: ObjectId(id) };
            dbClient_1.findOne(idObject, function (error, data) {
                if (!error) {
                    reponse = {
                        succes: true,
                        restaurant: data,
                        error: null,
                        msg: "Details du restaurant envoyés"
                    };
                }
                else {
                    reponse = {
                        succes: false,
                        restaurant: null,
                        error: error,
                        msg: "erreur lors du find"
                    };
                }
                ;
                rep.send(reponse);
            });
        });
        app.post("/restaurants", function (req, rep) {
            dbClient_1.insertOne(req.body, function (error, data) {
                if (!error) {
                    reponse = {
                        succes: true,
                        restaurant: data,
                        error: null,
                        msg: "Details du restaurant envoyés"
                    };
                }
                else {
                    reponse = {
                        succes: false,
                        restaurant: null,
                        error: error,
                        msg: "erreur lors du find"
                    };
                }
                ;
                rep.send(reponse);
            });
        });
        app.put("/restaurants/:id", function (req, rep) {
            var id = req.params.id;
            console.log(id);
            var idObject = { _id: ObjectId(id) };
            dbClient_1.replaceOne(idObject, req.body, function (error, data) {
                if (!error) {
                    reponse = {
                        succes: true,
                        restaurant: data,
                        error: null,
                        msg: "Details du restaurant envoyés"
                    };
                }
                else {
                    reponse = {
                        succes: false,
                        restaurant: null,
                        error: error,
                        msg: "erreur lors du find"
                    };
                }
                ;
                rep.send(reponse);
            });
        });
        app.delete("/restaurants/:id", function (req, rep) {
            var id = req.params.id;
            console.log(id);
            var idObject = { _id: ObjectId(id) };
            dbClient_1.deleteOne(idObject, function (error, data) {
                if (!error) {
                    reponse = {
                        succes: true,
                        restaurant: data,
                        error: null,
                        msg: "Details du restaurant envoyés"
                    };
                }
                else {
                    reponse = {
                        succes: false,
                        restaurant: null,
                        error: error,
                        msg: "erreur lors du find"
                    };
                }
                ;
                rep.send(reponse);
            });
        });
        //--------------------------- MongoClient --------------------------------------
        //------------------------------- End CRUD Function for Esatic Server side node js project-----------------------------------------------------------
    }
    else {
        console.log("Failed to mongodb connector");
        console.log(error);
    }
});
app.get("/", function (req, res) {
    res.send("Express fonctionne correctement");
});
app.listen(8080, function () {
    console.log("Server Started");
});
//# sourceMappingURL=index.js.map