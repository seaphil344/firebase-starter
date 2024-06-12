'use client'
import { signInWithEmail, signInWithGoogle } from "@/firebase/auth/signIn";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { isError } from "@/types";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import '@/styles/Auth.css'

function SignInPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const { result, error } = await signInWithEmail(email, password);

    if (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred.');
      }
      console.log(error);
      return;
    }

    if (result && !result.user.emailVerified && process.env.NEXT_PUBLIC_ALLOW_UNVERIFIED_LOGIN === 'false') {
      const auth = getAuth();
      await signOut(auth);
      setMessage('Please verify your email before signing in.');
      return;
    }

    console.log(result);
    setMessage('Sign in successful! Redirecting to the admin page...');
    router.push("/admin");
  };

  const handleGoogleSignIn = async () => {
    const response = await signInWithGoogle();

    if (isError(response)) {
      if (response.error instanceof Error) {
        console.log(response.error.message);
        setMessage(`Error: ${response.error.message}`);
      } else {
        console.log('An unknown error occurred.');
        setMessage('An unknown error occurred.');
      }
      return;
    }

    console.log(response.result);
    router.push("/admin");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
        <div className="w-full max-w-xs">
          <form onSubmit={handleForm} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="text-3xl font-bold mb-6 text-black">Sign In</h1>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                name="email"
                id="email"
                placeholder="example@mail.com"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                name="password"
                id="password"
                placeholder="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {message && <p className="mt-4 text-center">{message}</p>}
            {message.includes('verify your email') && (
              <div className="mt-4 text-center">
                <Link href="/send-verification-email">Send Verification Email</Link>
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
              >
                Sign In
              </button>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-red-500 text-white font-semibold py-2 rounded mt-4"
              >
                Sign In with Google
              </button>
            </div>
            <div className="mt-4">
              <p>
                <Link href="/auth/signup" className="text-blue-900">Don't have an account? Sign Up</Link>
              </p>
              <p>
                <Link href="/auth/reset-password-request" className="text-blue-900">Forgot your password?</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
