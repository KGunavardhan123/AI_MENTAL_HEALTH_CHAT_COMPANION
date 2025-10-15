export const analyzeEmotion = (text) => {
  const lower = text.toLowerCase();

  if (lower.includes("happy") || lower.includes("good") || lower.includes("great")) {
    return "happy";
  }
  if (lower.includes("sad") || lower.includes("unhappy") || lower.includes("down")) {
    return "sad";
  }
  if (lower.includes("angry") || lower.includes("mad") || lower.includes("furious")) {
    return "angry";
  }
  if (lower.includes("scared") || lower.includes("afraid") || lower.includes("fear")) {
    return "fear";
  }

  return "neutral";
};
