'use client'
import { getAuth, sendEmailVerification, fetchSignInMethodsForEmail } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import '@/styles/Auth.css'
import Navbar from "@/components/Navbar";

function SendVerificationEmailPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    setIsLoggedIn(!!user);
  }, [auth]);

  const handleSendVerificationEmail = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isLoggedIn && auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setMessage('Verification email sent! Please check your email.');
      } catch (error) {
        if (error instanceof Error) {
          setMessage(`Error: ${error.message}`);
        } else {
          setMessage('An unknown error occurred.');
        }
      }
    } else if (email) {
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          const user = auth.currentUser;
          if (user) {
            await sendEmailVerification(user);
            setMessage('Verification email sent! Please check your email.');
          } else {
            setMessage('No authenticated user found.');
          }
        } else {
          setMessage('No user found with this email.');
        }
      } catch (error) {
        if (error instanceof Error) {
          setMessage(`Error: ${error.message}`);
        } else {
          setMessage('An unknown error occurred.');
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-xs">
          <form onSubmit={handleSendVerificationEmail} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="text-3xl font-bold mb-6 text-black">Send Verification Email</h1>
            {isLoggedIn ? (
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
                >
                  Send Verification Email
                </button>
              </div>
            ) : (
              <>
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
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
                  >
                    Send Verification Email
                  </button>
                </div>
              </>
            )}
            {message && <p className="mt-4 text-center">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SendVerificationEmailPage;
