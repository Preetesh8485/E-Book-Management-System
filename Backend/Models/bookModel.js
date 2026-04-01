import mongoose from "mongoose";
const bookSchema= new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    ISBN:{type: String,
    required: true,
    unique: true,
    trim: true},
    author:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    location:{type:String,required:true,trim:true},
   price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"]
},
quantity: {
    type: Number,
    required: true,
    min: [0, "Quantity cannot be negative"]
},
    availability:{type:Boolean,default:true},
},{
    timestamps:true
});
export const Book = mongoose.model("book",bookSchema);