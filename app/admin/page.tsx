'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SignOutButton from "@/components/SignOutButton";
import withAuth from "@/components/withAuth";

function Page(): JSX.Element {
  // Access the user object from the authentication context
  // const { user } = useAuthContext();
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const router = useRouter();
  
  return (
    <div>
      <h1>You are logged in</h1>
      <SignOutButton />
    </div>
  );
}

export default withAuth(Page);
