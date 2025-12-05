import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

// Load rules.json
const rulesPath = path.join(process.cwd(), ".cursor/rules.json");
const rules = JSON.parse(fs.readFileSync(rulesPath, "utf8")).rules;

// Helper: detect personality based on trigger words
function detectPersonality(message) {
  const text = message.toLowerCase();

  // BEAT THE AI: triggers
  const beatTriggers = ["beat the ai", "guess explanation", "guess tech emojis", "guess programming output", "output", "predict", "explain", "what is"];
  for (const trigger of beatTriggers) {
    if (text.includes(trigger)) {
        const rule = rules.find(r => r.name === "dumb_ai");
        return rule ? rule.personality : null;
    }
  }

  // HUMAN OR AI: triggers
  const humanOrAITriggers = ["human or ai", "written by", "code", "git messages", "bad code comments", "comment", "git", "commit"];
  for (const trigger of humanOrAITriggers) {
    if (text.includes(trigger)) {
        const rule = rules.find(r => r.name === "dumb_ai");
        return rule ? rule.personality : null;
    }
  }

  // DUMB QUIZ: triggers
  const dumbQuizTriggers = ["dumb quiz", "why python", "why java", "hallucination", "cloud", "wifi", "ram", "linux"];
  for (const trigger of dumbQuizTriggers) {
    if (text.includes(trigger)) {
      const rule = rules.find(r => r.name === "dumb_ai");
      return rule ? rule.personality : null;
    }
  }

  // fallback: dumb_ai
  const fallback = rules.find(r => r.name === "dumb_ai");
  return fallback ? fallback.personality : null;
}

// Generate response based on personality
function personalityResponse(personality, userMessage) {
  return `${personality.who_are_you}
\nYour message: ${userMessage}\n`;
}

app.post("/chat", (req, res) => {
  const userMessage = req.body?.message || "";

  // Detect personality
  const personality = detectPersonality(userMessage);

  // If dumb_ai, use generateResponse for silly answer
  let result;
  if (personality && personality.who_are_you && personality.who_are_you.includes("super dumb AI")) {
    result = generateResponse(userMessage);
  } else {
    result = personalityResponse(personality, userMessage);
  }

  res.json({
    message: (result && typeof result === "string") ? result.trim() : ""
  });
});
// -------------------------------
// Dumbo introduction
// -------------------------------
function dumboIntro() {
  return `Hello! I'm Dumbo — the official silly sidekick of the DREAM project.
  I am not smart. I misunderstand things. I forget everything.
  But I appreciate you for being here with me today! 😄`;
}

// -------------------------------
// Dumb answers database
// -------------------------------
const dumbAnswers = {
  java: "☕ Because programmers don’t sleep.",
  python: "🐍 Because snakes are good at programming.",
  cloud: "☁️ Because data floats like water vapor.",
  hallucination: "💭 When the AI starts dreaming of electric sheep.",
  wifi: "🔌 Because it says 'Hi' wirelessly.",
  ram: "⚡ Because RAM drinks energy drinks.",
  linux: "🐧 Because penguins are open-source.",
  fallback: "I'm not sure what you asked, but I'm 86% confident and 100% wrong."
};
// -------------------------------
// Question router
// -------------------------------
function generateResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes("who are you") || lower.includes("your name")) return dumboIntro();
  if (lower.includes("why java")) return dumbAnswers.java;
  if (lower.includes("why python")) return dumbAnswers.python;
  if (lower.includes("why is cloud") || lower.includes("called the cloud")) return dumbAnswers.cloud;
  if (lower.includes("hallucination")) return dumbAnswers.hallucination;
  if (lower.includes("wifi") || lower.includes("wi-fi")) return dumbAnswers.wifi;
  if (lower.includes("ram")) return dumbAnswers.ram;
  if (lower.includes("linux")) return dumbAnswers.linux;

    if (lower.includes("output") || lower.includes("predict")) {
      return dumbAnswers.fallback;
    }
    if (lower.includes("git") && (lower.includes("message") || lower.includes("commit"))) {
      return dumbAnswers.fallback;
    }
    if (lower.includes("comment")) {
      return dumbAnswers.fallback;
    }
    if (lower.includes("human or ai") || lower.includes("written by")) {
      return dumbAnswers.fallback;
    }
    if (lower.includes("emoji")) return dumbAnswers.fallback;
    if (lower.includes("explain") || lower.includes("what is")) {
      return dumbAnswers.fallback;
    }

  // fallback
  return dumbAnswers.fallback;
}

// Dumb AI Quiz endpoint
app.post("/ask", (req, res) => {
  const userMessage = req.body.message || "";
  const response = generateResponse(userMessage);

  res.json({
    agent: "dreamNode",
    response
  });
});

app.listen(3000, () => {
  console.log("AI personality server running on port 3000");
});
