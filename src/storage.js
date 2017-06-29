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
        //updateDeadline: ,
        //updateStatus:
    }
})();

// exporting the storage variable
module.exports = storage;
