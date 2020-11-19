const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SiteSchema = new Schema({
    id:{
        type:String,
        required:true
    },
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true 
    },
    text: {
        type: String,
        required: true
    },
    createTime:{
        type: String
    }
});

module.exports = Board = mongoose.model('board', SiteSchema);