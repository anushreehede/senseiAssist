## This is a sample Alexa Office Assistant skill. 

It can add and delete projects, and fetch project details. It can update some details of the project. 

### Clone this repository. Navigate to the directory of this repo. 

`cd senseiAssist`

### Install nodejs dependencies

`cd src`    
`npm install alexa-sdk`
`npm install aws-sdk`

### Uploading to Amazon AWS

Zip the files in `/src` and create a `src.zip` file to upload to AWS. 
The intents and utterances have been included in `/speechAssets`.

### TODO

1. Add send-email script and relevant intent in `index.js`
~~2. Multi-word slot values~~
~~3. Update project details, delete project - important for `storage.js`~~
4. Create email field in SenseiProjects table, change utterances, intents files
5. Update email intent 
6. Improve the sample utterances (IMP)
7. Any other functionality (if time permits)

##### Remember to change the code in `/speechAssets` whenever new intent is added


