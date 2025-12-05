import express from "express";

const app = express();
app.use(express.json());

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
  programming_output: [
    "42 — because that's always safe.",
    "None — like my life decisions.",
    "It prints nothing. The code gave up.",
    "RuntimeError: Programmer's brain not found."
  ],
  git_message: [
    "git commit -m 'Fixed the thing by removing the thing that broke the other thing'",
    "git commit -m 'It works on my machine 😎'",
    "git commit -m 'Temporary fix. (Lies)'",
    "git commit -m 'Who wrote this? Oh… me. Oops.'"
  ],
  bad_comment: [
    "// TODO: Fix this before someone sees it",
    "// Magic happens here. Don’t touch.",
    "// I don’t know why this works but it does.",
    "// Please don't ask.",
    "// If this breaks again I'm quitting."
  ],
  human_or_ai: [
    "🤖 AI — it has that *confident nonsense* energy.",
    "🧑 Human — too many feelings, not enough accuracy.",
    "🤷 Could be both. Humans hallucinate too."
  ],
  emoji: "🤓🦾💻 — clearly that means 'Developer on caffeine deploying at 3 AM'",
  beat_ai: [
    "It's a framework… probably. Most things are frameworks.",
    "It's when the computer thinks really hard and hopes for the best.",
    "It's a protocol for sending sadness over the internet.",
    "It's an algorithm that solves problems by ignoring half of them."
  ],
  fallback: "I'm not sure what you asked, but I'm 86% confident and 100% wrong."
};

// -------------------------------
// Question router
// -------------------------------
function generateDumbResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes("who are you") || lower.includes("your name")) return dumboIntro();
  if (lower.includes("why java")) return dumbAnswers.java;
  if (lower.includes("why python")) return dumbAnswers.python;
  if (lower.includes("why is cloud") || lower.includes("called the cloud")) return dumbAnswers.cloud;
  if (lower.includes("hallucination")) return dumbAnswers.hallucination;
  if (lower.includes("wifi")) return dumbAnswers.wifi;
  if (lower.includes("ram")) return dumbAnswers.ram;
  if (lower.includes("linux")) return dumbAnswers.linux;

  if (lower.includes("output") || lower.includes("predict")) {
    const arr = dumbAnswers.programming_output;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.includes("git") && (lower.includes("message") || lower.includes("commit"))) {
    const arr = dumbAnswers.git_message;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.includes("comment")) {
    const arr = dumbAnswers.bad_comment;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.includes("human or ai") || lower.includes("written by")) {
    const arr = dumbAnswers.human_or_ai;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.includes("emoji")) return dumbAnswers.emoji;
  if (lower.includes("explain") || lower.includes("what is")) {
    const arr = dumbAnswers.beat_ai;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // fallback
  return dumbAnswers.fallback;
}

// -------------------------------
// Express endpoints
// -------------------------------
app.post("/ask", (req, res) => {
  const userMessage = req.body.message || "";
  const response = generateDumbResponse(userMessage);

  res.json({
    agent: "dreamNode",
    response
  });
});

app.get("/", (req, res) => {
  res.send("dreamNode is running — but not thinking.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`dreamNode running on port ${PORT}`);
});
