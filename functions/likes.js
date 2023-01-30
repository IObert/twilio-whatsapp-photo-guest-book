exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient();
  const NEED_TO_UPDATE = !!event.photo;
  let likes;

  if (!context.SYNC_SERVICE_SID || !context.SYNC_DOC_SID) {
    return callback("Service disabled");
  }

  try {
    const document = client.sync.v1
      .services(context.SYNC_SERVICE_SID)
      .documents(context.SYNC_DOC_SID);

    const payload = await document.fetch();

    likes = payload.data;

    if (NEED_TO_UPDATE) {
      likes[event.photo] = likes[event.photo] || 0;
      likes[event.photo]++;
      await document.update({ data: likes });
    }
  } catch (e) {
    return callback("Something went wrong. Please try again");
  }

  callback(null, likes);
};
