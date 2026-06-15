import React from "react";
import { useState } from "react";
import { DiAndroid } from "react-icons/di";
import { FaGoogle } from "react-icons/fa";
import { HiOutlineMicrophone } from "react-icons/hi";
import { MdSettingsVoice } from "react-icons/md";
import { GiLightningBow } from "react-icons/gi";
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";
const Login = ({setUser}) => {
   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const features = [
    {
      icon: <HiOutlineMicrophone className="text-3xl text-cyan-400" />,
      title: "Voice AI",
      description:
        "Interact naturally with your AI assistant using voice commands.",
    },
    {
      icon: <DiAndroid className="text-3xl text-green-400" />,
      title: "Smart Navigation",
      description:
        "Access your assistant on any device, anytime and anywhere.",
    },
    {
      icon: <FaGoogle className="text-3xl text-red-400" />,
      title: "Google Integration",
      description:
        "Connect seamlessly with Google services and workflows.",
    },
    {
      icon: <MdSettingsVoice className="text-3xl text-purple-400" />,
      title: "Fast Responses",
      description:
        "Ultra-low latency responses for a smooth user experience.",
    },
    {
      icon: <GiLightningBow className="text-3xl text-yellow-400" />,
      title: "Optimized GenAI",
      description:
        "Powerful AI responses tailored for your business needs.",
    },
  ];
  

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email } = result.user;
      const res = await axios.post(
        serverUrl + "/api/auth/google",
        {
          name: displayName,
          email: email,
        },
        { withCredentials: true }
      );
      if (res && res.status >= 200 && res.status < 300) {
        const serverUser = res.data && res.data.user ? res.data.user : { name: displayName, email };
        setUser(serverUser);
        toast.success("Google sign-in successful!");
        setLoading(false);
        navigate("/", { replace: true });
      } else {
        setErrorMessage("Google sign-in failed. Please try again.");
        toast.error("Google sign-in failed. Please try again.");
        setLoading(false);
      }
      
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Unable to start Google sign-in. Please try again.");
      toast.error("Unable to start Google sign-in. Please try again.");
      setLoading(false);
    }

  };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-linear-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
              <DiAndroid className="text-3xl text-white" />
            </div>

            <h2 className="text-xl font-semibold">
              AI Voice Assistant Platform
            </h2>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Build AI Assistants
            <br />
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              For Any Website
            </span>
          </h1>

          <p className="text-gray-400 text-lg mb-8 max-w-xl">
            Create intelligent AI voice assistants that talk, guide users,
            answer questions, and integrate into any website instantly.
          </p>

          <button 
            className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleLogin}
            disabled={loading}
          >
            <FaGoogle className="text-xl" />
            {loading ? "Redirecting..." : "Continue with Google"}
          </button>

          {errorMessage ? (
            <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
          ) : null}

          <p className="text-gray-500 mt-4">
            Free plan includes 100 AI responses.
          </p>
        </div>

        {/* Right Section */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-8">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>

                <h3 className="font-semibold text-lg mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;