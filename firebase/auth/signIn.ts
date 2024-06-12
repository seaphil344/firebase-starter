import { firebase_app } from "../config";
import { signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo  } from "firebase/auth";
import { SignInError, SignInResult } from "@/types";

// Get the authentication instance using the Firebase app
const auth = getAuth(firebase_app);

// Function to sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  let result = null, // Variable to store the sign-in result
    error = null; // Variable to store any error that occurs

  try {
    result = await signInWithEmailAndPassword(auth, email, password); // Sign in with email and password
  } catch (e) {
    error = e; // Catch and store any error that occurs during sign-in
  }

  return { result, error }; // Return the sign-in result and error (if any)
}

export const signInWithGoogle = (): Promise<SignInResult | SignInError> => {
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      const additionalUserInfo = getAdditionalUserInfo(result);
      return { result: { token, user, additionalUserInfo } };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      return { error: { errorCode, errorMessage, email, credential } };
    });
};