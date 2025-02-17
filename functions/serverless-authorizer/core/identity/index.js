/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable no-case-declarations */
const IDENTITY_PROVIDER = process.env.IDENTITY_PROVIDER || '';

let firebaseAdmin;
async function main(accessToken) {
  switch (IDENTITY_PROVIDER) {
    case 'cognito':
      const {
        CognitoIdentityProvider,
        GetUserCommand,
      // eslint-disable-next-line import/no-unresolved
      } = require('@aws-sdk/client-cognito-identity-provider');

      const client = new CognitoIdentityProvider({ region: 'us-east-1' });
      const command = new GetUserCommand({ AccessToken: accessToken });
      const awsUserPayload = await client.send(command);
      // eslint-disable-next-line max-len
      const user = awsUserPayload.UserAttributes.reduce((acc, { Name, Value }) => ({ ...acc, [Name]: Value }), {});

      return { user, uid: user.sub };

    case 'firebase':
      if (!firebaseAdmin) {
        firebaseAdmin = require('firebase-admin');
      }

      try {
        const user = await firebaseAdmin.auth().verifyIdToken(accessToken);
        return { user, uid: user.sub };
      } catch (error) {
        console.error('Error validating token:', error);
        throw new Error('Invalid token');
      }

    default:
      throw new Error('Invalid identity provider');
  }
}

module.exports = {
  verify: main,
};
