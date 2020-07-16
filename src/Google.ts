import { OAuth2Client } from "google-auth-library";
import { Authenticator } from "./makeHandlers";
const key = "GOOGLE";
export default (clientId: string, clientIds?: string[]): Authenticator => ({
  key,
  preSignUp: async (event) => {
    const {
      request: {
        userAttributes: { email, preferred_username },
        clientMetadata: { idToken } = { idToken: undefined },
      },
    } = event;
    const client = new OAuth2Client(process.env.googleClientId);
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: clientIds ? [clientId, ...clientIds] : clientId,
      });
      const { payload } = ticket.getAttributes();
      if (!payload) throw new Error("no payload returned");
      //check email address
      if (payload.email === email || payload.sub === preferred_username)
        return {
          ...event,
          response: {
            ...event.response,
            autoConfirmUser: payload.email === email,
            autoVerifyEmail: true,
          },
        };
      else throw new Error("Email mismatch");
    } catch (e) {
      console.warn(e);
      throw new Error("Could not authenticate");
    }
  },
  confirmSignUp: () => {
    throw new Error("This should ever be called");
  },
});
