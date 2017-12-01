const router  = require('express').Router();
const   {user}  = require('./database.js');
const util = require('util');
const fs = require('fs');
//to get the machine ip
// @params {logFile} fs - in append mode  
var logFile = fs.createWriteStream(__dirname+'file.log', {flags: 'w'});
// log function 

var log = function(d) { 
    logFile.write(util.format(d,'date', new Date) + '\n');    
};

logFile.write(util.format('tested locally','date', new Date) + '\n');

console.log("helo");
log('tested');

var os = require('os');
var interfaces = os.networkInterfaces();


var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
    //    display Ipv4 @params {ipaddress};

        if (address.family === 'IPv4' && !address.internal) {         
             addresses.push(address.address);
        }
    }
}





router.post ('/connect', (req, res) => {


    // split the local ip with subnet Mask 
    //@params{ipaddress - local}
      let dbdata = {};      
      let ip = req.ip.split(':');

    //    machine ip @Params {network interfaces}


console.log(addresses);

   dbdata.localip = ip[3];
    dbdata.machineip = addresses[0];     
        dbdata.externalip = req.body.externalip;        
        user.create(dbdata).then(result => {
             log('connected')
            console.log("duplication",result);              
          }).catch(er => {
            //  used to check when he is connected
             
              if(er.message.substring(0,6) == 'E11000'){                 
                  user.update({machineip:addresses[0]},{$set:{
                         connected_at: new Date()
                       }}).then(result => {
                           console.log('connected');
                           log('connected on same device');
                       }).catch(err =>console.log(err.message));
              }            
         })
        res.json(dbdata);

 });



 router.get("/ip",(req, res) => {
      res.json(addresses);
 });


// @params 
 router.get("/disconnect", (req, res) => {
        log('check discnnect');
 
   user.update({machineip:addresses[0]},{$set:{
    disconnected_at: new Date()
   }})
    .then(result => {
       console.log("disconnect",result);
        log('disconneted');
             res.json(result);
  }).catch(er => {
      res.json({error: true, message: "Something went wrong"});
  })     
 })


module.exports = router;