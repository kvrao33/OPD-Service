import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import 'dotenv/config';
async function getSecret(secretName) {
    try {
        const client = new SecretManagerServiceClient();
        const [version] = await client.accessSecretVersion({
            name: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/secrets/${secretName}/versions/latest`,
        });

        const payload = version.payload.data.toString('utf8');
        // console.log(payload);
        return payload;
    } catch (err) {
        console.error('Error retrieving secret:', err);
        throw err;
    }
}

export default getSecret;