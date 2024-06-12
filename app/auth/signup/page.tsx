'use client'
import signUp from "@/firebase/auth/signup";
import { getAuth, sendEmailVerification, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import '@/styles/Auth.css'
import Navbar from "@/components/Navbar";

function Page(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const confirmPasswordEnabled = process.env.NEXT_PUBLIC_CONFIRM_PASSWORD === 'true';

  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (confirmPasswordEnabled && password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const { result, error } = await signUp(email, password);

    if (error) {
      console.log(error);
      setMessage(`Error: ${error.message}`);
      return;
    }

    if (result && process.env.NEXT_PUBLIC_ALLOW_UNVERIFIED_SIGNUP === 'false') {
      const auth = getAuth();
      await sendEmailVerification(result.user);
      await signOut(auth);
      setMessage('Verification email sent! Please check your email.');
      return;
    }

    console.log(result);
    setMessage('Sign up successful! Redirecting to the admin page...');
    router.push("/admin");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-96 bg-white rounded shadow p-6">
          <h1 className="text-3xl text-black font-bold mb-6">Registration</h1>
          <form onSubmit={handleForm} className="space-y-4">
            <div>
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
            <div>
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
            {confirmPasswordEnabled && (
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="confirm password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
            >
              Sign up
            </button>
            <div className="mt-4">
              <p>
                <Link href="/auth/signin" className="text-blue-900">Already have an account?</Link>
              </p>
            </div>
            {message && <p className="mt-4 text-center">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
