export interface Authenticator {
  key: string;
  preSignUp: (event: any) => Promise<any>;
  confirmSignUp: (event: any) => Promise<any>;
}
export default (authenticators: Authenticator[]) => {
  return {
    makePreSignUp: async (event) => {
      const {
        request: {
          clientMetadata: { signupType },
        },
      } = event;
      const { preSignUp } =
        authenticators.find(({ key }) => key === signupType) || {};
      return preSignUp;
    },
    makeConfirmSignUp: async (event) => {
      const {
        request: {
          clientMetadata: { signupType },
        },
      } = event;
      const { confirmSignUp } =
        authenticators.find(({ key }) => key === signupType) || {};
      return confirmSignUp;
    },
  };
};
