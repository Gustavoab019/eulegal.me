//import { Mongoose } from "mongoose";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    dateAceita: {
        type: Date,
        required: true
    },
    dataCadastro: {
        type: Date,
        required: true
    }
}, {timestamps: true});

const allNames = mongoose.model('allNames', userSchema);
module.exports = allNames;

