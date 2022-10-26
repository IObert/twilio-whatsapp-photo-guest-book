# Photo Sharing with WhatsApp

Missing features



    Show placeholder while loading

Danke, dass du dich entschieden hast, Bilder mit dem Brautpaar zu teilen. Das Ganze ist auch kinderleicht. Alles, was du tun musst, ist mir die Bilder zu schicken und ich werde sie dann hier anzeigen.

DSGVO Hinweis:
Deine Daten werden gelöscht, nachdem ich dem Brautpaar die Bilder übergeben habe. Und abgesehen von einer kleinen Erinnerung morgen Mittag, werde ich dir auch keine unaufgeforderten Nachrichten schicken. Falls du keine Lust darauf hast, brauchst du nichts weiter zu tun, als diese Nachricht zu ignorieren und mir keine Bilder zu schicken.


Es sieht so aus, als ob du keinen Anhang geschickt hast. Falls das ein Fehler ist, sag bitte Marius Bescheid.

Danke für das erste Foto. Ich werde dir ab jetzt keine Bestätigungen beim erfolgreichen Empfang der Bilder mehr schicken.
PS: Du kannst alle Bilder hier finden:



Add message handler for
    Send reminders after initial convo, send link to gallery
    Thank for sending more images
    Send error messagen when no picture was sent

Backend
    Implement sorting and filtering in backend
    Translate the caption to German too
    Paging possible in backend via the .list() function?

UI
    Add header with filter and sort by
    Make a PWA


Test with 1000s of pictures (by copying the array elements in the backend)
    initiy scrolling needed?
PWA for easy access
    Add favicon and icon (S? or just a heart? emoji)



### How does it work

```bash
npm i
cd frontend
npm i --force
cd ..
npm run build-deploy
```

Then you should see the URL of the function assets. This URL contains the funtion id, e.g. `waquiz-1860-dev` in `https://waquiz-1860-dev.twil.io`. Take this ID and replace all occures of `<replace-with-function-id>` with it.

Then go to <https://twilio.com/console/studio> and create two new flows `quiz-flow` and `orchestrator-flow` based on the files in `/studio-flows`.

Fix the `orchestrator-flow` so that it links to the `quiz-flow`

Create a messaging service and add your number and WhatsApp number to the sender pool and the `webhook URL` of the `orchestrator-flow` as the integration.

Create a new Airtable base and copy the `.env_example` to `.env` and replace all values before running the deploy command once again: //TODO: The varibable name is QUIZ_FLOW_SID but we actually need to link to the Orchestrator flow. This was confusing to me

```bash
npm run build-deploy
```

TODO: Add how Airtable needs to be structured and which data need to be added manually

## Start the quiz

```bash
curl -d quiz_key=123456 -d quiz_num=1 https://<replace-with-function-id>.twil.io/quiz/start
```

### Folder structure

#### Frontend:

The frontend code is present inside the `frontend` folder.

The entire setup is hosted on Twilio Serverless and the frontend is served as static pages.

While the frontend is a react app, to update the frontend.

Build the react app

```bash
npm run build
```

Copy the build static assets to the serverless assets folder

```bash
cp ./build ../assets/
```

Deploy the project to your environment

```bash
twilio serverless:deploy
```
