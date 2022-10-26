const twilio = require("twilio");
require("dotenv").load();
const MaskData = require("maskdata");
const axios = require("axios");

const maskPhoneOptions = {
  maskWith: "*",
  unmaskedStartDigits: 5,
  unmaskedEndDigits: 4,
};

(async () => {
  const client = new twilio();

  const messages = await client.messages.list({ to: "whatsapp:+4915735987800" });

  const images = await Promise.all(messages.map(async (message) => {
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

    if(!media || media.content_type.indexOf("video") > 0){
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

    return {
      src: url,
      original: url,
      // width: 320,
      // height: 174,
      tags: [
        { value: "Received", title: message.dateSent },
        { value: "Sender", title: MaskData.maskPhone(phone, maskPhoneOptions) },
      ],
      caption: message.body,
    };
  }));

  console.log(images.filter(image => !!image))
})();
