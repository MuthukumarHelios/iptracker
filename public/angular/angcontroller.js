angular.module('angcontroller',[])
.controller('maincontroller', function($scope, $http,$window) {
  
// simple Static data 
 
  $scope.test = "Static Data";
                        console.log("hello, controllerx");
                        $scope.disconnect = () => {

                            $http.get("/disconnect").then(result => {
                                alert("Disconnected");

                            }).catch(er => {
                                console.log(er.message);
                                alert("please check your internet conncetivity");
                            })
                           console.log("disconnect");
                        }

 // before pull
  //connect the user for 

                    $scope.connect = () => {
                        $http.get('http://ipv4.myexternalip.com/json').then(value => {
                            alert("connected");   
                        return value.data;
                          }).then(externalip => {
                              console.log(externalip)
                          $http.post('/connect',{externalip: externalip.ip}).then(value => {
                             console.log("after machine ip",value.data);
                             
                            })
                      }).catch(er => {
                           
                           console.log(er.message);
                        })
                              console.log("coonnected");
                        
                          }

});