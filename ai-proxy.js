const axios = require('axios');

exports.handler = async function(event, context) {
    // التأكد من أن الطلب هو POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_STUDIO_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_API_KEY}`;

    if (!GOOGLE_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'مفتاح Google API غير معرف على الخادم.' })
        };
    }

    try {
        const { history, message } = JSON.parse(event.body);

        // تحويل سجل المحادثة إلى التنسيق المطلوب من Google
        const contents = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts[0].text }]
        }));
        // إضافة الرسالة الجديدة
        contents.push({ role: 'user', parts: [{ text: message }] });

        const response = await axios.post(API_URL, { contents });

        // التحقق من وجود محتوى في الرد
        const aiResponseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من إنشاء رد. حاول مرة أخرى.";

        return {
            statusCode: 200,
            body: JSON.stringify({ text: aiResponseText })
        };

    } catch (error) {
        console.error('AI proxy error:', error.response ? error.response.data : error.message);
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ message: 'حدث خطأ أثناء جلب البيانات من Google AI API.' })
        };
    }
};
const axios = require('axios');

exports.handler = async function(event, context) {
    // التأكد من أن الطلب هو POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_STUDIO_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_API_KEY}`;

    if (!GOOGLE_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'مفتاح Google API غير معرف على الخادم.' })
        };
    }

    try {
        const { history, message } = JSON.parse(event.body);

        // تحويل سجل المحادثة إلى التنسيق المطلوب من Google
        const contents = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts[0].text }]
        }));
        // إضافة الرسالة الجديدة
        contents.push({ role: 'user', parts: [{ text: message }] });

        const response = await axios.post(API_URL, { contents });

        // التحقق من وجود محتوى في الرد
        const aiResponseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من إنشاء رد. حاول مرة أخرى.";

        return {
            statusCode: 200,
            body: JSON.stringify({ text: aiResponseText })
        };

    } catch (error) {
        console.error('AI proxy error:', error.response ? error.response.data : error.message);
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ message: 'حدث خطأ أثناء جلب البيانات من Google AI API.' })
        };
    }
};