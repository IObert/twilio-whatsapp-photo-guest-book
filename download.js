const twilio = require("twilio");
require("dotenv").load();
const axios = require("axios");
const fs = require("fs");

const NUMBER = "+4915735987800";
const client = new twilio();

const logger = fs.createWriteStream("downloads/senders.txt", {
  flags: "a", // 'a' means appending (old data will be preserved)
});

client.messages.each(
  {
    to: `whatsapp:${NUMBER}`,
    // limit: 6,
  },
  async function (message) {
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
      return null;
    }

    const fileEnding = media.content_type.replace(/.*\//g, "");
    const file = fs.createWriteStream(`downloads/${media.sid}.${fileEnding}`);
    logger.write(`${media.sid}.${fileEnding} - ${message.from} - ${message.body}\n`) 

    console.time(`Download ${media.sid}.${fileEnding}`);

    await axios({
      url: `https://api.twilio.com${media.uri.replace(/\.json$/, "")}`,
      method: "GET",
      responseType: "stream",
      headers: {
        "Content-Type": media.content_type,
      },
      auth: {
        username: process.env.ACCOUNT_SID,
        password: process.env.AUTH_TOKEN,
      },
    }).then((response) => {
      response.data.pipe(file);
      // after download completed close filestream
      file.on("finish", () => {
        file.close();
        console.timeEnd(`Download ${media.sid}.${fileEnding}`);
      });
    });
  }
);
