(function () {
  const script = document.currentScript;
  const userId = script?.dataset?.userId;
  const apiBase = (script?.dataset?.apiBase || "http://localhost:8000").replace(/\/$/, "");
  const assetBase = new URL(".", script?.src || window.location.href).href.replace(/\/$/, "");
  const assistantLanguage = script?.dataset?.language || "en-US";
  const requestedVoiceName = script?.dataset?.voice || "";

  if (!userId) {
    console.error("Assistant: Missing data-user-id");
    return;
  }

  let assistantConfig = null;
  let recognition = null;
  let isRecognizing = false;

  const SELECTORS = {
    launcher: "assistant-launcher",
    widget: "assistant-widget",
  };

  loadCss();
  loadVoices();
  loadAssistant();

  function loadCss() {
    if (document.querySelector('link[data-assistant-css="true"]')) return;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${assetBase}/assistant.css`;
    css.dataset.assistantCss = "true";
    document.head.appendChild(css);
  }

  async function loadAssistant() {
    try {
      const res = await fetch(`${apiBase}/api/assistant/config/${encodeURIComponent(userId)}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch config: ${res.status}`);
      }

      const data = await res.json();
      assistantConfig = data.user || data;
      createLauncher();
    } catch (error) {
      console.error("Assistant Config Error:", error);
    }
  }

  function getTheme() {
    const rawTheme = assistantConfig?.theme || "dark";
    const themeMap = {
      white: "light",
      light: "light",
      dark: "dark",
      glass: "glass",
      neon: "neon",
    };

    return themeMap[rawTheme] || "dark";
  }

  function createLauncher() {
    if (document.querySelector(`.${SELECTORS.launcher}`)) return;

    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = `${SELECTORS.launcher} ${getTheme()}`;
    launcher.setAttribute("aria-label", "Open assistant");
    launcher.innerHTML = `<img src="${assetBase}/logo.png" alt="" />`;
    launcher.addEventListener("click", toggleAssistant);

    document.body.appendChild(launcher);
  }

  function toggleAssistant() {
    const existing = document.getElementById(SELECTORS.widget);

    if (existing) {
      stopRecognition();
      window.speechSynthesis?.cancel();
      existing.remove();
      return;
    }

    createAssistant();
  }

  function createAssistant() {
    const existing = document.getElementById(SELECTORS.widget);
    if (existing) return;

    const theme = getTheme();
    const assistantName = assistantConfig?.assistantName || "Jarvis";
    const businessName = assistantConfig?.businessName || "this website";

    const widget = document.createElement("section");
    widget.id = SELECTORS.widget;
    widget.className = `assistant-widget ${theme}`;
    widget.setAttribute("aria-label", `${assistantName} assistant`);
    widget.innerHTML = `
      <button class="assistant-close" type="button" aria-label="Close assistant">x</button>
      <div class="assistant-body">
        <div class="assistant-orb" aria-hidden="true"></div>
        <h3></h3>
        <p class="assistant-business"></p>
        <p>Ask me anything about this website.</p>
        <div class="assistant-status" aria-live="polite">Tap button to speak</div>
        <div class="assistant-transcript">
          <div class="user-text"></div>
          <div class="assistant-text"></div>
        </div>
        <div class="assistant-waves" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <button class="assistant-mic" type="button" aria-label="Speak to assistant">
        <img src="${assetBase}/mic.png" alt="" />
      </button>
    `;

    widget.querySelector("h3").textContent = `Hello! I'm ${assistantName}`;
    widget.querySelector(".assistant-business").textContent = `I'm your smart assistant for ${businessName}.`;

    document.body.appendChild(widget);
    bindWidget(widget);
  }

  function bindWidget(widget) {
    const closeButton = widget.querySelector(".assistant-close");
    const micButton = widget.querySelector(".assistant-mic");

    closeButton?.addEventListener("click", () => {
      stopRecognition();
      window.speechSynthesis?.cancel();
      widget.remove();
    });

    micButton?.addEventListener("click", () => {
      startListening(widget);
    });

    if (!getSpeechRecognition()) {
      setStatus(widget, "Speech recognition is not supported in this browser.");
      if (micButton) micButton.disabled = true;
    } else {
      setStatus(widget, "Tap button to speak");
    }
  }

  function getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }

  function loadVoices() {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  function setupRecognition(widget) {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return null;

    const nextRecognition = new SpeechRecognition();
    nextRecognition.lang = assistantConfig?.language || assistantLanguage;
    nextRecognition.interimResults = false;
    nextRecognition.continuous = false;

    nextRecognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (!transcript) {
        resetWidget(widget, "Tap button to speak");
        return;
      }

      widget.querySelector(".user-text").textContent = `You: ${transcript}`;
      askAssistant(widget, transcript);
    };

    nextRecognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      resetWidget(widget, "Error occurred. Try again.");
    };

    nextRecognition.onend = () => {
      isRecognizing = false;
      if (widget.classList.contains("listening")) {
        widget.classList.remove("listening");
      }
    };

    return nextRecognition;
  }

  function startListening(widget) {
    if (isRecognizing) return;

    recognition = setupRecognition(widget);
    if (!recognition) {
      setStatus(widget, "Speech recognition is not supported in this browser.");
      return;
    }

    window.speechSynthesis?.cancel();
    widget.querySelector(".user-text").textContent = "";
    widget.querySelector(".assistant-text").textContent = "";
    widget.classList.add("listening");
    setStatus(widget, "Listening...");

    try {
      isRecognizing = true;
      recognition.start();
    } catch (error) {
      console.error("Speech Recognition Start Error:", error);
      resetWidget(widget, "Error occurred. Try again.");
    }
  }

  function stopRecognition() {
    if (!recognition || !isRecognizing) return;

    try {
      recognition.stop();
    } catch (error) {
      console.error("Speech Recognition Stop Error:", error);
    } finally {
      isRecognizing = false;
    }
  }

  async function askAssistant(widget, message) {
    try {
      widget.classList.remove("listening");
      widget.classList.add("thinking");
      setStatus(widget, "Thinking...");

      const res = await fetch(`${apiBase}/api/assistant/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message,
          currentPath: window.location.pathname,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const error = new Error(data.message || `Assistant API failed: ${res.status}`);
        error.status = res.status;
        throw error;
      }
      
      const reply = data.response || data.aiResponse || data.answer || "I could not find an answer.";
      widget.querySelector(".assistant-text").textContent = `${assistantConfig?.assistantName || "Assistant"}: ${reply}`;
      const transcriptBox = widget.querySelector(".assistant-transcript");
      transcriptBox.scrollTop = transcriptBox.scrollHeight;
      speak(widget, reply, () => {
        if (data.action === "navigate" && data.path) {
          window.location.href = data.path;
        }
      });
    } catch (error) {
      console.error("Assistant Ask Error:", error);
      const messageText = getAssistantErrorMessage(error);
      widget.querySelector(".assistant-text").textContent = messageText;
      const transcriptBox = widget.querySelector(".assistant-transcript");
      transcriptBox.scrollTop = transcriptBox.scrollHeight;
      speak(widget, messageText);
    }
  }

  function getAssistantErrorMessage(error) {
    if (error?.message === "Gemini API key not configured") {
      return "Please add your Gemini API key in the assistant builder.";
    }

    if (error?.status === 503) {
      return "The assistant is busy right now. Please try again in a moment.";
    }

    if (error?.status === 429) {
      return "The assistant is receiving too many requests. Please try again soon.";
    }

    return error?.status === 400
      ? error.message
      : "Sorry, something went wrong.";
  }

  function speak(widget, text, onDone) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      resetWidget(widget, "Tap button to speak");
      onDone?.();
      return;
    }

    window.speechSynthesis.cancel();
    widget.classList.remove("thinking");
    widget.classList.add("speaking");
    setStatus(widget, "Speaking...");

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = assistantConfig?.language || assistantLanguage;
    const preferredVoice = getPreferredVoice(speech.lang);
    if (preferredVoice) speech.voice = preferredVoice;
    speech.rate = 1.2;
    speech.pitch = 1.08;
    speech.volume = 1;

    speech.onend = () => {
      resetWidget(widget, "Tap button to speak");
      onDone?.();
    };

    speech.onerror = () => {
      resetWidget(widget, "Tap button to speak");
      onDone?.();
    };

    window.speechSynthesis.speak(speech);
  }

  function getPreferredVoice(language) {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    if (!voices.length) return null;

    const normalizedLanguage = String(language || assistantLanguage).toLowerCase();
    const languagePrefix = normalizedLanguage.split("-")[0];
    const sameLanguageVoices = voices.filter((voice) => {
      const voiceLanguage = String(voice.lang || "").toLowerCase();
      return voiceLanguage === normalizedLanguage || voiceLanguage.startsWith(`${languagePrefix}-`);
    });
    const usableVoices = sameLanguageVoices.length ? sameLanguageVoices : voices;

    if (requestedVoiceName) {
      const requestedVoice = usableVoices.find((voice) =>
        voice.name.toLowerCase().includes(requestedVoiceName.toLowerCase())
      );
      if (requestedVoice) return requestedVoice;
    }

    const femaleVoiceNames = [
      "samantha",
      "victoria",
      "karen",
      "moira",
      "tessa",
      "serena",
      "zira",
      "jenny",
      "aria",
      "susan",
      "hazel",
      "female",
      "google uk english female",
      "google us english",
    ];

    return usableVoices.find((voice) =>
      femaleVoiceNames.some((name) => voice.name.toLowerCase().includes(name))
    ) || usableVoices[0];
  }

  function resetWidget(widget, message) {
    widget.classList.remove("listening", "thinking", "speaking");
    setStatus(widget, message);
  }

  function setStatus(widget, message) {
    const status = widget.querySelector(".assistant-status");
    if (status) status.textContent = message;
  }
})();
