import jwksClient from "jwks-rsa";
import { promisify } from "util";
import { verify as verifyRaw } from "jsonwebtoken";
import decode from "jwt-decode";
import ms from "ms";
import { Authenticator } from "./makeHandlers";
const key = "APPLE";
const verifyToken = promisify(verifyRaw);
const client = jwksClient({
  cache: true, // Default Value
  cacheMaxEntries: 5, // Default value
  cacheMaxAge: ms("10m"), // Default value
  jwksUri: "https://appleid.apple.com/auth/keys",
});
const getSigningKey = (kid: string): Promise<jwksClient.SigningKey> =>
  new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
const preSignUp = async (event) => {
  const {
    request: {
      userAttributes: {
        email: cognitoEmail,
        preferred_username: cognitoUsername,
      },
      clientMetadata: { idToken } = { idToken: undefined },
    },
  } = event;
  const decoded = decode(idToken);
  const { email, sub } = decoded;
  const decodedHeader = decode(idToken, { header: true });
  const { kid } = decodedHeader;
  const key = await getSigningKey(kid);
  const verified = await verifyToken(idToken, key.getPublicKey());
  if (verified && (email === cognitoEmail || sub === cognitoUsername))
    return {
      ...event,
      response: {
        ...event.response,
        autoVerifyEmail: cognitoEmail === email,
        autoConfirmUser: true,
      },
    };
  else throw new Error("Could not authenticate");
};
const confirmSignUp = () => {
  throw new Error("This should ever be called");
};
export default (): Authenticator => ({ key, preSignUp, confirmSignUp });
