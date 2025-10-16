const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/chat", (req, res) => {
  const userMessage = req.body.message;
  console.log("المستخدم:", userMessage);

  let reply = "السيرفر الصناعي شغال بنجاح.";

  if (userMessage && userMessage.includes("كورة")) {
    reply = "دي أخبار الكورة الجديدة النهارده!";
  } else if (userMessage && userMessage.includes("استيكر")) {
    reply = "نظام الاستيكر الصناعي شغال وجاهز!";
  }

  res.json({ reply });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Sticker AI Server running at http://localhost:" + PORT);
});