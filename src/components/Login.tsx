import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import BluestockLogo from "./BluestockLogo";

const provider = new GoogleAuthProvider();

export default function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex flex-col items-center gap-12 p-12 bg-gray-900/50 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl">
      <BluestockLogo />

      <div className="flex flex-col gap-6 w-full">
        <button
          onClick={handleLogin}
          className="bg-white text-black px-10 py-5 rounded-3xl font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl"
        >
          Sign in with Google
        </button>

        <button
          onClick={handleLogout}
          className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-red-400 transition-colors"
        >
          Logout Current Session
        </button>
      </div>
    </div>
  );
}
