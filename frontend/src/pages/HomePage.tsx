import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";
import toast from "react-hot-toast";

const HomePage = () => {
  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={() => toast.success("this is a toast on click")}
      >
        Click me
      </button>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="btn btn-primary">Login</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <button className="btn btn-primary">Sign Out</button>
        </SignOutButton>
      </SignedIn>

      <UserButton></UserButton>
    </div>
  );
};
export default HomePage;
