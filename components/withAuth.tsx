import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthWrapper = (props: any) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
      const user = auth.currentUser;

      const directUser = () => {
        if (!user) {
          router.push("/auth/signin");
        } else if (user && user.emailVerified === false && process.env.NEXT_PUBLIC_LIMIT_UNVERIFIED_USE === 'true') {
          router.push("/auth/send-verification-email");
        } else {
          setLoading(false);
        }
      };

      directUser();

      return () => {
        // Cleanup if necessary
      };
    }, [auth, router]);

    if (loading) {
      return <div>Loading...</div>; // or any loading indicator
    }

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};

export default withAuth;
