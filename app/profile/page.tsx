'use client'
import { getAuth, updateEmail, updatePassword, sendEmailVerification, deleteUser, verifyBeforeUpdateEmail, reauthenticateWithCredential } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import '@/styles/Profile.css'

function ProfilePage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reauthenticationPassword, setReauthenticationPassword] = useState('');
  const [showReauthenticationPopup, setShowReauthenticationPopup] = useState(false);
  const [showDeleteConfirmationPopup, setShowDeleteConfirmationPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setCurrentEmail(user.email || '');
    }
  }, [user]);

  const handleReauthentication = async () => {
    try {
      if (!password) {
        setError('A password is required.');
        return;
      }
      if (!user) {
        setError('User is not authenticated.');
        return;
      }
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      console.log('Reauthentication successful!');
      setShowReauthenticationPopup(false); 
      setReauthenticationPassword('');
      setError(null);
    } catch (error) {
      console.error('Error during reauthentication:', error);
      setError('Reauthentication failed. Please try again.');
    }
  };

  const handleUpdateEmail = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
  
    if (!user) {
      setError('User is not authenticated.');
      return;
    }

    if (process.env.NEXT_PUBLIC_EMAIL_ENUMERATION_PROTECTION === 'true') {
      try {
        await verifyBeforeUpdateEmail(user, email);
        setMessage('Check new email for verification');
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Firebase: Error (auth/requires-recent-login).') {
            try {
              await handleReauthentication(); 
              await verifyBeforeUpdateEmail(user, email);
              setMessage('Check new email for verification');
            } catch (error) {
              if (error instanceof Error) {
                setMessage(`Error: ${error.message}`);
              } else {
                setMessage('An unknown error occurred.');
              }
            }
            return; 
          }
          setMessage(`Error: ${error.message}`);
        } else {
          setMessage('An unknown error occurred.');
        }
      }
    }
  
    if (process.env.NEXT_PUBLIC_EMAIL_ENUMERATION_PROTECTION === 'false') {
      try {
        await updateEmail(user, email);
        setMessage('Email updated successfully!');
        setCurrentEmail(email);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Firebase: Error (auth/requires-recent-login).') {
            try {
              await handleReauthentication(); 
              await verifyBeforeUpdateEmail(user, email);
              setMessage('Check new email for verification');
            } catch (error) {
              if (error instanceof Error) {
                setMessage(`Error: ${error.message}`);
              } else {
                setMessage('An unknown error occurred.');
              }
            }
            return; 
          }
          setMessage(`Error: ${error.message}`);
        } else {
          setMessage('An unknown error occurred.');
        }
      }
    }
  };

  const handleUpdatePassword = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!user) {
      setError('User is not authenticated.');
      return;
    }

    try {
      await updatePassword(user, password);
      setMessage('Password updated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Firebase: Error (auth/requires-recent-login).') {
          try {
            await handleReauthentication(); 
            await verifyBeforeUpdateEmail(user, email);
            setMessage('Check new email for verification');
          } catch (error) {
            if (error instanceof Error) {
              setMessage(`Error: ${error.message}`);
            } else {
              setMessage('An unknown error occurred.');
            }
          }
          return; 
        }
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  const handleSendVerificationEmail = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!user) {
      setError('User is not authenticated.');
      return;
    }

    try {
      await sendEmailVerification(user);
      setMessage('Verification email sent!');
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  const handleAccountDeletion = async () => {
    if (!user) {
      setError('User is not authenticated.');
      return;
    }

    try {
      await deleteUser(user);
      setMessage('Account deleted successfully');
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error deleting account: ${error.message}`);
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  const handleSavePreferences = () => {
    setMessage('Preferences saved successfully');
    console.log("Preferences saved:", { emailNotifications, smsNotifications });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-black">
      <Navbar />
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Profile Management</h1>
        {showReauthenticationPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>You must reauthenticate to make changes. Please enter your password.</h2>
              {error && <p className="error">{error}</p>}
              <input
                type="password"
                placeholder="Password"
                value={reauthenticationPassword}
                onChange={(e) => setReauthenticationPassword(e.target.value)}
                className="popup-input"
              />
              <button onClick={handleReauthentication} className="popup-button bg-blue-500 text-white">Submit</button>
              <button onClick={() => {setShowReauthenticationPopup(false); setReauthenticationPassword('');}} className="popup-button bg-gray-500 text-white">Cancel</button>
            </div>
          </div>
        )}
        {showDeleteConfirmationPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>Are you sure you want to delete your account? This action cannot be undone.</h2>
              <button onClick={handleAccountDeletion} className="popup-button bg-red-500 text-white">Delete</button>
              <button onClick={() => setShowDeleteConfirmationPopup(false)} className="popup-button bg-gray-500 text-white">Cancel</button>
            </div>
          </div>
        )}
        {message && <p className="mb-4 text-center">{message}</p>}

        <form onSubmit={handleUpdateEmail} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4">Update Email</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Current Email: {currentEmail}
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="New email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
          >
            Update Email
          </button>
        </form>

        <form onSubmit={handleUpdatePassword} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4">Update Password</h2>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="New password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
          >
            Update Password
          </button>
        </form>

        {!user?.emailVerified && (
          <form onSubmit={handleSendVerificationEmail} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">Send Verification Email</h2>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
            >
              Send Verification Email
            </button>
          </form>
        )}

        <form onSubmit={handleSavePreferences} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email Notifications</label>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">SMS Notifications</label>
            <input
              type="checkbox"
              checked={smsNotifications}
              onChange={(e) => setSmsNotifications(e.target.checked)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
          >
            Save Preferences
          </button>
        </form>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
          <button
            onClick={() => setShowDeleteConfirmationPopup(true)}
            className="w-full bg-red-500 text-white font-semibold py-2 rounded"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
