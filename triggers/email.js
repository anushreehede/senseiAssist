'use strict'
// modules for sending email through SMTP
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// Requiring credentials for email
var credentials = require('./credentials');

var email = (function(){
    return {
        // method send() to send an email 
        send: function(project, callback){
            // the generated credentials for my email
            // IMPORTANT USE YOUR OWN CREDENTIALS
            var generator = require('xoauth2').createXOAuth2Generator({
              user: credentials.user,
              clientId: credentials.clientId,
              clientSecret: credentials.clientSecret,
              refreshToken: credentials.refreshToken,
              accessToken: credentials.accessToken,
              expires: credentials.expires
            });
    );
    // SMTP transporter object
	var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
	    auth: {
	        xoauth2: generator
            }
	}));
    // text and subject for email
	var text = "Dear "+project.ProjectIncharge+",\nThe project '"+project.ProjectName+"' with sub task '"+project.SubTask+"' is due on "+project.Deadline+" and the current status is '"+project.Status+"'. \nFrom Sensei Assistant.";
        
    var subject = " DEADLINE REMINDER - " +project['ProjectName']+" - "+project['SubTask'];
            
    // email options/details
	var mailOptions = {
	    from: 'Sensei Office Assistant <'+credentials.user+'>',
	    to: project.Email, 
        subject: subject,
	    text: text 
	};
    // sending the mail via SMTP
	transporter.sendMail(mailOptions, function(error, info){
          if(error){
              console.log(error);
          }
          callback();
      });
    }
  }
})();
// exporting the email variable
module.exports = email;