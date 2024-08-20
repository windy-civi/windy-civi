# Getting Started

This document provides an overview of how to get started with the backend repository.

Open a new terminal and navigate to the folder where you'd like to store this project. For this example, we'll store the project in the **documents** folder by running `cd documents`. 

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/bc3d0e9f-0317-41b6-8c93-0ee0fd482cc7)

In the terminal enter
`git clone -b update-readme-with-codebase-access https://github.com/civi-social/civi-legislation-data.git`to clone the repo.

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/cffd1fe7-625c-414d-8545-3a8094595dde)

You should now see the project listed in the folder you specified

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/01fc8345-85fc-4074-a058-a4cde6aed908)



Navigate into the project folder by running `cd civi-legislation-data`

<img width="934" alt="image" src="https://github.com/civi-social/civi-legislation-data/assets/91917755/f6a0c749-204e-4b54-b12f-0d3fcc90fd3d">


If you're using VSCode run `code .` to open the project

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/40455420-2823-42c5-95db-9e9b21e39d15)

Alternatively, you can drag and drop the project into your code editor 

<img width="954" alt="image" src="https://github.com/civi-social/civi-legislation-data/assets/91917755/dce76b3d-9a2c-4f86-ac46-13f3070bfbb3">

  &nbsp;
  &nbsp;
  
Inside the project, create a new branch by running `git checkout -b YOUR_BRANCH_NAME` - ** make sure to change the branch name from `YOUR_BRANCH_NAME` to something you understand.

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/33e62b00-debd-4405-aba2-3c9a91833d2a)

Confirm you're in the new branch by running `git branch`

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/fa04e36a-115d-4633-956c-e9150419dc3f)

Next, run `npm install`. This installs the dependencies for the project. You'll know this command was successful if the node-modules folder is now visible

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/cfa6c46e-9c70-4920-a744-a8cf90f64596)


## Sign up for LegiScan API Key
Sign up for a [Legiscan account](https://legiscan.com/) to obtain an API key

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/e0e801c3-cef2-4df9-b6ff-a7a4327d7c3f)


Once your API key is generated, run `LEGISCAN_API_KEY={YOUR_API_KEY} npm run scrape`. This fetches all the current bills from LegiScan.

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/08b51061-3e7f-4568-8565-088b1b912341)

## Sign up for OpenAI API Key
Before proceeding, ensure you've completed the LegiScan installation step above, or this step will fail.  

Sign up for an [OpenAI account](https://platform.openai.com/docs/overview ) and create a new secret key.

<img width="947" alt="image" src="https://github.com/civi-social/civi-legislation-data/assets/91917755/0f5bf8e5-1778-4ba8-93e3-cc813d274c4b">


THE NEXT STEP IS CRITICALLY IMPORTANT!

After you've obtained your secret key, run `OPENAI_API_KEY=your-api-key LOCALE=usa BILL="HB5" npm run gpt-one` (ensuring to replace `your-api-key` with your actual API key)  This is critically important to ensure that OPENAI only translates one of the bills instead of the entire list of bills which is expensive. 

<img width="1119" alt="image" src="https://github.com/civi-social/civi-legislation-data/assets/91917755/c724ac60-024b-4d1f-8692-bba5bfaf0348">

If you see a ton of output in the terminal it likely means ChatGPT is translating everything - kill the process immediately!

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/318316f5-cf02-45ed-b542-b03a1f349d99)

## Register a Google Sheets API key
Create a new project in the [Google Cloud Console](https://console.cloud.google.com/projectcreate?previousPage=%2Fwelcome%2Fnew%3ForganizationId%3D0&organizationId=0) 

Once your project is active select "APIs and Services"

  
![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/4fcdeafe-39ba-4d3a-8294-cda112e40d04)
  
  
  
Enable APIs and services 


      
![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/c0ac39e1-2635-4f09-92c0-763ac54bb411)

  
Enable the Google Sheets API, then create your API credentials (note: It's okay for the key to be left as unrestricted)

<img width="1420" alt="image" src="https://github.com/civi-social/civi-legislation-data/assets/91917755/ad824619-23f2-4930-a956-1c7b135030a8">


Once you've obtained your API key navigate back to your terminal and run `GOOGLE_SPREADSHEET_API_KEY={YOUR_API_KEY} npm run wiki` (ensuring to replace `YOUR_API_KEY` with your actual API key) 

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/e9c4c2ce-885b-478d-8ce3-7e1d3306deff)


If successful, you should now see the `dist_legislation` folder

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/f14dafe3-0252-49dd-a85d-eb61c334a1e8)


Congrats you're now ready to contribute!

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Note
To visit the Google sheet of manual interpretations [go here](https://sheets.googleapis.com/v4/spreadsheets/1dEHnMY7KZ2kyQL5lraMNMerTdp3TP37JlF63eJMSXZQ/values/${range}?key=${apiKey}).

Make sure you add your API key to the end of the URL (see below)

![image](https://github.com/civi-social/civi-legislation-data/assets/91917755/7ae52ae2-12e6-46a8-a8ef-f0e4b503e1f9)



