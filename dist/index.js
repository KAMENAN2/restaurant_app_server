"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var mongodb_1 = __importDefault(require("mongodb"));
var body_parser_1 = __importDefault(require("body-parser"));
var ObjectId = mongoose_1.default.Types.ObjectId;
var app = express_1.default();
var uri = "mongodb://localhost:27017";
app.use(body_parser_1.default.json());
// let size =10;
// let page = 1;
mongodb_1.default.connect(uri, function (error, db) {
    if (!error) {
        console.log("success to mongodb connector");
        var dbClient_1 = db.db("test").collection("restaurants");
        //-------------------------------CRUD Function for Esatic Server side node js project-----------------------------------------------------------
        /* Requête HTTP GET http://localhost:8080/restaurants */
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
        app.get("/restaurants/:id", function (req, rep) {
            var id = req.params.id;
            console.log(id);
            var reponse;
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