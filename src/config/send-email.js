const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./ses-client");

async function sendMyEmail() {
	const senderEmail = "support@devtinder.buzz"; // Must be a verified SES identity
	const recipientEmail = "aman.it.kiet@gmail.com"; // Must be verified if in sandbox mode

	const params = {
		Source: senderEmail,
		Destination: {
			ToAddresses: [recipientEmail],
		},
		Message: {
			Subject: {
				Charset: "UTF-8",
				Data: "Test Email from AWS SES",
			},
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: `
            <h1>Hello from AWS SES!</h1>
            <p>This is a test email sent using Node.js and the AWS SDK.</p>
          `,
				},
			},
		},
	};

	const command = new SendEmailCommand(params);

	try {
		const data = await sesClient.send(command);
		console.log("Email sent successfully:", data);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}

module.exports = { sendMyEmail };
