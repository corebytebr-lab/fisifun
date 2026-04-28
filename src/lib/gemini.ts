// Compat shim — old imports `from "@/lib/gemini"` now go through the
// server-side AI proxy (admin-configured provider). API key is no longer in
// the browser.

export {
  callGemini,
  callAI,
  fileToInlineData,
  AIError as GeminiError,
  TUTOR_SYSTEM,
} from "./ai-client";

export type { GeminiPart, GeminiMessage, AIPart, AIMessage } from "./ai-client";
