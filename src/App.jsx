import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <header>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}

export default App;
