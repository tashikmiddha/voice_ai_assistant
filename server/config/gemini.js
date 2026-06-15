// const DEFAULT_GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];

// const GEMINI_MODELS = [
//     process.env.GEMINI_MODEL,
//     ...(process.env.GEMINI_FALLBACK_MODELS || "").split(","),
//     ...DEFAULT_GEMINI_MODELS,
// ]
//     .map((model) => String(model || "").trim())
//     .filter(Boolean)
//     .filter((model, index, models) => models.indexOf(model) === index);

// const createGeminiError = (message, status, model) => {
//     const error = new Error(message);
//     error.status = status;
//     error.model = model;
//     return error;
// };

// export const generateGeminiResponse = async (prompt, apiKey, user) => {
//     try {
//         if (!apiKey) {
//             throw new Error("Gemini API key is missing. Please provide a valid API key.");
//         }

//         let lastError = null;

//         for (const model of GEMINI_MODELS) {
//             for (let attempt = 1; attempt <= 2; attempt += 1) {
//                 try {
//                     return await generateWithModel(prompt, apiKey, user, model);
//                 } catch (error) {
//                     lastError = error;

//                     if (!isRetryableGeminiError(error)) {
//                         throw error;
//                     }

//                     console.warn(`Gemini model ${model} failed temporarily on attempt ${attempt}: ${error.message}`);

//                     if (attempt === 1) {
//                         await sleep(500);
//                     }
//                 }
//             }
//         }

//         throw lastError || createGeminiError("Gemini API is temporarily unavailable. Please try again later.", 503);
//     } catch (error) {
//         console.error("Error generating Gemini response:", error);
//         throw error;
//     }
// };

// const generateWithModel = async (prompt, apiKey, user, model) => {
//     const response = await fetch(getGeminiUrl(model), {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "x-goog-api-key": apiKey,
//         },
//         body: JSON.stringify({
//             contents: [
//                 {
//                     role: "user",
//                     parts: [{ text: prompt }],
//                 },
//             ],
//             generationConfig: {
//                 temperature: 0.7,
//                 candidateCount: 1,
//                 maxOutputTokens: 120,
//             },
//         }),
//     });

//     if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.error(`Gemini API Error Response (${model}):`, errorData);

//         if (response.status === 401 || response.status === 400) {
//             if (user) {
//                 user.geminiStatus = "invalid";
//                 await user.save();
//             }
//             throw createGeminiError("Invalid Gemini API key. Please provide a valid API key.", 400, model);
//         }

//         if (response.status === 403) {
//             if (user) {
//                 user.geminiStatus = "invalid";
//                 await user.save();
//             }
//             throw createGeminiError("Access to Gemini API is forbidden. Please check your API key permissions.", 403, model);
//         }

//         if (response.status === 429) {
//             if (user && !isTemporaryUnavailable(errorData)) {
//                 user.geminiStatus = "quota_exceeded";
//                 await user.save();
//             }
//             throw createGeminiError("Rate limit exceeded for Gemini API. Please try again later.", 429, model);
//         }

//         if (response.status === 503) {
//             throw createGeminiError(
//                 errorData.error?.message || "Gemini API is temporarily unavailable. Please try again later.",
//                 503,
//                 model
//             );
//         }

//         throw createGeminiError(
//             `Gemini API request failed with status ${response.status}: ${errorData.error?.message || "Unknown error"}`,
//             response.status,
//             model
//         );    
//     }

//     if (user) {
//         user.geminiStatus = "active";
//         await user.save();
//     }

//     const data = await response.json();
//     const text = data.candidates?.[0]?.content?.parts
//         ?.map((part) => part.text || "")
//         .join("")
//         .trim();

//     if (!text) {
//         throw new Error("Invalid response format from Gemini API. Expected text content is missing.");
//     }

//     return text.trim();
// };

// const getGeminiUrl = (model) =>
//     `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

// const isRetryableGeminiError = (error) => error?.status === 503 || error?.status === 429;

// const isTemporaryUnavailable = (errorData) =>
//     String(errorData?.error?.status || "").toUpperCase() === "UNAVAILABLE";

// const sleep = (ms) => new Promise((resolve) => {
//     setTimeout(resolve, ms);
// });
import OpenAI from "openai";

const DEFAULT_OPENAI_MODELS = [
  "gpt-5-mini",
  "gpt-5"
];

const OPENAI_MODELS = [
  process.env.OPENAI_MODEL,
  ...DEFAULT_OPENAI_MODELS
]
.filter(Boolean);

const createOpenAIError = (message, status, model) => {
  const error = new Error(message);
  error.status = status;
  error.model = model;
  return error;
};

export const generateGeminiResponse = async (
  prompt,
  apiKey,
  user
) => {
  if (!apiKey) {
    throw new Error("OpenAI API key is missing.");
  }

  let lastError = null;

  for (const model of OPENAI_MODELS) {
    try {
      return await generateWithModel(
        prompt,
        apiKey,
        user,
        model
      );
    } catch (error) {
      lastError = error;

      if (
        error.status !== 429 &&
        error.status !== 503
      ) {
        throw error;
      }
    }
  }

  throw (
    lastError ||
    createOpenAIError(
      "OpenAI is temporarily unavailable.",
      503
    )
  );
};

const generateWithModel = async (
  prompt,
  apiKey,
  user,
  model
) => {
  const openai = new OpenAI({
    apiKey,
  });

  try {
    const response = await openai.responses.create({
  model,
  input: prompt,
  reasoning: {
    effort: "minimal"
  },
  text: {
    verbosity: "low"
  },
  max_output_tokens: 150
});

    const text = response.output_text?.trim();

    if (!text) {
  console.log(response);

  return "Sorry, I couldn't generate a response.";
}

    if (user) {
      user.geminiStatus = "active";
      await user.save();
    }

    return text;
  } catch (error) {

    if (
      error.status === 401 ||
      error.status === 400
    ) {
      if (user) {
        user.geminiStatus = "invalid";
        await user.save();
      }

      throw createOpenAIError(
        "Invalid OpenAI API key.",
        400,
        model
      );
    }

    if (error.status === 429) {
      if (user) {
        user.geminiStatus = "quota_exceeded";
        await user.save();
      }

      throw createOpenAIError(
        "OpenAI quota exceeded.",
        429,
        model
      );
    }

    throw createOpenAIError(
      error.message,
      error.status || 500,
      model
    );
  }
};