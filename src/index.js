//using alexa sdk
var Alexa = require('alexa-sdk');
//using aws sdk and connecting to dynamoDB
var AWS = require('aws-sdk')
var docClient = new AWS.DynamoDB.DocumentClient({region: "eu-east-1"});
var storage = require('./storage');

// Exporting the handler to the lambda function
exports.handler = function(event,context,callback) {

    var alexa = Alexa.handler(event, context);
    alexa.appId = 'amzn1.ask.skill.39abddd6-719b-4358-b2fb-cf47d5a281e2'; // App ID given on Amazon Developers console
    alexa.registerHandlers(newSessionHandlers, ProjectHandlers, startProjectHandler, retrieveProjectHandler, updateProjectHandler);
    alexa.execute();

};

// The different states in the skill
var states = {
    STARTMODE: "_STARTMODE", // to start a session to give Alexa an order
    PROJECTMODE: "_PROJECTMODE",  // to add a project
    FETCHMODE: "_FETCHMODE", // to fetch project details
    UPDATEMODE: "_UPDATEMODE" // to update project details 
};

// This will short-cut any incoming intent or launch requests and route them to this handler.
var newSessionHandlers = {
    'NewSession': function() {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', "Welcome to Sensei office assistant, what can i do for you?");
    },
    "AMAZON.StopIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", "Goodbye!");
    },
    'Unhandled': function() {
        this.emit(':tell', "This intent is unhandled");
    }
};

// Has a list of intents which can be routed easily using the other different handlers 
var ProjectHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },

    "StartProject": function(){
        this.handler.state = states.PROJECTMODE;
        this.emit(':ask', 'Alright, tell me all the project details one by one. Start with the project name. ');
    },
    "FetchProject": function(){
        this.handler.state = states.FETCHMODE;
        this.emit(':ask', 'Tell me the project name which you would like to retrieve?');
    },
    "UpdateProject": function(){
        this.handler.state = states.UPDATEMODE;
        this.emit(':ask', 'What would you like to update?');
    },
    "AMAZON.StopIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", "Goodbye!");
    },
    "Unhandled": function(){
        this.emit(':ask', 'This intent is unhandled');
    }
});

// project values dictionary
var project = {
    'ProjectName': '',
    'SubTask': '',
    'ProjectIncharge': '',
    'Deadline': '',
    'Status': ''
};

// The handler to add/start a new project 
var startProjectHandler = Alexa.CreateStateHandler(states.PROJECTMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },

    'AddSubtaskIntent': function() {
        project['ProjectName'] = this.event.request.intent.slots.ProjectName.value;

        this.emit(':ask', "What is the sub task");
    },
    'AddInchargeIntent': function() {
        project['SubTask'] = this.event.request.intent.slots.SubTask.value;

        this.emit(':ask', "Who is incharge?");
    },
    'AddDeadlineIntent': function() {
        project['ProjectIncharge'] = this.event.request.intent.slots.ProjectIncharge.value;

        this.emit(':ask', "When is the deadline");
    },
    'AddStatusIntent': function(){
        project['Deadline'] = this.event.request.intent.slots.Deadline.value ;

        this.emit(':ask',"What is the status");
    },
    'AddFinalIntent': function(){
        project['Status'] = this.event.request.intent.slots.Status.value ;
        storage.save(project, () => {
                this.handler.state = states.STARTMODE;
                this.emit(":ask", "Your project and subtask has been recorded. What would you like to do now?");
        });
    },
    "AMAZON.StopIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", "Goodbye!");
    },
    'Unhandled': function() {
        this.emit(':tell', "This intent is unhandled");
    }
});

// The handler to fetch/retrieve Deadline, Project Incharge and Status values
var retrieveProjectHandler = Alexa.CreateStateHandler(states.FETCHMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    "AMAZON.StopIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", "Goodbye!");
    },
    'Unhandled': function() {
        this.emit(':tell', "This intent is unhandled");
    },
    "FetchSubTask":function() {
        project['ProjectName'] = this.event.request.intent.slots.ProjectName.value;

        this.emit(':ask', "What is the sub task");
    },
    "FetchFinalIntent": function(){
        project['SubTask'] = this.event.request.intent.slots.SubTask.value;
        storage.getProject(project, (fetch_project) => {
            this.handler.state = states.STARTMODE;
            response = 'The project name is: '+fetch_project.ProjectName+', the project sub task is: '+fetch_project.SubTask+', the project incharge is: '+fetch_project.ProjectIncharge+', the deadline is: '+fetch_project.Deadline+', the status is: '+fetch_project.Status+'. What would you like to do now?';
            this.emit(':ask', response);
        });
    }
});

/******* Not yet debugged ********/

// The handler to modify/update the status or deadline of the project
var updateProjectHandler = Alexa.CreateStateHandler(states.UPDATEMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    "AMAZON.StopIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
      this.emit(':tell', "Goodbye!");  
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(":tell", "Goodbye!");
    },
    'Unhandled': function() {
        this.emit(':tell', "This intent is unhandled");
    },
    "UpdateDeadline": function(){

        this.emit(':ask', "what is the project name");
        var ProjectName = this.event.request.intent.slots.ProjectName.value;

        this.emit(':ask', "what is the sub task");
        var SubTask = this.event.request.intent.slots.SubTask.value;

        this.emit(':ask', "what is the deadline");
        var Deadline = this.event.request.intent.slots.SubTask.value ;

        var table = "SenseiProjects";

        var params = {

            TableName: table,
            Key: {
                "ProjectName":ProjectName ,
                "SubTask" : SubTask
            },
            UpdateExpression: "info.Deadline=:d",
            ExpressionAttributeValues: {
                ":d": Deadline
            }

        };



    },
    "UpdateStatus": function(){

        this.emit(':ask', "what is the project name");
        var ProjectName = this.event.request.intent.slots.ProjectName.value;

        this.emit(':ask', "what is the sub task");
        var SubTask = this.event.request.intent.slots.SubTask.value;

        this.emit(':ask', "what is the new status update");
        var Status = this.event.request.intent.slots.Status.value ;

        var table = "SenseiProjects";

        var params = {

            TableName: table,
            Key: {
                "ProjectName":ProjectName ,
                "SubTask" : SubTask
            },
            UpdateExpression: "info.Status=:s",
            ExpressionAttributeValues: {
                ":s": Status
            }

        };

    }
});