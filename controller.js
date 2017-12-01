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

fs.writeFile('file.txt', 'hey node testing you', (er, data) => {
    if(er){
        console.log("eror whl");
    }
    console.log('suc');
})

fs.appendFile('file.txt',(er, suc) => {
    if(er){throw er;}
      console.log('success')
});
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

        // will be interpreted as a float @params Number.
        dbdata.count = new Number(1);        
        dbdata.disconnect_count = new Number(0);
        user.create(dbdata).then(result => {
            console.log("duplication",result);              
          }).catch(er => {

            //  used to check when he is connected
             
        if(er.message.substring(0,6) == 'E11000'){              
            user
                .findOne(
                    {machineip:addresses[0]})                
            .then(result => {                        
                return result;
            }).then(result => {
                    console.log("connected",result);
                         console.log('times', ++result.count)
                         user
                         .update(
                             {machineip:addresses[0]},
                             {$set:
                                {count: ++result.count}})
                         .then(value => {
                          
                            console.log(value);
                         }) 
                       }).catch(err =>console.log(err.message));
              }            
         })
        res.json(dbdata);

 });



 router.get("/ip",(req, res) => {
     user.find({}).then(result => {
         res.json(result);
     }) 
    // res.json(addresses);
 });


// @params current disconnected timestamps and How many times he disconnected
 router.get("/disconnect", (req, res) => {
        console.log('api hittend');
        user
        .findOne(
            {machineip:addresses[0]})                
          .then(result => {                        
              console.log("disconnect find query",result)
            return result;
          })
        .then(result => {
             user.update({machineip:addresses[0]},{$set:{
              disconnected_at: new Date(),
              disconnect_count: ++result.disconnect_count
         }})
         .then(result1 => {             
               res.json(result1);
         })
       })
    .catch(er => {
         res.json({error: true, message: "Something went wrong"});
       })     
 


})


module.exports = router;