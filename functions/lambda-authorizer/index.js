exports.handler = async (event) => {
  const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {
      principalId,
    };

    if (effect && resource) {
      const policyDocument = {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      };
      authResponse.policyDocument = policyDocument;
    }

    return authResponse;
  };

  return generatePolicy('user', 'Allow', event.methodArn);
};
