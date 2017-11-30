const router  = require('express').Router();
var   {user}  = require('./database.js');

//to get the machine ip

var os = require('os');
var interfaces = os.networkInterfaces();



var addresses = [];
// display only private ip
// iterate all the network interface ip
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
    //    display Ipv4 @params {ipaddress};

        if (address.family === 'IPv4' && !address.internal) {         
             addresses.push(address.address);
        }
    }
}





router.post ('/api', (req, res) => {


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
            console.log(result);      
           }).catch(er => {
            console.log(er.message);
         })
        res.json(dbdata);
 });


 router.get("/ip",(req, res) => {
      res.json(addresses);
 });



 router.get("/disconnect", (req, res) => {
 console.log(address[0]);
    user.find({})

//    user.update({machineip:addresses[0]},{$set:{
//     disconnected_at: new Date()
//    }})
    .then(result => {
       console.log("disconnect",result);
             res.json(result);
  }).catch(er => {
      res.json({error: true, message: "Something went wrong"});
  })     
 })



module.exports = router;