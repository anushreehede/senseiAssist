// using alexa sdk
var Alexa = require('alexa-sdk');

// importing storage.js
var storage = require('./storage');

// Exporting the handler to the lambda function
exports.handler = function(event,context,callback) {
    // Create Alexa handler
    var alexa = Alexa.handler(event, context);
    alexa.appId = 'xxxx'; // App ID given on Amazon Developers console
    
    // Register all the handlers
    alexa.registerHandlers(newSessionHandlers, ProjectHandlers, startProjectHandler, retrieveProjectHandler, updateProjectHandler, deleteProjectHandler);
    // Execute
    alexa.execute();

};

// The different states in the skill
var states = {
    STARTMODE: "_STARTMODE", // to start a session to give Alexa an order
    PROJECTMODE: "_PROJECTMODE",  // to add a project
    FETCHMODE: "_FETCHMODE", // to fetch project details
    UPDATEMODE: "_UPDATEMODE", // to update project details 
    DELETEMODE: "_DELETEMODE", // to delete a project
};

// This will short-cut any incoming intent or launch requests and route them to this handler.
var newSessionHandlers = {
    // The main intent of this handler
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

    // Intent to start/create a new project, asks for the project name
    "StartProject": function(){
        this.handler.state = states.PROJECTMODE;
        this.emit(':ask', 'Alright, tell me all the project details one by one. Start with the project name. ');
    },
    // Intent to fetch the details of a project, asks for the project name
    "FetchProject": function(){
        this.handler.state = states.FETCHMODE;
        this.emit(':ask', 'Tell me the project name which you would like to retrieve?');
    },
    // Intent to update the details of a particular project
    "UpdateProject": function(){
        this.handler.state = states.UPDATEMODE;
        this.emit(':ask', 'Which project would you like to update?');
    },
    "DeleteProject": function(){
        this.handler.state = states.DELETEMODE;
        this.emit(':ask', 'Tell me the project name which you would like to delete?');
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
    'Email': '',
    'Deadline': '',
    'Status': ''
};

// The handler to add/start a new project 
var startProjectHandler = Alexa.CreateStateHandler(states.PROJECTMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    
    // asks for the sub task
    'AddSubtaskIntent': function() {
        project['ProjectName'] = this.event.request.intent.slots.ProjectName.value;
        this.emit(':ask', "What is the sub task");
    },
    
    // asks for the project incharge and their email
    'AddInchargeIntent': function() {
        project['SubTask'] = this.event.request.intent.slots.SubTask.value;
        this.emit(':ask', "Who is incharge and what is their email id?");
    },
    
    // asks for the deadline
    'AddDeadlineIntent': function() {
        project['ProjectIncharge'] = this.event.request.intent.slots.ProjectIncharge.value;
        project['Email'] = this.event.request.intent.slots.Email.value;
        this.emit(':ask', "When is the deadline");
    },
    
    // asks for the status
    'AddStatusIntent': function(){
        project['Deadline'] = this.event.request.intent.slots.Deadline.value ;
        this.emit(':ask',"What is the status");
    },
    
    // saves project details in dynamodb database
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
    
    // asks for the sub task
    "FetchSubtask": function(){
        project['ProjectName'] = this.event.request.intent.slots.ProjectName.value;
        this.emit(':ask', 'What is the sub task?');
    },
    
    // fetches the project details 
    "FetchFinalIntent": function(){
        project['SubTask'] = this.event.request.intent.slots.SubTask.value;
        storage.getProject(project, (fetch_project) => {
            this.handler.state = states.STARTMODE;
            response = 'The project name is: '+fetch_project.ProjectName+', the project sub task is: '+fetch_project.SubTask+', the project incharge is: '+fetch_project.ProjectIncharge+', the deadline is: '+fetch_project.Deadline+', the status is: '+fetch_project.Status+'. What would you like to do now?';
            this.emit(':ask', response);
        });
    }
});

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
    // asks for subtask to update
    'UpdateProjectName': function(){
        project['ProjectName'] = this.event.request.intent.slots.ProjectName.value;
        this.emit(':ask', "What is the sub task?");
    },
    
    // asks whether we want to update status, deadline or project incharge details
    'UpdateSubtask': function(){
        project['SubTask'] = this.event.request.intent.slots.SubTask.value;
        this.emit(':ask', "What would you like to update in this project?");
    },
    
    // updates the deadline in dynamodb
    "UpdateDeadline": function(){
        project['Deadline'] = this.event.request.intent.slots.Deadline.value;
        storage.updateDeadline(project, ()=> {
                this.handler.state = states.STARTMODE;
                this.emit(":ask", "Your project deadline has been updated . What would you like to do now?");
        });
    },
    
    // updates the status in dynamodb
    "UpdateStatus": function(){
        project['Status'] = this.event.request.intent.slots.Status.value;
        storage.getProject(project, (fetch_project) => {
            storage.updateStatus (fetch_project, project['Status'], () => {
                this.handler.state = states.STARTMODE;
                this.emit(":ask", "Your project status has been updated. What would you like to do now?");
           });
        });
    },
    
    // updates the email in dynamodb
    "UpdateEmail": function(){
        project['ProjectIncharge'] = this.event.request.intent.slots.ProjectIncharge.value;
        project['Email'] = this.event.request.intent.slots.Email.value;
        storage.updateEmail(project, ()=> {
                this.handler.state = states.STARTMODE;
                this.emit(":ask", "Your project incharge details have been updated . What would you like to do now?");
        });
    },
});

// The handler to delete all project details
var deleteProjectHandler = Alexa.CreateStateHandler(states.DELETEMODE, {
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
    
    // asks for the sub task
    "DeleteSubTask":function() {
        project['ProjectName'] = this.event.request.intent.slots.ProjectName.value;
        this.emit(':ask', "What is the sub task");
    },
    
    // deletes the project details from dynamodb 
    "DeleteFinalIntent": function(){
        project['SubTask'] = this.event.request.intent.slots.SubTask.value;
        storage.deleteProject(project, () => {
            this.handler.state = states.STARTMODE;
            response = 'The project you requested has been deleted. What would you like to do now?';
            this.emit(':ask', response);
        });
    }
});
