import React from "react";
import AssistantPreview from "../components/AssistantPreview";
import {
  HiOutlineMicrophone,
  HiOutlineGlobeAlt,
  HiOutlineBolt,
} from "react-icons/hi2";
import { BsRobot } from "react-icons/bs";
import { MdOutlineSupportAgent } from "react-icons/md";
import { FiCode } from "react-icons/fi";

const Home = ({ user }) => {
  const assistantName = user?.assistantName || "Shifra AI";

  const steps = [
    {
      number: "01",
      title: "Sign up free",
      desc: "Continue with Google and create your assistant instantly.",
    },
    {
      number: "02",
      title: "Customize assistant",
      desc: "Set business name, tone, voice and branding.",
    },
    {
      number: "03",
      title: "Train your assistant",
      desc: "Add website content and personalize responses.",
    },
    {
      number: "04",
      title: "Embed anywhere",
      desc: "Copy one script tag and add it to your website.",
    },
  ];

  const features = [
    {
      icon: <HiOutlineMicrophone size={28} />,
      title: "Voice AI",
      desc: "Talk naturally with your assistant using voice commands.",
    },
    {
      icon: <HiOutlineGlobeAlt size={28} />,
      title: "Website Navigation",
      desc: "Guide users through your website effortlessly.",
    },
    {
      icon: <HiOutlineBolt size={28} />,
      title: "Instant Responses",
      desc: "Ultra-fast AI answers for every visitor.",
    },
    {
      icon: <BsRobot size={28} />,
      title: "Custom AI",
      desc: "Train assistants on your own business data.",
    },
    {
      icon: <MdOutlineSupportAgent size={28} />,
      title: "24/7 Support",
      desc: "Provide support around the clock automatically.",
    },
    {
      icon: <FiCode size={28} />,
      title: "Easy Integration",
      desc: "Add to any website using one script tag.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[180px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/20 blur-[180px] rounded-full" />

      <div className="relative z-10">

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Voice AI for modern websites
          </div>

          <h1 className="mt-8 text-5xl md:text-7xl font-bold leading-tight">
            Add a{" "}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-transparent bg-clip-text">
              Virtual Assistant
            </span>
            <br />
            to your website
          </h1>

          <p className="max-w-3xl mx-auto mt-8 text-lg text-gray-400">
            Create a smart voice-enabled assistant that talks to visitors,
            answers questions and helps users navigate your website instantly.
          </p>

          <button className="mt-10 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-lg hover:scale-105 transition" onClick={() => window.location.href = "/builder"}>
            Build Your Assistant
          </button>

          <p className="mt-4 text-gray-500">
            Free plan includes 100 AI responses
          </p>
        </section>

       
        <section className="py-20 flex justify-center">
  <div className="scale-110 md:scale-125">
    <AssistantPreview user={user} />
  </div>
</section>

        
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h2 className="text-5xl font-bold">
              Get started in minutes
            </h2>

            <p className="mt-4 text-gray-400">
              Simple setup. No complicated integration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-purple-500/40 transition"
              >
                <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  {step.number}
                </h3>

                <h4 className="mt-5 text-xl font-semibold">
                  {step.title}
                </h4>

                <p className="mt-3 text-gray-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h2 className="text-5xl font-bold">
              Why choose {assistantName}
            </h2>

            <p className="mt-4 text-gray-400">
              Everything you need to build an intelligent website assistant.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-cyan-500/40 hover:bg-white/10 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center mb-5">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-[40px] bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-white/10 p-12 text-center">
            <h2 className="text-4xl font-bold">
              Ready to build your AI assistant?
            </h2>

            <p className="mt-4 text-gray-400">
              Launch a smart voice assistant for your website in minutes.
            </p>

            <button className="mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-semibold hover:scale-105 transition" onClick={() => window.location.href = "/builder"}>
              Start Building
            </button>
          </div>
        </section>

        
        <footer className="border-t border-white/10 py-8 text-center text-gray-500">
          © 2026 Jarvis AI. All rights reserved.
        </footer>

      </div>
    </div>
  );
};

export default Home;