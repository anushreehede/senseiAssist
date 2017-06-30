'use strict'
// importing and configuring aws sdk for accessing dynamodb
var AWS = require("aws-sdk");

AWS.config.update({
	region: "us-east-1",
	endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

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

            TableName: "SenseiProjects",
            Key: {
                ProjectName:project['Project Name'] ,
                SubTask : project['SubTask']
              },
            UpdateExpression: "Deadline=:d",
            ExpressionAttributeValues: {
                ":d": project['Deadline']
              }

            };
            dynamodb.update(params, function(err, data){
                callback();
            });
        },
        // updates the status with given value
        updateStatus: function(project, callback) {
            var params = {

            TableName: "SenseiProjects",
            Key: {
                ProjectName: project['ProjectName'] ,
                SubTask: project['SubTask']
               },
            UpdateExpression: "Status=:s",
            ExpressionAttributeValues: {
                ":s": project['Status']
               }
            };
            dynamodb.update(params, function(err, data){
                callback();
            });
        }
    }
})();
// exporting the storage variable
module.exports = storage;
