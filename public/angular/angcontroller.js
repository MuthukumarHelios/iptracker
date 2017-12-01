
angular.module('angcontroller',[])
.controller('maincontroller', function($scope, $http,$window) {
// simple Static data 



// @object IP @Params{External ip}

                                   $http.get('http://ipv4.myexternalip.com/json').then(value => {

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
                        
                              $scope.connect = () => {
                                   console.log('connected');                               
                            }


// disconnect module
          

// @params {Window Component to close the window}
window.onbeforeunload = confirmExit;

  $scope.test = "Static Data";
                        
  
                        function confirmExit() {
                                               
                       
                        
                            $http.get("/disconnect").then(result => {

                            }).catch(er => {                               
                            })
                           console.log("disconnect");
                       
                        }
                        



});