import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        maxlength: 30
    },
    tone: {
        type: String,
        required: true,
        maxlength: 10
    },
    image: {
        type: String,
        required: true
    }
});

export const productModel = model('products', productSchema);

