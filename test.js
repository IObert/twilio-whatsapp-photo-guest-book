const twilio = require("twilio");
require("dotenv").load();
const MaskData = require("maskdata");
const axios = require("axios");

const maskPhoneOptions = {
  maskWith: "*",
  unmaskedStartDigits: 5,
  unmaskedEndDigits: 4,
};

const NUMBER = "+4915735987800";
// const pageToken = "PAMMe15f209d401bfa3c65784af781f2aaa1";
(async () => {
  const client = new twilio();

  const page = await client.messages.page({
    to: `whatsapp:${NUMBER}`,
    pageSize: 4,
    pageNumber: 19,
    pageToken: "PAMM18bc1314deec75e52cff0dda0bc8636b",
  }); //TODO change to .each to stream https://www.twilio.com/docs/libraries/reference/twilio-node/3.5.0/Twilio.Api.V2010.AccountContext.MessageList.html#each
  // https://www.twilio.com/docs/libraries/reference/twilio-node/3.5.0/Twilio.Api.V2010.AccountContext.MessageList.html#each
  // https://www.twilio.com/blog/replacing-absolute-paging-and-related-properties
  // https://swr.vercel.app/docs/pagination

  console.log(page.nextPageUrl);
  const messages = page.instances;
  const images = await Promise.all(
    messages.map(async (message) => {
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

      console.log(message.body);

      return {
        src: url,
        original: url,
        caption: message.body,
      };
    })
  );

  console.log({
    images: images.filter((image) => !!image),
    pageToken: page.nextPageUrl && page.nextPageUrl.match(/PageToken=(.*)/)[1],
  });
})();
