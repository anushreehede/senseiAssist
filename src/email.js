'use strict'
// modules for sending email through SMTP
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var email = (function(){
    return {
        // method send() to send an email 
        send: function(project, callback){
            // the generated credentials for my email
            // IMPORTANT USE YOUR OWN CREDENTIALS
            var generator = require('xoauth2').createXOAuth2Generator({
              user: 'example@gmail.com',
              clientId: "xxxxxxxxxxx.apps.googleusercontent.com",
              clientSecret: "xxxxxxxxxxxxxx",
              refreshToken: "xxxxxxxxxxxxxx",
              accessToken: "xxxxxxxxxxxxxx",
              expires: 000000000000
            }
    );
    // SMTP transporter object
	var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
	    auth: {
	        xoauth2: generator
            }
	}));
    // text and subject for email
	var text = 'Dear '+project['ProjectIncharge']+', \nThe project "'+project['ProjectName']+'" with sub task "'+project['SubTask']+'" has updated its status to "'+project['Status']+'". Your deadline is '+project['Deadline']+'. Thank you. ';
    var subject = "PROJECT - " +project['ProjectName']+" - "+project['SubTask']+" UPDATE"
    // email options/details
	var mailOptions = {
	    from: 'Sensei Office Assistant <shuttler22@gmail.com>',
	    to: project['Email'], 
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