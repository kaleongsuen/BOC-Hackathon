// Example 1: sets up service wrapper, sends initial message, and 
// receives response.

var ConversationV1 = require('watson-developer-cloud/conversation/v1');

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
    username: '1b57c060-baf7-403f-b87e-266ec61355f7', // replace with service username
    password: '6bUOOF2oqH7I', // replace with service password
    version_date: '2017-05-26'
});

var workspace_id = '15c40df4-0f65-4cb3-a0ca-595254197d5f'; // replace with workspace ID
var sentence = 'fuck';

// Start conversation
console.log('Me: ' + sentence);
conversation.message({
    workspace_id: workspace_id,
    input: {'text': sentence}
}, processResponse);

setTimeout(function() {
    sentence = 'hi';
    console.log('Me: ' + sentence);
    conversation.message({
        workspace_id: workspace_id,
        input: {'text': sentence}
    }, processResponse);
}, 3000);


setTimeout(function(){
    sentence = 'how are you';
    console.log('Me: ' + sentence);
    conversation.message({
        workspace_id: workspace_id,
        input: {'text': sentence}
    }, processResponse);
}, 6000);

// Process the conversation response.
function processResponse(err, response) {
    if (err) {
        console.error(err); // something went wrong
        return;
    }

    // Display the output from dialog, if any.
    if (response.output.text.length != 0) {
        console.log('Bot: ' + response.output.text[0]);
    }
    //console.log(JSON.stringify(response, null, 2));
}