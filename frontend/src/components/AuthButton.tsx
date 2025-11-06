import { SignInButton } from "@clerk/clerk-react";
import { ArrowRightIcon } from "lucide-react";

const AuthButton = () => {
  return (
    <SignInButton mode="modal">
      <button className="group px-6 py-3 bg-linear-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2">
        <span>Get Started</span>
        <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </SignInButton>
  );
};
export default AuthButton;
