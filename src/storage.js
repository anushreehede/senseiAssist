'use strict'
var AWS = require("aws-sdk");

AWS.config.update({
	region: "us-east-1",
	endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var storage = (function() {
	var dynamodb = new AWS.DynamoDB.DocumentClient();
	return {
		save: function(project, callback) {
			var params = {
               //Items: {
                  TableName: "SenseiProjects",
                  Item:{
                     ProjectName: project['ProjectName'] ,
                     SubTask: project['SubTask'],
                     //the other non-key colums are stored as "info"

                     //"info": {
                     ProjectIncharge: project['ProjectIncharge'],
                     Deadline: project['Deadline'],
                     Status: project['Status']
                     //}
                  }
              };
			dynamodb.put(params, function(err, data) {
				callback();
			});
		},
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

module.exports = storage;
