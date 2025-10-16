const express = require("express");
const app = express();

// علشان الـ API يفهم JSON
app.use(express.json());

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.json({ message: "🎉 Football API يعمل بنجاح!" });
});

// مثال على endpoint فيه ID
app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  res.json({ user_id: id, name: "Ahmed", status: "active" });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⚽ Football API running on port ${PORT}`));
