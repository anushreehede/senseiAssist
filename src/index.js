// using alexa sdk
var Alexa = require('alexa-sdk');

// importing storage.js
var storage = require('./storage');

// Exporting the handler to the lambda function
exports.handler = function(event,context,callback) {
    // Create Alexa handler
    var alexa = Alexa.handler(event, context);
    //alexa.appId = 'xxxx'; // App ID given on Amazon Developers console
    
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
        this.emit(':ask', "Welcome to Sensei office assistant, what can I do for you?");
    },
    /*'LaunchRequest': function() {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', "Welcome to Sensei office assistant, what can I do for you?");
    },*/
    'AMAZON.HelpIntent': function() {
        this.emit(':ask', "Say launch office assist or open office assist to begin.");
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
        this.emit(':tell', "I didn't catch that!");
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
        this.emit(':ask', 'Tell me the project name which you would like to retrieve.');
    },
    // Intent to update the details of a particular project
    "UpdateProject": function(){
        this.handler.state = states.UPDATEMODE;
        this.emit(':ask', 'Which project would you like to update?');
    },
    "DeleteProject": function(){
        this.handler.state = states.DELETEMODE;
        this.emit(':ask', 'Tell me the project name which you would like to delete.');
    },
    "ProjectHelpIntent": function() {
        this.emit(':ask', 'Tell me whether you would like to add, retrieve, update or delete project details.');
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
        this.emit(':ask', "I didn't catch that! Say help menu if you aren't sure.");
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
    "AddHelpIntent": function() {
      this.emit(':ask', 'One by one, clearly mention each project detail you would like to add.');
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
        this.emit(':tell', "I didn't catch that! Say add help if you aren't sure.");
    }
});

// The handler to fetch/retrieve Deadline, Project Incharge and Status values
var retrieveProjectHandler = Alexa.CreateStateHandler(states.FETCHMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    "FetchHelpIntent": function(){
        this.emit(':ask', 'Say I want to fetch the project nameofproject followed by I want to fetch the sub task nameofsubtask.');
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
        this.emit(':tell', "I didn't catch that! Say fetch help if you aren't sure.");
    },
    
    // asks for the sub task
    "FetchSubtask": function(){
        project['ProjectName'] = this.event.request.intent.slots.ProjectName.value;
        this.emit(':ask', 'What is the sub task?');
    },
    
    // fetches the project details 
    "FetchFinalIntent": function(){
        project['SubTask'] = this.event.request.intent.slots.SubTask.value;
        storage.getProject(project, (response) => {
          if(!response){
              this.emit(':ask', "I couldn't find a project like that. Please tell me the project you want to fetch again.");
          } else{
            this.handler.state = states.STARTMODE;
            message = 'The project name is: '+response.ProjectName+', the project sub task is: '+response.SubTask+', the project incharge is: '+response.ProjectIncharge+', the deadline is: '+response.Deadline+', the status is: '+response.Status+'. What would you like to do now?';
            this.emit(':ask', message);
          }
        });
    }
});

// The handler to modify/update the status or deadline of the project
var updateProjectHandler = Alexa.CreateStateHandler(states.UPDATEMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    "UpdateHelpIntent": function() {
        this.emit(':ask', 'Say I want to update the project nameofproject then , I want to update the sub task nameofsubtask, followed by the field and its value to be updated.');
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
        this.emit(':tell', "I didn't catch that! Say update help if you aren't sure.");
    },
    // asks for subtask to update
    'UpdateProjectName': function(){
        project['ProjectName'] = this.event.request.intent.slots.ProjectName.value;
        this.emit(':ask', "What is the sub task?");
    },
    
    // asks whether we want to update status, deadline or project incharge details
    'UpdateSubtask': function(){
        project['SubTask'] = this.event.request.intent.slots.SubTask.value;
        storage.getProject(project, (response) => {
            if(!response){
                this.emit(':ask', "I couldn't find a project like that. Please tell me the project which you want to update again.");
            } else {
                this.emit(':ask', "What would you like to update in this project?");
            }
        });
    },
    
    // updates the deadline in dynamodb
    "UpdateDeadline": function(){
        project['Deadline'] = this.event.request.intent.slots.Deadline.value;
        storage.updateDeadline(project, () => {
                this.handler.state = states.STARTMODE;
                this.emit(":ask", "Your project deadline has been updated . What would you like to do now?");
        });
    },
    
    // updates the status in dynamodb
    "UpdateStatus": function(){
        project['Status'] = this.event.request.intent.slots.Status.value;
        storage.getProject(project, (response) => {
            if(!response){
              this.emit(':ask', "I couldn't find a project like that. Please tell me the project which you want to update again.");
            } else {
              storage.updateStatus (response, project['Status'], () => {
                this.handler.state = states.STARTMODE;
                this.emit(":ask", "Your project status has been updated. What would you like to do now?");
              });
            }
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
    "DeleteHelpIntent": function() {
        this.emit(':ask', 'Say I want to delete the project nameofproject followed by I want to delete the sub task nameofsubtask.');
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
        this.emit(':tell', "I didn't catch that! Say delete help if you aren't sure.");
    },
    
    // asks for the sub task
    "DeleteSubTask":function() {
        project['ProjectName'] = this.event.request.intent.slots.ProjectName.value;
        this.emit(':ask', "What is the sub task");
    },
    
    // deletes the project details from dynamodb 
    "DeleteFinalIntent": function(){
        project['SubTask'] = this.event.request.intent.slots.SubTask.value;
        storage.deleteProject(project, (response) => {
          if(!response){
              this.emit(':ask', "I couldn't find a project like that. Please tell me the project you want to delete again.");
          } else {
            this.handler.state = states.STARTMODE;
            message = 'The project you requested has been deleted. What would you like to do now?';
            this.emit(':ask', message);
          }
       });
    }
});
