import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import '@/styles/Navbar.css'

const Navbar: React.FC = () => {
  const { user, setUser } = useAuthContext();
  const router = useRouter();

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
    router.push("/auth/signin");
  };

  return (
    <nav className="bg-gray-800 w-full p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link href="/">My App</Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/profile" className="text-white font-semibold py-2 px-4 rounded bg-gray-700 hover:bg-gray-900">
                Profile
              </Link>
              <button onClick={handleSignOut} className="text-white font-semibold py-2 px-4 rounded bg-red-500 hover:bg-red-700">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-white font-semibold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700">
                Login
              </Link>
              <Link href="/auth/signup" className="text-white font-semibold py-2 px-4 rounded bg-green-500 hover:bg-green-700">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
