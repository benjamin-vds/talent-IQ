import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";

/**
 * Render the main application UI, including a welcome heading and authentication controls.
 *
 * @returns A JSX element containing: an H1 welcome heading, a modal sign-in button shown when signed out, a sign-out button shown when signed in, and a user button for the authenticated user.
 */
function App() {
  return (
    <>
      <h1>Welcome to the app</h1>
      <SignedOut>
        <SignInButton mode="modal" >
          <button className="">Login</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton />
        
      </SignedIn>
      <UserButton />
    </>
  );
}

export default App;