const { SESClient } = require("@aws-sdk/client-ses");
const { SES_ACCESS_KEY, SES_SECRET_ACCESS_KEY } = require("./config");

const sesClient = new SESClient({
	region: 'eu-north-1',
	credentials: {
		accessKeyId: SES_ACCESS_KEY,
		secretAccessKey: SES_SECRET_ACCESS_KEY,
	},
});

module.exports = { sesClient };
