exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient();
  const twiml = new Twilio.twiml.MessagingResponse();

  const firstMessageResponse = `Danke, dass du dich entschieden hast, Bilder mit dem Brautpaar zu teilen. Das Ganze ist kinderleicht. Alles, was du tun musst, ist mir die Bilder zu schicken und ich werde sie dem Brautpaar dann geben. Außerdem können alle Gäste die Bilder hier finden:
  https://${context.DOMAIN_NAME}/index.html
  
  DSGVO Hinweis:
  Deine Daten werden gelöscht, nachdem ich dem Brautpaar die Bilder übergeben habe. Und abgesehen von einer kleinen Erinnerung morgen, werde ich dir auch keine unaufgeforderten Nachrichten schicken. Falls du keine Lust darauf hast, brauchst du nichts weiter zu tun, als diese Nachricht zu ignorieren und mir keine Bilder zu schicken.`;

  const firstMediaResponse = `Danke für das erste Foto. Ich werde dir ab jetzt keine Bestätigungen beim erfolgreichen Empfang der Bilder mehr schicken und sie einfach nur speichern und auf der Webseite anzeigen.`;

  const noMediaResponse =
    "Es sieht so aus, als ob du keinen Anhang geschickt hast. Falls das ein Fehler ist, sag bitte Marius Bescheid.";

  const reminderMessage = `Hallo,\n
    ich wollte nur kurz nachfragen, ob du gestern ein paar schöne Bilder gemacht hast? Das Brautpaar würde sich sicher freuen, wenn du mir die Bilder schicken kannst.`;

  const prevCorrespondence = await client.messages.list({
    to: event.from,
    from: event.to,
    limit: 50,
  });
  console.log(JSON.stringify(event));

  const isFirstMessage = prevCorrespondence.length === 0,
    hasReceivedImagesBefore = prevCorrespondence.some(
      (m) => m.body.indexOf(firstMediaResponse) >= 0
    );
  if (isFirstMessage) {
    twiml.message(firstMessageResponse);

    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 23);

    const message = client.messages.create({
      messagingServiceSid: context.MESSAGING_SERVICE_SID,
      body: reminderMessage,
      sendAt: tomorrow,
      scheduleType: "fixed",
      to: event.from,
    });
  } else if (event.MediaUrl0) {
    if (!hasReceivedImagesBefore) {
      twiml.message(firstMediaResponse);
    }
  } else if (!event.MediaUrl0) {
    twiml.message(noMediaResponse);
  }

  callback(null, twiml);
};
