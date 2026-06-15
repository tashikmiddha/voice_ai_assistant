import React, { useEffect, useState } from "react";
import { HiOutlineMicrophone } from "react-icons/hi";

const themes = {
  light: {
    card: "bg-white border-gray-200 text-gray-900 shadow-xl",
    orb: "from-blue-500 via-purple-500 to-pink-500",
    text: "text-gray-600",
    mic: "from-blue-500 to-purple-500",
  },

  dark: {
    card: "bg-slate-900 border-slate-700 text-white shadow-2xl",
    orb: "from-purple-500 via-pink-500 to-cyan-400",
    text: "text-gray-400",
    mic: "from-purple-600 to-cyan-500",
  },

  glass: {
    card:
      "bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl",
    orb: "from-cyan-400 via-purple-500 to-pink-500",
    text: "text-gray-300",
    mic: "from-cyan-500 to-purple-500",
  },

  neon: {
    card:
      "bg-black border-cyan-500 text-cyan-100 shadow-[0_0_50px_rgba(6,182,212,0.4)]",
    orb: "from-cyan-400 via-blue-500 to-purple-500",
    text: "text-cyan-300",
    mic: "from-cyan-400 to-blue-500",
  },
};

const AssistantPreview = ({ user }) => {
  const resolveTheme = (themeName) => (themes[themeName] ? themeName : "dark")

  const [selectedTheme, setSelectedTheme] = useState(
    resolveTheme(user?.theme)
  );

  useEffect(() => {
    setSelectedTheme(resolveTheme(user?.theme))
  }, [user?.theme])

  const theme = themes[resolveTheme(selectedTheme)] || themes.dark;

  return (
    <div className="flex flex-col items-center">

      {/* Theme Selector */}
      <div className="flex gap-3 mb-8">
        {Object.keys(themes).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSelectedTheme(item)}
            className={`
              w-5 h-5 rounded-full border-2
              ${
                selectedTheme === item
                  ? "scale-125 border-white"
                  : "border-gray-500"
              }
            `}
            style={{
              background:
                item === "light"
                  ? "#ffffff"
                  : item === "dark"
                  ? "#111827"
                  : item === "glass"
                  ? "#94a3b8"
                  : "#06b6d4",
            }}
          />
        ))}
      </div>

      {/* Assistant Card */}
      <div
        className={`
          relative
          w-95
          h-140
          rounded-[40px]
          border
          overflow-hidden
          transition-all
          duration-500
          ${theme.card}
        `}
      >
        {/* Browser Dots */}
        {/* <div className="flex justify-end gap-2 p-5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div> */}

        {/* Orb */}
        <div className="flex justify-center mt-6">
          <div className="relative">
            <div
              className={`
                absolute inset-0
                rounded-full
                blur-3xl
                animate-pulse
                bg-linear-to-r
                ${theme.orb}
              `}
            />

            <div
              className={`
                relative
                w-36
                h-36
                rounded-full
                bg-linear-to-r
                ${theme.orb}
              `}
            />
          </div>
        </div>

        
        <div className="text-center px-8 mt-10">
          <h2 className="text-4xl font-bold">
            Hello! I'm {user?.assistantName || "Shifra AI"}
          </h2>

          <p className={`mt-5 ${theme.text}`}>
            Your smart voice assistant.
          </p>

          <p className={`mt-2 ${theme.text}`}>
            Ask anything about your website.
          </p>
        </div>

        {/* Listening */}
        <div className="mt-12 text-center">
          <p className="text-green-400 font-medium">
            Listening...
          </p>

          <div className="flex justify-center gap-2 mt-6 items-end h-10">
            {[12, 28, 18, 35, 22].map((height, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-green-400 animate-pulse"
                style={{
                  height: `${height}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Mic */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <button
            className={`
              w-20
              h-20
              rounded-full
              bg-linear-to-r
              ${theme.mic}
              flex
              items-center
              justify-center
              shadow-xl
              hover:scale-110
              transition
            `}
          >
            <HiOutlineMicrophone className="text-3xl text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantPreview;