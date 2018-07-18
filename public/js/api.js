// The Api module is designed to handle all interactions with the server

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,
	callbocapi: callbocapi,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    }
  };

  // Send a message request to the server
  function sendRequest(text, context) {
    // Build request payload
    var payloadToWatson = {};
    if (text) {
      payloadToWatson.input = {
        text: text
      };
    }
    if (context) {
      payloadToWatson.context = context;
    }

    // Built http request
    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
		console.log("hi before if");
		
		
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
		 console.log("hi");
		 console.log(http.responseText);
		 //var obj = JSON.parse(http.responseText);
		 //console.log("json", obj);
		 console.log(http.responseText);
		  obj=JSON.parse(http.responseText);
		  if(obj.output.hasOwnProperty("data")){
			  if(obj.output.data.type == "ticket"){
			  window.location.href="http://localhost:3000/getTicket";}
        else if(obj.output.data.type == "money_transfer" || obj.output.data.type == "check_balance"){
			  console.log("hi i come to here");
			  window.location.assign("https://api.au.apiconnect.ibmcloud.com/bochkhackathon-2018/sandbox/oauth2/authorize?response_type=code&client_id=b7f2d064-9280-4689-8b6c-f9d9e7e2376b&redirect_uri=http://127.0.0.1:3000/returnCode&scope=all");
			  }
		  }//(leave the current webpage)*/
		  
		 Api.setResponsePayload(http.responseText);
     //window.scrollTo(0, document.getElementById('scrollingChat').clientHeight;);
      }
    };

    var params = JSON.stringify(payloadToWatson);
    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
    }

    // Send request
    http.send(params);
  }
  
  function callbocapi(code){
	  //here to send a json with access code to backend
	  var http = new XMLHttpRequest();
	  http.post('/api/bocapi', { acode: code}).then(function(req){
		  console.log('callbocapi sent to api and receive success')
	  });
	  console.log(req);
	  return req;
  }
}());
