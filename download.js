require("dotenv").config();
const client = require("twilio")(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const axios = require("axios");
const fs = require("fs");

const NUMBER = process.env.NUMBER;

const logger = fs.createWriteStream("downloads/senders.txt", {
 flags: "a", // 'a' means appending (old data will be preserved)
});

client.messages.each(
 {
   to: `whatsapp:${NUMBER}`
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
   logger.write(
     `${media.sid}.${fileEnding} - ${message.from} - ${message.body}\n`
   );

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
     // close filestream after download completed
     file.on("finish", () => {
       file.close();
       console.timeEnd(`Download ${media.sid}.${fileEnding}`);
     });
   });
 }
);
