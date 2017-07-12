'use strict'
// importing and configuring aws sdk for accessing dynamodb
var AWS = require("aws-sdk");

AWS.config.update({
	region: "us-east-1",
	endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

// Requiring nodemailer modules
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// Requiring credentials for email
var credentials = require('./credentials');

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
                if(err){
                    console.log("The error is in get function"+err);
                    callback(false);
                } else{
				callback(data.Item);
                }
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
                    //callback(false);
                }
                else{
                    callback();
                    //callback(data);
                }
            });
        },
        
        // updates the status with given value, sending email to project incharge
        updateStatus: function(project, status, callback) {
            // getting the new project status
            project['Status'] = status; 
            
            // dynamodb parameters for status update 
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
             
            // xoath2 generator for sending emails
            // IMPORTANT USE YOUR OWN CREDENTIALS
            var generator = require('xoauth2').createXOAuth2Generator({
              user: credentials.user,
              clientId: credentials.clientId,
              clientSecret: credentials.clientSecret,
              refreshToken: credentials.refreshToken,
              accessToken: credentials.accessToken,
              expires: credentials.expires
            });
            
            // SMTP transporter object
	        var transporter = nodemailer.createTransport(smtpTransport({
              service: 'gmail',
	          auth: {
	             xoauth2: generator
              }
	        }));
            
            // text and subject for email
	        var text = 'Dear ' + project['ProjectIncharge']+',\nThe project "'+project['ProjectName']+'" with sub task "'+project['SubTask']+'" has updated its status to "'+project['Status']+'". Your deadline is '+project['Deadline']+'. \nFrom Sensei Assistant.';
            
            var subject = "PROJECT UPDATE - " +project['ProjectName']+" - "+project['SubTask'];
            
            // email options/details
	        var mailOptions = {
	          from: 'Sensei Office Assistant   <'+credentials.user+'>',
	          to: project['Email'], 
              subject: subject,
	          text: text 
	         };
           
            // sending the mail via SMTP
	        transporter.sendMail(mailOptions,
              function(error, info){
                 if(error){
                   console.log("Error is inside sendmail"+error);
                 } else {
                   dynamodb.update(params,    function(err, data){
                      if(err){
                        console.log("This is an update error\n"+err);
                      }else{
                        callback();
                      }
                   });  
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
                  //callback(false);  
                } else {
                  callback();
				  //callback(data);
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
                if(err){
                  console.log(err);
                  callback(false);  
                } else {
				  callback(data);
                }
			});
		}
    }
})();

// exporting the storage variable
module.exports = storage;