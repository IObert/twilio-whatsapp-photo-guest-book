exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient();
  const twiml = new Twilio.twiml.MessagingResponse();

  const firstMediaResponse =
    "Thanks for sending the first image, you are awesome!\nPS: I won't send any further confirmations";

  const prevCorrespondence = await client.messages.list({
    to: event.From,
    from: event.To,
  });

  const isFirstMessage = prevCorrespondence.length === 0,
    hasReceivedImagesBefore = prevCorrespondence.some(
      (m) => m.body.indexOf(firstMediaResponse) >= 0
    );
  if (isFirstMessage) {
    twiml.message(
      `Thanks for reaching out. Sharing images is super easy, just sent them to me here and then you'll be able to find the on this website:\nhttps://${context.DOMAIN_NAME}/index.html`
    );
  } else if (event.MediaUrl0) {
    if (!hasReceivedImagesBefore) {
      twiml.message(firstMediaResponse);
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 23);

      if (context.MESSAGING_SERVICE_SID) {
        client.messages.create({
          messagingServiceSid: context.MESSAGING_SERVICE_SID,
          body: "How was the party yesterday? Are there any other pictures you would like to share?",
          sendAt: tomorrow,
          scheduleType: "fixed",
          to: event.From,
        });
      }
    }
  } else if (!event.MediaUrl0) {
    twiml.message("I couldn’t find an image in this message :(");
  }
  callback(null, twiml);
};
