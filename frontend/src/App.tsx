import { Navigate, Route, Routes } from "react-router";

import { useUser } from "@clerk/clerk-react";

// Pages
import HomePage from "./pages/HomePage";
import { ProblemsPage } from "./pages/ProblemsPage";
import { Toaster } from "react-hot-toast";

/**
 * Render the main application UI, including a welcome heading and authentication controls.
 *
 * @returns A JSX element containing: an H1 welcome heading, a modal sign-in button shown when signed out, a sign-out button shown when signed in, and a user button for the authenticated user.
 */
function App() {
  const { isSignedIn } = useUser();
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/problems"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
