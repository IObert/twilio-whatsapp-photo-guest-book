require("dotenv").config();
const client = require("twilio")(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

console.log(`Clearing whatsapp messages for account ${process.env.ACCOUNT_SID}.`);

(async () => {
    const sentMessages = await client.messages.list({
        from: `whatsapp:${process.env.NUMBER}`,
    });
    const receivedMessages = await client.messages.list({
        to: `whatsapp:${process.env.NUMBER}`,
    });

    await Promise.all(
        [...sentMessages, ...receivedMessages].map(async (message) => {
            await client.messages(message.sid).remove();
        })
    );
    console.log(
        `Deleted ${sentMessages.length + receivedMessages.length} WhatsApp messages successfully.`
    );
});
