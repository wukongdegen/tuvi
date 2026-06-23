import 'dotenv/config';
import express from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const app = express();
app.use(express.json({ limit: '50kb' }));

const languageNames = {
    vi: 'Vietnamese',
    en: 'English',
    fil: 'Filipino (Tagalog)',
    zh: 'Simplified Chinese',
    ja: 'Japanese',
    fr: 'French',
};

const keyFilePath = resolve(process.cwd(), 'key.txt');

function getGeminiKeys() {
    try {
        return readFileSync(keyFilePath, 'utf8')
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'));
    } catch {
        return process.env.GEMINI_API_KEY ? [process.env.GEMINI_API_KEY] : [];
    }
}

function getShuffledGeminiKeys() {
    return getGeminiKeys().sort(() => Math.random() - 0.5);
}

function cleanText(value, maxLength = 240) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function fallback(lang) {
    if (lang === 'en') return 'This sample reading treats your birth details as a reflective map rather than a fixed verdict. Start with the area you asked about, then notice which pattern feels repeated: where you seek stability, where you react too quickly, and where a patient choice could give you more room. In the next 24 hours, choose one small action that restores clarity before making a larger decision.';
    if (lang === 'fil') return 'Ginagamit ng halimbawang pagbasa ang iyong detalye ng kapanganakan bilang mapa ng pagninilay, hindi bilang tiyak na hatol. Tingnan muna ang tanong mo, pagkatapos pansinin kung anong ugali ang paulit-ulit: saan mo hinahanap ang katatagan, saan ka mabilis tumugon, at saan makatutulong ang mas mahinahong pagpili. Sa loob ng 24 oras, gumawa ng isang maliit na hakbang na magpapalinaw bago ang mas malaking desisyon.';
    if (lang === 'zh') return '这是一段示例解读，会把出生信息视为一种自我观察的地图，而不是固定命运。先回到你的问题，再观察哪些模式反复出现：哪里需要稳定，哪里反应过快，哪里适合慢一点再决定。接下来的二十四小时，先做一个能让事情更清楚的小行动。';
    if (lang === 'ja') return 'これはサンプル鑑定です。生年月日を決めつけの運命ではなく、自分を見つめる地図として扱います。まず質問の焦点に戻り、安定を求めている場所、反応が早すぎる場所、少し待つことで余白が生まれる場所を見てください。次の24時間は、大きな決断の前に状況を明確にする小さな行動を一つ選びましょう。';
    if (lang === 'fr') return 'Cette lecture d’exemple considère vos informations de naissance comme une carte de réflexion, pas comme un verdict. Revenez à votre question, puis observez le motif qui se répète: où vous cherchez de la stabilité, où vous réagissez trop vite, et où une décision plus patiente pourrait ouvrir de l’espace. Dans les prochaines 24 heures, choisissez une petite action qui clarifie la situation avant toute décision plus large.';
    return 'Bản luận giải mẫu này xem thông tin sinh của bạn như một tấm bản đồ chiêm nghiệm, không phải kết luận cố định. Hãy bắt đầu từ câu hỏi bạn nêu, rồi để ý mô thức nào đang lặp lại: nơi bạn cần sự ổn định, nơi bạn phản ứng hơi nhanh, và nơi một lựa chọn chậm rãi hơn có thể mở thêm khoảng thở. Trong 24 giờ tới, hãy chọn một hành động nhỏ giúp mọi thứ rõ hơn trước khi đưa ra quyết định lớn.';
}

app.post('/api/tu-vi', async (req, res) => {
    const { lang = 'vi', fullName, day, month, year, calendarType, birthHour, topic, question } = req.body || {};
    const profile = {
        fullName: cleanText(fullName, 80),
        day: Number(day),
        month: Number(month),
        year: Number(year),
        calendarType: cleanText(calendarType, 20),
        birthHour: cleanText(birthHour, 80),
        topic: cleanText(topic, 80),
        question: cleanText(question || topic, 360),
    };

    const currentYear = new Date().getFullYear();
    if (!profile.fullName || !profile.day || !profile.month || !profile.year || !profile.birthHour || !profile.question) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (profile.day < 1 || profile.day > 31 || profile.month < 1 || profile.month > 12 || profile.year < 1900 || profile.year > currentYear) {
        return res.status(400).json({ error: 'Invalid birth date' });
    }

    const geminiApiKeys = getShuffledGeminiKeys();
    if (!geminiApiKeys.length) return res.json({ reading: fallback(lang), demo: true });

    const prompt = `USER PROFILE
Name: ${profile.fullName}
Birth date: ${profile.day}/${profile.month}/${profile.year}
Calendar type supplied by user: ${profile.calendarType}
Birth hour branch supplied by user: ${profile.birthHour}
Selected topic: ${profile.topic || 'General'}
User question: ${profile.question}

Write a simple Tử Vi / Eastern astrology style reading in ${languageNames[lang] || 'Vietnamese'} only.

CONTENT RULES
- This app does not calculate a full professional Tử Vi chart. Be transparent by framing the answer as a gentle AI interpretation based on the supplied birth date, calendar type, birth hour, name, selected topic, and question.
- Start directly with the answer. Do not greet, do not repeat all input fields, and do not use Markdown.
- Mention 2-3 relevant tendencies through a Tử Vi lens, such as temperament, timing, relationships, work direction, decision style, or emotional pattern. Keep it simple and accessible.
- Connect the reading to the selected topic or user's exact question with concrete, practical advice.
- Avoid deterministic fate claims. Do not promise marriage, wealth, illness, death, pregnancy, legal outcomes, lottery/gambling results, investment returns, or safety predictions.
- If the question asks for medical, legal, financial, crisis, or safety certainty, respond cautiously and recommend qualified professional help where appropriate.
- End with one realistic action the user can take in the next 24 hours.
- 180-300 words. Use 2-4 short paragraphs. Plain text only, no labels, bullets, tables, or headings.
- Tone: calm, refined, warm, psychologically grounded, lightly mystical without filler.`;

    let lastError;
    for (const geminiApiKey of geminiApiKeys) {
        try {
            async function generate(maxOutputTokens) {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [{
                                text: 'You are a careful multilingual Tử Vi and Eastern astrology-style interpreter. You provide reflective, practical readings without claiming certainty or replacing professional advice.',
                            }],
                        },
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.66,
                            topP: 0.9,
                            maxOutputTokens,
                            thinkingConfig: { thinkingBudget: 0 },
                        },
                    }),
                });
                if (!response.ok) throw new Error(`Gemini ${response.status}: ${(await response.text()).slice(0, 300)}`);
                return response.json();
            }

            let data = await generate(1500);
            if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') data = await generate(2300);
            const candidate = data.candidates?.[0];
            if (candidate?.finishReason === 'MAX_TOKENS') throw new Error('Gemini response remained truncated after retry');
            const reading = candidate?.content?.parts?.map(part => part.text || '').join('').trim();
            if (!reading) throw new Error('Empty Gemini response');
            return res.json({ reading, demo: false });
        } catch (error) {
            lastError = error;
            console.error(error.message);
        }
    }

    console.error(lastError?.message || 'Gemini unavailable');
    res.json({ reading: fallback(lang), demo: true });
});

app.listen(process.env.PORT || 8788, () => {
    console.log(`Tu Vi API on http://localhost:${process.env.PORT || 8788}`);
});
