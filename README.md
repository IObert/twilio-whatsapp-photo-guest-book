# Photo Sharing with WhatsApp


Backend
    Paging in backend via the .list() function, maybe exclude non videos from the query?
    count total number of images, measure why the request takes so long, is the the retrieval or processing or rendering?
    Add script to download all images to files

UI
    initiy scrolling with paging
    Make a PWA


## Installation

* Buy a number you want to use and enable it for WhatsApp

* Create Messaging Service

* Replace env var files `.env`

* Deploy the project 
    ```bash
    npm install
    npm run build-deploy
    ```

* Give out QR codes so that users can send messages to the registered number

## Folder structure

### Functions

There are two Functions used. The first one, `incoming.js`, handles incoming messages and returns TwiML responses to the senders. The other one, `images.js`, returns the media URLs found in the logs to the frontend (incl some meta data).

### Frontend

The frontend code is present inside the `frontend` folder.

The entire setup is hosted on Twilio Serverless and the frontend is served as static pages.

While the frontend is a react app, to update the frontend.

Test the react app locally

1. Deploy the backend 
```bash
npm run build-deploy
```

2. Adapt the `proxy` field in the `package.json` of the frontend app.

3. Run it locally
```bash
npm run start
```



