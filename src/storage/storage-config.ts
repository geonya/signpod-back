import { registerAs } from '@nestjs/config'

export default registerAs('storage', () => ({
  projectId: process.env.GCP_PROJECT_ID,
  privateKey: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.GCP_CLIENT_EMAIL,
  bucketId: process.env.GCP_BUCKET_ID,
}))
