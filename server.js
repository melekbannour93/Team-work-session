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

  for (const rule of rules) {
    if (!rule.triggers) continue;

    for (const trigger of rule.triggers) {
      if (text.includes(trigger.toLowerCase())) {
        return rule.personality;
      }
    }
  }

  // fallback = default_ai
  return rules.find(r => r.name === "default_ai").personality;
}

// Generate response based on personality
function personalityResponse(personality, userMessage) {
  return `
${personality.who_are_you}

Your message: ${userMessage}
`;
}

app.post("/chat", (req, res) => {
  const userMessage = req.body?.message || "";

  // Detect personality
  const personality = detectPersonality(userMessage);

  // Generate response body
  const result = personalityResponse(personality, userMessage);

  res.json({
    message: result.trim()
  });
});

app.listen(3000, () => {
  console.log("AI personality server running on port 3000");
});
