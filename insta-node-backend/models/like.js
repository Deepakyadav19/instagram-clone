const mongoose = require('mongoose');
const schema = require('../schemas');
const likeSchema = mongoose.Schema(schema.likes);
class Like{

    constructor(){
        this.model = mongoose.model('Like', likeSchema);
    }

    async get(criteria = {}, columns = {}){
        return this.model.findOne(criteria, columns);
    }

    async log(criteria = {}, columns={}){
        return this.model.find(criteria, columns);
    }

    async save(likeObj){
        return this.model.create(likeObj);
    }

    async updateOne(criteria = {}, updateObj){
        return this.model.updateOne(criteria, updateObj);
    }

    async deleteOne(criteria){
        return this.model.deleteOne(criteria);
    }
}
module.exports = new Like();