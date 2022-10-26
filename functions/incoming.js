exports.handler = async function (context, event, callback) {
  console.log(JSON.stringify(event))
  //TODO, send first message
  // CHeck if already sent a message to this number? Then it's the second one
  // If recevied image, send first message with link but no further confirmations, and schedule the reminder
  // https://stackoverflow.com/questions/49284504/how-to-return-an-empty-response-to-an-sms-request
  // If not an image, send note
  let twiml = new Twilio.twiml.MessagingResponse();
  if(event.MediaUrl0){
    twiml.message(
      `Danke, dass für das erste Foto. Ich werde dir ab jetzt keine Bestätigungen beim erfolgreichen Empfang der Bilder mehr schicken.\n
      PS: Du kannst alle Bilder hier finden: https://${context.DOMAIN_NAME}/index.html`
      ); //TODO Insert URL
    } else {
      twiml.message("Es sieht so aus, als ob du keinen Anhang geschickt hast. Falls das ein Fehler ist, sag bitte Marius Bescheid.")
    }
    
    

  //TODO Use Sync to have only one first response per sender
  // to schedule a reminder
  // to welcome and mentioned GDPR
  callback(null, twiml);
};
