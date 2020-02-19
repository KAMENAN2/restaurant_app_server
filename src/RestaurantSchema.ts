//imports des dependances necessaires
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";

//declaration des constantes
let restaurantSchema=new mongoose.Schema({
    address :{building:String,coord:[Number,Number],street:String,zipcode:String},
    borough:String,
    cuisine:String,
    grades:[{date:String,grade:String,score:Number}],
    name:String,
    restaurant_id:String
});

// utilisation de la constante restaurantSchema
restaurantSchema.plugin(mongoosePaginate);
const Restaurants=mongoose.model("restaurant",restaurantSchema);
export default Restaurants;
