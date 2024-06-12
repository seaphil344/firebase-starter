'use client'
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const SignOutButton: React.FC = () => {
  const router = useRouter()
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.push('/')
      // Handle successful sign out
    }).catch((error) => {
      // Handle sign out error
      console.error('Sign out error:', error);
    });
  };

  return (
    <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
      Sign Out
    </button>
  );
};

export default SignOutButton;
