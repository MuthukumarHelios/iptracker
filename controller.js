const router  = require('express').Router();
const   {user}  = require('./database.js');
const chalk = require('chalk');
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


console.log("if Config ip",addresses);

   dbdata.localip = ip[3];
    dbdata.machineip = addresses[0];     
        dbdata.externalip = req.body.externalip;

        // will be interpreted as a float @params Number.
        dbdata.count = new Number(1);        
        dbdata.disconnect_count = new Number(0);
        user.create(dbdata).then(result => {
            console.log(chalk.green('connected'))    
            console.log("connected Count",result.count);
            console.log("Disconnected Count",result.disconnect_count);
                         
          }).catch(er => {

            //  used to check when he is connected with same device and maintaining the count
             
        if(er.message.substring(0,6) == 'E11000'){              
            user
                .findOne(
                    {machineip:addresses[0]})                
            .then(result => {                        
                
                return result;
            }).then(result => {
                console.log(chalk.green('aginconnected'))    
                console.log("connected Count",result.count);
                console.log("Disconnected Count",result.disconnect_count);
                user
                         .update(
                             {machineip:addresses[0]},
                             {$set:
                                {count: ++result.count}})
                         .then(value => {
                          
                           
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
 });


// @params current disconnected timestamps and How many times he disconnected
 router.get("/disconnect", (req, res) => {

       
    user
        .findOne(
            {machineip:addresses[0]})                
          .then(result => {         
              
            console.log(chalk.red('disconnected'));    
              console.log("connected Count",result.count);
              console.log("Disconnected Count",result.disconnect_count);
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
    // final error Handler for for above promises
       .catch(er => {
         res.json({error: true, message: "Something went wrong"});
       })     
})


module.exports = router;