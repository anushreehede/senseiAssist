## This is a sample Alexa Office Assistant skill. 

1. It can add and delete projects
2. It can fetch project details
3. It can update some details of the project. 
4. It sends an email to the project manager every time a status is updated. 
5. It sends an email reminder to the project manager when the deadline is approaching and status is incomplete. 

### Clone this repository. Navigate to the directory of this repo. 

`git clone https://github.com/anushreehede/senseiAssist.git`  
`cd senseiAssist`

### Install nodejs dependencies

`cd src`    
`npm install alexa-sdk --save`  
`npm install aws-sdk --save`    
`npm install nodemailer --save`     
`npm install nodemailer-smtp-transport --save`     
`npm install xoauth2 --save`     

### Uploading to Amazon AWS

Zip the files in `/src` and create a `src.zip` file to upload to AWS. 
The intents and utterances have been included in `/speechAssets` - to be used on Developer's portal. 

Zip the files in `/triggers` and upload in a separate Lambda function on AWS. This sends deadline reminder emails. 

### TODO

~~1. Add send-email script and relevant intent in `index.js`~~    
~~2. Multi-word slot values~~   
~~3. Update project details, delete project - important for `storage.js`~~     
~~4. Email to project incharge when status updated~~    
~~5. Create email field in SenseiProjects table, make all email related intents~~     
~~6. Trigger email to project incharge before deadline~~    
7. Improve the sample utterances, possibly change flow of program (IMP)  
~~8. Get official email, create credentials.~~  
~~9. Make `package.json` file.~~   
10. Error handling/validation  
11. Study and presentation 

##### Remember to change the code in `/speechAssets` whenever new intent is added


