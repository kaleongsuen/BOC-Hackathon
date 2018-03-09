/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

const mysql = require('mysql');
const connection = mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password : 'akea0462',
  database: 'queueDB'
});

connection.connect(function(error) {
  if(error){
    console.log('error' + error);
  } else{ 
    console.log('db success');
  } 
});

app.get('/getTicket',function(req,res){
	console.log('{"name":"'+savejson.ticket_name+'", "phone":"'+savejson.ticket_phone_num+'", "service":"'+savejson.ticket_type+'", "branch":"'+savejson.ticket_branch+'"}');
	
	var obj = JSON.parse('{"name":"'+savejson.ticket_name+'", "phone":"'+savejson.ticket_phone_num+'", "service":"'+savejson.ticket_type+'", "branch":"'+savejson.ticket_branch+'"}');
	console.log(obj);
	res.render('temp.ejs',obj);
});

// app.get('/checkqueue.html', function(req, res) {
//   console.log('in get');
//   // res.sendFile(path.join(__dirname+ '/checkqueue.html'));
// });

app.post('/checkcurrent.html', function(req, res){
console.log('in post');
  var jsondata = req.body;
  var values = [];
  console.log('json: ')
  console.dir(jsondata);
  var id = jsondata[0].value;
  console.log("id: " + id);
  //Select all customers and return the result object:
  var sql = "SELECT * FROM queue where phone = \"" + id + "\"";
  console.log("sql" + sql);
  connection.query(sql, function (err, result, fields) {
    if (err) 
      throw err; 
    else{
      //res.send('select success');
      console.log(result);
      res.send(result);
    }
    

  });

});

app.post('/queuenow.html', function(req, res){
console.log('in post');
  var jsondata = req.body;
  var values = [];
  console.log('json: ')
  console.dir(jsondata);
  var service = jsondata[0].value;
  var branch = jsondata[1].value;
  console.log("service: " + service + "branch: " + branch);
  //Select all customers and return the result object:
  var sql = "SELECT MAX(Qpos) resultPOS FROM queue where service = \"" + service + "\"" + " AND branch = \"" + branch + "\"";
  console.log("sql" + sql);
  connection.query(sql, function (err, result, fields) {
    if (err) 
      throw err; 
    else{
      //res.send('select success');
      console.log(result);
      res.send(result);
    }
  });

});




app.post('/queue.html', function(req, res) {

  var jsondata = req.body;
  var values = [];
  console.log('json: ')
  console.dir(jsondata);
  var currentPos;
  
  var selsql = "SELECT MAX(Qpos) position FROM queue where service = \"" + jsondata[2].value + "\" AND branch = \"" + jsondata[3].value + "\"";
  console.log(selsql);
  connection.query(selsql, function(err, result, fields){
    if (err){
      throw err;
      console.log("select qpos error");
    }
    currentPos = result[0].position;
    //currentPos = currentPos.MAX(Qpos);
    console.log("Qpos :");
    console.log(result);
    if (currentPos == null){
      currentPos = 0;
    } 
    console.log("currentPos" + currentPos);


        console.log("currentPos2: " + currentPos);
    values.push([(currentPos + 1),jsondata[0].value,jsondata[1].value,jsondata[2].value,jsondata[3].value]);
 // }
  console.log('values:');
  console.log(values);
//Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
connection.query('INSERT INTO queue (Qpos, name, phone, service, branch) VALUES ?', [values], function(err,result) {
  if(err) {
    console.log('fail');
    
    console.log(err.errno);
    var errorCode = err.errno;
    errorCode = errorCode.toString();
    
    res.send(errorCode);
 }
 else {
  console.log('suc');
  var ressql = "SELECT * FROM queue where name = \"" + jsondata[0].value + "\" AND phone = \"" + jsondata[1].value + "\" AND service = \"" + jsondata[2].value + "\" AND branch = \"" + jsondata[3].value + "\"";
  console.log("ressql: " + ressql);
  connection.query(ressql, function(err, result, fields){
    if (err){
      throw err;
      console.log("select qpos error");
    } else {
      console.log(result);

      res.send(result);
      console.log('res send result');
    }
  });
}
});
  });
 // for(var i=0; i< jsondata.length; i++){
    //console.log(jsondata[i].value);


// connection.query("SELECT * FROM queue", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });

});
// Create the service wrapper*/
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  //'username': process.env.CONVERSATION_USERNAME,
  //'password': process.env.CONVERSATION_PASSWORD,
  'version_date': '2017-05-26'
});

// Endpoint to be call from the client side

app.post('/api/bocapi', function(req, res) {// here is the api created by me
	// Money Transfer
	console.log(req);//want to see the code is successfully recieved or not
	//to create/add thing to a json with a object output.text for print in front end
	//rem to create a object input, otherwise conversation.js(front end that one) :119 will crash
	return savejson;
});

