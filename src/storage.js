'use strict'
// importing and configuring aws sdk for accessing dynamodb
var AWS = require("aws-sdk");

AWS.config.update({
	region: "us-east-1",
	endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

// Requiring email information
var email = require('./email');

// main storage variable which has functions of saving, fetching and updating data
var storage = (function() {
	var dynamodb = new AWS.DynamoDB.DocumentClient();
	return {
        // saving a project 
		save: function(project, callback) {
			var params = {
                  TableName: "SenseiProjects",
                  Item:{
                     ProjectName: project['ProjectName'] ,
                     SubTask: project['SubTask'],
                     ProjectIncharge: project['ProjectIncharge'],
                     Email: project['Email'],
                     Deadline: project['Deadline'],
                     Status: project['Status']
                  }
              };
			dynamodb.put(params, function(err, data) {
				callback();
			});
		},
        // fetching a project with project name and sub task as key
		getProject: function(project, callback) {
			var params = {
				TableName: 'SenseiProjects',
				Key: {
					ProjectName: project['ProjectName'],
                    SubTask: project['SubTask']
				}
			};
			dynamodb.get(params, function(err, data) {
				callback(data.Item);
			});
		},
        // updates the deadline with given value
        updateDeadline: function(project, callback){
            var params = {
                TableName: 'SenseiProjects',
                Key: {
                   ProjectName:project['ProjectName'] ,
                   SubTask : project['SubTask']
                  },
                UpdateExpression: "set Deadline = :d",
                ExpressionAttributeValues: {
                ":d": project['Deadline']
                }
            };
            dynamodb.update(params, function(err, data){
                if(err){
                    console.log(err);
                }
                else{
                    callback();
                }
            });
        },
        // updates the status with given value, sending email to project incharge
        updateStatus: function(project, callback) {
            var params = {

            TableName: 'SenseiProjects',
            Key: {
                ProjectName: project['ProjectName'] ,
                SubTask: project['SubTask']
               },
            UpdateExpression: "set #status = :status",
            ExpressionAttributeNames: {
                "#status" : 'Status'},
            ExpressionAttributeValues: {
                ":status": project['Status']
               }
            };
            email.send(project, () => {
            });
            dynamodb.update(params, function(err, data){
                if(err){
                    console.log(err);
                }
                else{
                    callback();
                }
            });
        },
        // updates the email with given value
        updateEmail: function(project, callback){
            var params = {
                TableName: 'SenseiProjects',
                Key: {
                   ProjectName:project['ProjectName'] ,
                   SubTask : project['SubTask']
                  },
                UpdateExpression: "set Email = :e, ProjectIncharge = :p",
                ExpressionAttributeValues: {
                ":e": project['Email'],
                ":p": project['ProjectIncharge']
                }
            };
            dynamodb.update(params, function(err, data){
                if(err){
                    console.log(err);
                }
                else{
                    callback();
                }
            });
        },
        // deletes the project details
        deleteProject: function(project, callback) {
			var params = {
				TableName: 'SenseiProjects',
				Key: {
					ProjectName: project['ProjectName'],
                    SubTask: project['SubTask']
				}
			};
			dynamodb.delete(params, function(err, data) {
				callback();
			});
		}
    }
})();
// exporting the storage variable
module.exports = storage;
