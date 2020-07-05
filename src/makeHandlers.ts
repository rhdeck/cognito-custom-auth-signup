export interface Authenticator {
  key: string;
  preSignUp: (event: any) => Promise<any>;
  confirmSignUp: (event: any) => Promise<any>;
}
export default (authenticators: Authenticator[]) => {
  return {
    preSignUp: async (event) => {
      const {
        request: {
          clientMetadata: { signupType },
        },
      } = event;
      const { preSignUp } =
        authenticators.find(({ key }) => key === signupType) || {};
      if (!preSignUp) throw new Error("No Signup method for " + signupType);
      return preSignUp(event);
    },
    confirmSignUp: async (event) => {
      const {
        request: {
          clientMetadata: { signupType },
        },
      } = event;
      const { confirmSignUp } =
        authenticators.find(({ key }) => key === signupType) || {};
      if (!confirmSignUp) throw new Error("No Signup method for " + signupType);
      return confirmSignUp(event);
    },
  };
};
