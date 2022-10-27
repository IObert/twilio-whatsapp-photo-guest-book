const MaskData = require("maskdata");
const axios = require("axios");

const maskPhoneOptions = {
  maskWith: "*",
  unmaskedStartDigits: 5,
  unmaskedEndDigits: 4,
};

exports.handler = async function (context, event, callback) { //TODO Implement paging
  let client = context.getTwilioClient();

  const messages = await client.messages.list({
    to: "whatsapp:+4915735987800",
  });


  let images = await Promise.all(
    messages.map(async (message) => {
      const phone = message.from.replace("whatsapp:", "");
      const mediaURL = message.subresourceUris.media;

      const mediaRes = await axios({
        url: `https://api.twilio.com${mediaURL}`,
        method: "GET",
        auth: {
          username: process.env.ACCOUNT_SID,
          password: process.env.AUTH_TOKEN,
        },
      });

      if (mediaRes.data.media_list.length > 1) {
        console.error("More than one image found", mediaURL);
      }

      const media = mediaRes.data.media_list[0];

      if (!media) {
        return undefined;
      }

      const mediaFileRequest = await axios({
        url: `https://api.twilio.com${media.uri.replace(/\.json$/, "")}`,
        method: "GET",
        headers: {
          "Content-Type": media.content_type,
        },
        auth: {
          username: process.env.ACCOUNT_SID,
          password: process.env.AUTH_TOKEN,
        },
      });

      const url = mediaFileRequest.request.res.responseUrl;

      const tags = message.body
        ? [{ value: message.body, title: "caption" }]
        : [];

      return {
        src: url,
        tags,
        dateSent: message.dateSent,
        sender: MaskData.maskPhone(phone, maskPhoneOptions),
        caption: message.body,
        contentType: media.content_type,
      };
    })
  );


  images = images.filter((image) => !!image);
  callback(null, images);
};
