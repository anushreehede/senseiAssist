// requiring AWS module and client
const AWS = require('aws-sdk') ;
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}) ;

// require email function
var email = require('./email.js');

// exporting the handler
exports.handler = function (e,ctx,callback) {
    var params = {
        TableName : "SenseiProjects",
        ProjectionExpression: "ProjectName,SubTask, Email,ProjectIncharge, Deadline, #Pstatus",
        //FilterExpression: "#Pstatus = :st",
        ExpressionAttributeNames:{
            "#Pstatus": "Status"
        }
        //ExpressionAttributeValues: {
        //  ":st":"notstarted"
        //}
    };
    console.log("Scanning Sensei Orders table.");
    docClient.scan(params, onScan);


};

// method doing the scanning and email sending
function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    }
    else {
        console.log("Scan succeeded.");
        
            data.Items.forEach(function (SenseiProjects) {
                if(SenseiProjects.Status != 'completed' && SenseiProjects.Status != 'complete' && SenseiProjects.Status != 'finished' && SenseiProjects.Status != 'ended' && SenseiProjects.Status != 'closed') {
                email.send(SenseiProjects, () => {
                        console.log('Email reminder sent');
                    });   
                }
            });
    }
}