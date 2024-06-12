'use client'
import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { firebase_app } from '@/firebase/config';
import '@/styles/Auth.css'
import Navbar from '@/components/Navbar';

function ResetPasswordRequestPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const auth = getAuth(firebase_app);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-xs">
          <form onSubmit={handleResetPassword} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="text-3xl font-bold mb-6 text-black">Reset Password</h1>
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
                Send Reset Email
              </button>
            </div>
            {message && <p className="mt-4 text-center">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordRequestPage;
