var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


var userschema = new Schema({
     localip          : {type:String},
     machineip        : {type:String, unique:true},
     externalip       : {type:String},    
     connected_at     : {type:Date},    
     disconnected_at  : {type: Date},
     created_at       : { type: Date, default: Date.now }

 });



mongoose.connect('mongodb://localhost/eproadcast', {
    // using mongoose client to avoid promises exception
    useMongoClient: true,
  });


module.exports = {
    user: mongoose.model('user',userschema)
}