app.get('/returnCode',function(req,res){
	console.log("get into the app.get function..");
	console.log("code: "+req.query.code);
	//acode = req.query.code;
	var request = require("request");
		request.post({url:'https://api.au.apiconnect.ibmcloud.com/bochkhackathon-2018/sandbox/oauth2/token', 
			form:{ grant_type: 'authorization_code',
				client_id: 'b7f2d064-9280-4689-8b6c-f9d9e7e2376b',
				client_secret: 'dD6jR2sG1eR1lH5iL4pD0vR4uU8lR6oC8sX4vM0yR8cY2wJ8dI',
				code: req.query.code,
				redirect_uri: 'http://127.0.0.1:3000/returnCode'}
			}, function(err, rescode, body){
				var result = JSON.parse(body);
				console.log('Success:', result.access_token);
				if(action == "money_transfer"){//money transfer
					var request2 = require("request");
					var options = { method: 'POST',
						url: 'https://api.au.apiconnect.ibmcloud.com/bochkhackathon-2018/sandbox/api/accounts/1268811111112/money-transfer',
						headers:{ accept: 'application/json',
							'content-type': 'application/json;',
							authorization: 'Bearer '+result.access_token },
						body:{ amount: savejson.amount,
							currency: savejson.currency,
							dst_account_no: savejson.dst_account_no,
							remark: 'bawe' },
						json: true 
					};
					request2(options, function (error, resp1, body1) {
						if (error) return console.error('Failed: %s', error.message);
						console.log('Success: ', body1);
						var jsondata = JSON.stringify(body1);
						console.log(body1.src_balance_after);
						body1.src_balance_after.toString();//'Comfiration data of your current action: '+ hi.src_balance_after + ' ' + hi.dst_account_name;
						//clear the action & code & savejson
						acode = body1;
						console.log("In request2 - acode="+acode);
						res.send('<script>window.location.replace("http://127.0.0.1:3000/chatbot.html")</script>');
					});
				}else if(action == "check_balance"){
					console.log("enter check balance");
					var request2 = require("request");
					var options = { method: 'GET',
						url: 'https://api.au.apiconnect.ibmcloud.com/bochkhackathon-2018/sandbox/api/accounts',
						headers:{ accept: 'application/json',
							authorization: 'Bearer '+result.access_token }
					};
					request2(options, function (error, resp1, body1) {
						if (error) return console.error('Failed: %s', error.message);
						console.log('Success: ', body1);
						//var jsondata = JSON.parse(body1);
						//console.log(body1.src_balance_after);
						//body1.src_balance_after.toString();//'Comfiration data of your current action: '+ hi.src_balance_after + ' ' + hi.dst_account_name;
						//clear the action & code & savejson
						acode = body1;
						//console.log(body1[0].account_no);
						//console.log("In request2 - acode="+acode);
						res.send('<script>window.location.replace("http://127.0.0.1:3000/chatbot.html")</script>');
					});
				}
		});
});


app.post('/api/message', function(req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }

	
    return res.json(updateMessage(payload, data));
  });
});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */
 
let chatHistory = [];//optional currently
let action;//save the current action for above
let savejson;
let acode;// save the data json before redirect to the boc login page
let times = 0;

function updateMessage(input, response) {
	console.log('trigger', times);
	times++;
	let actualRes;
  var responseText = null;
  //chatHistory.push(response)
  if (!response.output) {
		response.output = {};
		if (response.intents && response.intents[0]) {
		var intent = response.intents[0];
		// Depending on the confidence of the response the app can return different messages.
		// The confidence will vary depending on how well the system is trained. The service will always try to assign
		// a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
		// user's intent . In these cases it is usually best to return a disambiguation message
		// ('I did not understand your intent, please rephrase your question', etc..)
		if (intent.confidence >= 0.75) {
		  responseText = 'I understood your intent was ' + intent.intent;
		} else if (intent.confidence >= 0.5) {
		  responseText = 'I think your intent was ' + intent.intent;
		} else {
		  responseText = 'I did not understand your intent';
		}
		
		response.output.text = responseText;
		return response;
	  }
  } else if(response.output.data && response.output.data.type == "money_transfer"){//money_transfer
	action = "money_transfer";//save the action
	savejson = response.output.data;//save the data
	console.log(savejson);
	
	console.log("Money transfer user login");
	
	return response;
  }	else if(response.output.data && response.output.data.type == "check_balance"){//check balance
	  action = "check_balance";
	  console.log("Money transfer user login");
	  return response;
  }else if(acode && action && response.output.text){//check code && action
		
		console.log("- Inside if -");
			if(action == "money_transfer"){
				var newe = "You successfully transfered money to "+ acode.dst_account_name +", and your account balance of ****8111***12 is $"+ acode.src_balance_after +".<br>Is there anything more I can help you? ><";
				response.output.text = newe;
				console.log("new", newe);
				console.log("BEFORE RETURN & in WHILE acode.src_balance_after="+acode.src_balance_after);
				console.log("BEFORE RETURN & in WHILE response="+response);
				action = null;
		acode = null;
		savejson = null;
				return response;
			}else if(action == "check_balance"){
				response.output.text = "Your accounts balances are shown below<br>";
				console.log(acode);
				var jsonData = JSON.parse(acode);
				for (var i in jsonData) {
					var counter = jsonData[i];
					console.log(counter.account_no);
					response.output.text = response.output.text.concat('Account number( ' + counter.account_no + ' ):<br>');
						for(var j in counter.balances){
							var count = counter.balances[j];
							console.log(count.currency + ' ' + count.balance);
							response.output.text = response.output.text.concat(count.currency + ' : ' + count.balance + '<br>');
						}
				}
				response.output.text = response.output.text.concat("What can I help you else? ^^");
				action = null;
				acode = null;
				savejson = null;
				return response;
			}
		//console.log("AFTER WHILEresponseText="+responseText);
		
		
	}else if(response.output.data && response.output.data.type == "ticket"){//money_transfer
		action = "ticket";//save the action
		savejson = response.output.data;//save the data
		console.log(savejson);
		console.log("ticketticketticketticket");
		
	return response;
  }
	else{
		delete response.output.data;
		return response;
	}
}
module.exports = app;
