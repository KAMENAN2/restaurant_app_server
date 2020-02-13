import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
let restaurantSchema=new mongoose.Schema({
    address :{building:String,coord:[Number,Number],street:String,zipcode:String},
    borough:String,
    cuisine:String,
    grades:[{date:String,grade:String,score:Number}],
    name:String,
    restaurant_id:String
});
restaurantSchema.plugin(mongoosePaginate);
const Restaurants=mongoose.model("restaurant",restaurantSchema);
export default Restaurants;
