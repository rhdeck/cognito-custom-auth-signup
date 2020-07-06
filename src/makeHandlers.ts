export interface Authenticator {
  key: string;
  preSignUp: (event: any) => Promise<any>;
  confirmSignUp: (event: any) => Promise<any>;
}
export default (authenticators: Authenticator[]) => {
  return {
    makePreSignUp: (event) => {
      const {
        request: {
          clientMetadata: { signupType },
        },
      } = event;
      console.log(
        "Starting to run makePreSignup with signupType of",
        signupType
      );
      const { preSignUp } =
        authenticators.find(({ key }) => key === signupType) || {};
      return preSignUp;
    },
    makeConfirmSignUp: (event) => {
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
