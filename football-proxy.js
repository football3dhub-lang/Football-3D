const axios = require('axios');

exports.handler = async function(event, context) {
    // استخراج المسار المطلوب من الرابط، مثال: /fixtures/headtohead
    // event.path سيكون شيئاً مثل: /.netlify/functions/football-proxy/fixtures/headtohead
    // نحن نريد فقط الجزء الأخير
    const apiPath = event.path.replace('/.netlify/functions/football-proxy/', '');

    // استخراج متغيرات الاستعلام (query parameters)
    const queryParams = event.queryStringParameters;

    const API_FOOTBALL_HOST = 'v3.football.api-sports.io';
    const API_KEY = process.env.API_FOOTBALL_KEY; // جلب المفتاح من متغيرات البيئة في Netlify

    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'مفتاح الـ API غير معرف على الخادم.' })
        };
    }

    const options = {
        method: 'GET',
        url: `https://${API_FOOTBALL_HOST}/${apiPath}`,
        params: queryParams,
        headers: {
            'x-rapidapi-host': API_FOOTBALL_HOST,
            'x-rapidapi-key': API_KEY
        }
    };

    try {
        const response = await axios.request(options);
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error('API proxy error:', error.response ? error.response.data : error.message);
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ message: 'حدث خطأ أثناء جلب البيانات من football API.' })
        };
    }
};