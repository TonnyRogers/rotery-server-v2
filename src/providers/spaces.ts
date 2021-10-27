import AWS from 'aws-sdk';
import { digitalSpaces } from '../config';

const spacesEndpoint = new AWS.Endpoint(digitalSpaces.endpoint);
export const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: digitalSpaces.key,
  secretAccessKey: digitalSpaces.secret,
});
