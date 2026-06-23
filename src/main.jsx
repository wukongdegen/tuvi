import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Clock3,
  CloudLightning,
  Compass,
  Heart,
  Home,
  Languages,
  Map,
  Moon,
  Orbit,
  PenLine,
  RotateCcw,
  Send,
  Sparkles,
  SunMedium,
  UserRound,
} from 'lucide-react';
import './styles.css';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);
const days = Array.from({ length: 31 }, (_, index) => index + 1);
const months = Array.from({ length: 12 }, (_, index) => index + 1);

const topicIcons = [Compass, BriefcaseBusiness, Heart, Home, Banknote, CloudLightning, Orbit, CircleHelp];

const topics = [
  { key: 'life', vi: 'Cuộc đời', en: 'Life', fil: 'Buhay', zh: '人生', ja: '人生', fr: 'Vie' },
  { key: 'career', vi: 'Sự nghiệp', en: 'Career', fil: 'Karera', zh: '事业', ja: '仕事', fr: 'Carrière' },
  { key: 'love', vi: 'Tình duyên', en: 'Love', fil: 'Pag-ibig', zh: '感情', ja: '恋愛', fr: 'Amour' },
  { key: 'family', vi: 'Gia đình', en: 'Family', fil: 'Pamilya', zh: '家庭', ja: '家族', fr: 'Famille' },
  { key: 'money', vi: 'Tiền bạc', en: 'Money', fil: 'Pera', zh: '财运', ja: 'お金', fr: 'Argent' },
  { key: 'fortune', vi: 'Vận hạn', en: 'Cycles', fil: 'Takbo ng panahon', zh: '运势', ja: '運気', fr: 'Cycles' },
  { key: 'spirit', vi: 'Tâm Linh', en: 'Spirituality', fil: 'Espiritwal', zh: '灵性', ja: '精神性', fr: 'Spiritualité' },
  { key: 'custom', vi: 'Tự hỏi', en: 'Ask', fil: 'Magtanong', zh: '提问', ja: '質問', fr: 'Question' },
];

const hourBranches = [
  { key: 'unknown', vi: 'Không rõ', en: 'Unknown', fil: 'Hindi alam', zh: '不清楚', ja: '不明', fr: 'Inconnue' },
  { key: 'earlyRat', vi: 'Tý sớm (00h - 00h59)', en: 'Early Rat (00:00 - 00:59)', fil: 'Maagang Daga (00:00 - 00:59)', zh: '早子时 (00:00 - 00:59)', ja: '早子刻 (00:00 - 00:59)', fr: 'Rat tôt (00:00 - 00:59)' },
  { key: 'ox', vi: 'Sửu (01h - 02h59)', en: 'Ox (01:00 - 02:59)', fil: 'Baka (01:00 - 02:59)', zh: '丑时 (01:00 - 02:59)', ja: '丑刻 (01:00 - 02:59)', fr: 'Buffle (01:00 - 02:59)' },
  { key: 'tiger', vi: 'Dần (03h - 04h59)', en: 'Tiger (03:00 - 04:59)', fil: 'Tigre (03:00 - 04:59)', zh: '寅时 (03:00 - 04:59)', ja: '寅刻 (03:00 - 04:59)', fr: 'Tigre (03:00 - 04:59)' },
  { key: 'rabbit', vi: 'Mão (05h - 06h59)', en: 'Rabbit (05:00 - 06:59)', fil: 'Kuneho (05:00 - 06:59)', zh: '卯时 (05:00 - 06:59)', ja: '卯刻 (05:00 - 06:59)', fr: 'Lapin (05:00 - 06:59)' },
  { key: 'dragon', vi: 'Thìn (07h - 08h59)', en: 'Dragon (07:00 - 08:59)', fil: 'Dragon (07:00 - 08:59)', zh: '辰时 (07:00 - 08:59)', ja: '辰刻 (07:00 - 08:59)', fr: 'Dragon (07:00 - 08:59)' },
  { key: 'snake', vi: 'Tỵ (09h - 10h59)', en: 'Snake (09:00 - 10:59)', fil: 'Ahas (09:00 - 10:59)', zh: '巳时 (09:00 - 10:59)', ja: '巳刻 (09:00 - 10:59)', fr: 'Serpent (09:00 - 10:59)' },
  { key: 'horse', vi: 'Ngọ (11h - 12h59)', en: 'Horse (11:00 - 12:59)', fil: 'Kabayo (11:00 - 12:59)', zh: '午时 (11:00 - 12:59)', ja: '午刻 (11:00 - 12:59)', fr: 'Cheval (11:00 - 12:59)' },
  { key: 'goat', vi: 'Mùi (13h - 14h59)', en: 'Goat (13:00 - 14:59)', fil: 'Kambing (13:00 - 14:59)', zh: '未时 (13:00 - 14:59)', ja: '未刻 (13:00 - 14:59)', fr: 'Chèvre (13:00 - 14:59)' },
  { key: 'monkey', vi: 'Thân (15h - 16h59)', en: 'Monkey (15:00 - 16:59)', fil: 'Unggoy (15:00 - 16:59)', zh: '申时 (15:00 - 16:59)', ja: '申刻 (15:00 - 16:59)', fr: 'Singe (15:00 - 16:59)' },
  { key: 'rooster', vi: 'Dậu (17h - 18h59)', en: 'Rooster (17:00 - 18:59)', fil: 'Tandang (17:00 - 18:59)', zh: '酉时 (17:00 - 18:59)', ja: '酉刻 (17:00 - 18:59)', fr: 'Coq (17:00 - 18:59)' },
  { key: 'dog', vi: 'Tuất (19h - 20h59)', en: 'Dog (19:00 - 20:59)', fil: 'Aso (19:00 - 20:59)', zh: '戌时 (19:00 - 20:59)', ja: '戌刻 (19:00 - 20:59)', fr: 'Chien (19:00 - 20:59)' },
  { key: 'pig', vi: 'Hợi (21h - 22h59)', en: 'Pig (21:00 - 22:59)', fil: 'Baboy (21:00 - 22:59)', zh: '亥时 (21:00 - 22:59)', ja: '亥刻 (21:00 - 22:59)', fr: 'Cochon (21:00 - 22:59)' },
  { key: 'lateRat', vi: 'Tý muộn (23h - 23h59)', en: 'Late Rat (23:00 - 23:59)', fil: 'Gabing Daga (23:00 - 23:59)', zh: '晚子时 (23:00 - 23:59)', ja: '遅子刻 (23:00 - 23:59)', fr: 'Rat tard (23:00 - 23:59)' },
];

const copy = {
  vi: {
    brand: 'Tử Vi', domain: '.wustudio.art', eyebrow: 'Bản đồ nhỏ cho một câu hỏi lớn',
    hero: 'Xem Tử Vi đơn giản, dịu và dễ hiểu',
    sub: 'Nhập thông tin sinh, chọn chủ đề bạn muốn xem. Gemini sẽ viết một phần luận giải ngắn theo tinh thần Tử Vi, thiên về chiêm nghiệm và hành động thực tế.',
    name: 'Họ và tên', namePlaceholder: 'Ví dụ: Nguyễn An',
    birthDate: 'Ngày sinh', day: 'Ngày', month: 'Tháng', year: 'Năm',
    calendar: 'Loại lịch', solar: 'Dương lịch', lunar: 'Âm lịch',
    birthHour: 'Giờ sinh', topic: 'Bạn muốn xem gì?', question: 'Câu hỏi', questionPlaceholder: 'Ví dụ: Năm nay mình nên tập trung vào công việc hay học thêm?',
    submit: 'Xem luận giải', loading: 'Đang đọc các dữ kiện...', result: 'Luận giải của bạn',
    demo: 'Đang dùng bản luận giải mẫu. Thêm GEMINI_API_KEY hoặc key.txt để bật Gemini 2.5 Flash.',
    again: 'Xem lại từ đầu', note: 'Nội dung chỉ dùng để chiêm nghiệm, không thay thế tư vấn y tế, pháp lý, tài chính hoặc quyết định an toàn.',
    required: 'Vui lòng nhập đủ thông tin để xem luận giải.',
  },
  en: {
    brand: 'Tu Vi', domain: '.wustudio.art', eyebrow: 'A small map for a meaningful question',
    hero: 'Simple, gentle Eastern astrology readings',
    sub: 'Enter your birth details and choose a topic. Gemini will write a short Tử Vi-inspired interpretation focused on reflection and practical next steps.',
    name: 'Full name', namePlaceholder: 'For example: An Nguyen',
    birthDate: 'Birth date', day: 'Day', month: 'Month', year: 'Year',
    calendar: 'Calendar', solar: 'Solar', lunar: 'Lunar',
    birthHour: 'Birth hour', topic: 'What would you like to read?', question: 'Question', questionPlaceholder: 'For example: Should I focus on work or study this year?',
    submit: 'Read my chart', loading: 'Reading the details...', result: 'Your reading',
    demo: 'A sample reading is shown. Add GEMINI_API_KEY or key.txt to enable Gemini 2.5 Flash.',
    again: 'Start again', note: 'For reflection only. This does not replace medical, legal, financial, or safety advice.',
    required: 'Please complete all fields before reading.',
  },
  fil: {
    brand: 'Tu Vi', domain: '.wustudio.art', eyebrow: 'Munting mapa para sa mahalagang tanong',
    hero: 'Simple at mahinahong pagbasa ng Eastern astrology',
    sub: 'Ilagay ang detalye ng kapanganakan at pumili ng paksa. Magsusulat ang Gemini ng maikling interpretasyong hango sa Tử Vi na nakatuon sa pagninilay at praktikal na hakbang.',
    name: 'Buong pangalan', namePlaceholder: 'Halimbawa: An Nguyen',
    birthDate: 'Araw ng kapanganakan', day: 'Araw', month: 'Buwan', year: 'Taon',
    calendar: 'Kalendaryo', solar: 'Solar', lunar: 'Lunar',
    birthHour: 'Oras ng kapanganakan', topic: 'Ano ang nais mong basahin?', question: 'Tanong', questionPlaceholder: 'Halimbawa: Trabaho o pag-aaral ba ang unahin ko ngayong taon?',
    submit: 'Basahin', loading: 'Binabasa ang detalye...', result: 'Iyong pagbasa',
    demo: 'Sample reading ang ipinapakita. Magdagdag ng GEMINI_API_KEY o key.txt para paganahin ang Gemini 2.5 Flash.',
    again: 'Magsimula muli', note: 'Para sa pagninilay lamang. Hindi ito kapalit ng payong medikal, legal, pinansyal, o pangkaligtasan.',
    required: 'Pakikumpleto ang lahat ng field bago basahin.',
  },
  zh: {
    brand: '紫微', domain: '.wustudio.art', eyebrow: '给重要问题的一张小地图',
    hero: '简单、温和、易懂的紫微风格解读',
    sub: '输入出生信息并选择主题，Gemini 会写一段受紫微启发的简短解读，偏向自我观察与现实行动。',
    name: '姓名', namePlaceholder: '例如：Nguyen An',
    birthDate: '出生日期', day: '日', month: '月', year: '年',
    calendar: '历法', solar: '阳历', lunar: '阴历',
    birthHour: '出生时辰', topic: '想看什么主题？', question: '问题', questionPlaceholder: '例如：今年我应该专注工作还是继续学习？',
    submit: '查看解读', loading: '正在读取信息...', result: '你的解读',
    demo: '当前显示示例解读。添加 GEMINI_API_KEY 或 key.txt 可启用 Gemini 2.5 Flash。',
    again: '重新开始', note: '内容仅供自我观察，不替代医疗、法律、财务或安全建议。',
    required: '请填写完整信息后再查看解读。',
  },
  ja: {
    brand: '紫微', domain: '.wustudio.art', eyebrow: '大切な問いのための小さな地図',
    hero: 'やさしく読める紫微風の鑑定',
    sub: '生年月日を入力し、テーマを選ぶと、Gemini が紫微風の短い解釈を作成します。内省と現実的な一歩を大切にします。',
    name: '氏名', namePlaceholder: '例: Nguyen An',
    birthDate: '生年月日', day: '日', month: '月', year: '年',
    calendar: '暦', solar: '太陽暦', lunar: '旧暦',
    birthHour: '出生時刻', topic: '見たいテーマ', question: '質問', questionPlaceholder: '例: 今年は仕事と勉強のどちらに集中すべきですか？',
    submit: '鑑定を見る', loading: '情報を読み取っています...', result: 'あなたの鑑定',
    demo: 'サンプル鑑定を表示中です。Gemini 2.5 Flash を使うには GEMINI_API_KEY または key.txt を追加してください。',
    again: '最初から', note: '内省のための内容です。医療、法律、財務、安全に関する専門的助言の代わりにはなりません。',
    required: '鑑定前にすべての項目を入力してください。',
  },
  fr: {
    brand: 'Tu Vi', domain: '.wustudio.art', eyebrow: 'Une petite carte pour une question importante',
    hero: 'Lecture astrologique orientale simple et douce',
    sub: 'Entrez vos informations de naissance et choisissez un thème. Gemini rédigera une courte interprétation inspirée du Tử Vi, orientée vers la réflexion et l’action concrète.',
    name: 'Nom complet', namePlaceholder: 'Exemple : An Nguyen',
    birthDate: 'Date de naissance', day: 'Jour', month: 'Mois', year: 'Année',
    calendar: 'Calendrier', solar: 'Solaire', lunar: 'Lunaire',
    birthHour: 'Heure de naissance', topic: 'Quel thème lire ?', question: 'Question', questionPlaceholder: 'Exemple : Devrais-je me concentrer sur le travail ou les études cette année ?',
    submit: 'Voir la lecture', loading: 'Lecture des détails...', result: 'Votre lecture',
    demo: 'Une lecture d’exemple est affichée. Ajoutez GEMINI_API_KEY ou key.txt pour activer Gemini 2.5 Flash.',
    again: 'Recommencer', note: 'Pour réflexion uniquement. Ne remplace pas un avis médical, juridique, financier ou de sécurité.',
    required: 'Veuillez compléter tous les champs avant la lecture.',
  },
};

function App() {
  const [lang, setLang] = useState(localStorage.getItem('tu-vi-lang') || 'vi');
  const [form, setForm] = useState({
    fullName: '',
    day: '',
    month: '',
    year: '',
    calendarType: 'solar',
    birthHour: 'unknown',
    topic: 'life',
    question: '',
  });
  const [reading, setReading] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [picker, setPicker] = useState(null);
  const t = copy[lang];

  useEffect(() => {
    localStorage.setItem('tu-vi-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const selectedHour = useMemo(() => hourBranches.find(hour => hour.key === form.birthHour) || hourBranches[0], [form.birthHour]);
  const selectedTopic = useMemo(() => topics.find(topic => topic.key === form.topic) || topics[0], [form.topic]);
  const isCustomQuestion = form.topic === 'custom';
  const canSubmit = form.fullName.trim() && form.day && form.month && form.year && form.birthHour && (!isCustomQuestion || form.question.trim());

  function updateField(field, value) {
    setForm(current => ({ ...current, [field]: value }));
    setError('');
  }

  function openPicker(field, label, options) {
    setPicker({ field, label, options });
  }

  function choosePickerValue(value) {
    if (!picker) return;
    updateField(picker.field, String(value));
    setPicker(null);
  }

  function selectTopic(topicKey) {
    setForm(current => ({ ...current, topic: topicKey, question: topicKey === 'custom' ? current.question : '' }));
    setError('');
  }

  async function submit(event) {
    event.preventDefault();
    if (!canSubmit) {
      setError(t.required);
      return;
    }
    setIsLoading(true);
    setReading('');
    setIsDemo(false);
    try {
      const response = await fetch('/api/tu-vi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          topic: selectedTopic[lang],
          question: isCustomQuestion ? form.question : selectedTopic[lang],
          calendarType: form.calendarType === 'solar' ? t.solar : t.lunar,
          birthHour: selectedHour[lang],
          lang,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');
      setReading(data.reading);
      setIsDemo(Boolean(data.demo));
      window.requestAnimationFrame(() => document.querySelector('.result-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch {
      setReading(copy[lang].demo);
      setIsDemo(true);
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setReading('');
    setIsDemo(false);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={reset}>
          <span className="brand-mark"><Sparkles size={17} /></span>
          <span>{t.brand}<small>{t.domain}</small></span>
        </button>
        <label className="language">
          <Languages size={17} />
          <select value={lang} onChange={event => setLang(event.target.value)} aria-label="Language">
            <option value="vi">VI</option>
            <option value="en">EN</option>
            <option value="fil">FIL</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="fr">FR</option>
          </select>
          <ChevronDown size={14} />
        </label>
      </header>

      <section className="shell">
        <div className="hero-copy">
          <p className="eyebrow"><Map size={15} />{t.eyebrow}</p>
          <h1>{t.hero}</h1>
          <p className="lead">{t.sub}</p>
        </div>

        <div className="hero-art">
          <img src="/images/tu-vi-map.png" alt="Isometric Tử Vi chart and travel-map inspired study" />
        </div>

        <form className="reading-form" onSubmit={submit}>
          <label className="field wide">
            <span><UserRound size={16} />{t.name}</span>
            <input value={form.fullName} onChange={event => updateField('fullName', event.target.value)} placeholder={t.namePlaceholder} maxLength={80} autoComplete="name" />
          </label>

          <fieldset className="date-group">
            <legend><CalendarDays size={16} />{t.birthDate}</legend>
            <div className="date-grid">
              <div className="date-field">
                <span>{t.day}</span>
                <button type="button" className="date-select-button" onClick={() => openPicker('day', t.day, days)}>
                  <span>{form.day || t.day}</span>
                  <ChevronDown size={15} />
                </button>
              </div>
              <div className="date-field">
                <span>{t.month}</span>
                <button type="button" className="date-select-button" onClick={() => openPicker('month', t.month, months)}>
                  <span>{form.month || t.month}</span>
                  <ChevronDown size={15} />
                </button>
              </div>
              <div className="date-field">
                <span>{t.year}</span>
                <button type="button" className="date-select-button" onClick={() => openPicker('year', t.year, years)}>
                  <span>{form.year || t.year}</span>
                  <ChevronDown size={15} />
                </button>
              </div>
            </div>
          </fieldset>

          <fieldset className="calendar-toggle">
            <legend>{t.calendar}</legend>
            <div>
              <button type="button" className={form.calendarType === 'solar' ? 'selected' : ''} onClick={() => updateField('calendarType', 'solar')}><SunMedium size={18} />{t.solar}</button>
              <button type="button" className={form.calendarType === 'lunar' ? 'selected' : ''} onClick={() => updateField('calendarType', 'lunar')}><Moon size={18} />{t.lunar}</button>
            </div>
          </fieldset>

          <label className="field wide">
            <span><Clock3 size={16} />{t.birthHour}</span>
            <select value={form.birthHour} onChange={event => updateField('birthHour', event.target.value)}>
              {hourBranches.map(hour => <option key={hour.key} value={hour.key}>{hour[lang]}</option>)}
            </select>
          </label>

          <fieldset>
            <legend className="topic-label"><Sparkles size={16} />{t.topic}</legend>
            <div className="topic-row">
              {topics.map((topic, index) => {
                const Icon = topicIcons[index];
                return (
                  <button type="button" key={topic.key} onClick={() => selectTopic(topic.key)} className={form.topic === topic.key ? 'selected' : ''}>
                    <Icon size={20} />
                    <span>{topic[lang]}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {isCustomQuestion && (
            <label className="field wide question">
              <span><PenLine size={16} />{t.question}</span>
              <textarea value={form.question} onChange={event => updateField('question', event.target.value)} placeholder={t.questionPlaceholder} maxLength={360} />
              <small>{form.question.length}/360</small>
            </label>
          )}

          {error && <p className="form-error">{error}</p>}
          <button className="primary" disabled={isLoading} type="submit">
            {isLoading ? <Sparkles className="spin" size={18} /> : <Send size={18} />}
            {isLoading ? t.loading : t.submit}
          </button>
        </form>

        {(reading || isLoading) && (
          <article className="result-panel">
            <p className="eyebrow"><Sparkles size={15} />{t.result}</p>
            <div className="summary-strip">
              <span>{form.day}/{form.month}/{form.year}</span>
              <span>{form.calendarType === 'solar' ? t.solar : t.lunar}</span>
              <span>{selectedHour[lang]}</span>
              <span>{selectedTopic[lang]}</span>
            </div>
            {isLoading ? <div className="loading"><Sparkles className="spin" />{t.loading}</div> : <div className="reading-text">{reading}</div>}
            {isDemo && !isLoading && <p className="demo">{t.demo}</p>}
            {!isLoading && <button className="secondary" onClick={reset}><RotateCcw size={17} />{t.again}</button>}
          </article>
        )}
      </section>

      <footer>
        <span>{t.brand}{t.domain}</span>
        <p>{t.note}</p>
      </footer>

      {picker && (
        <div className="picker-overlay" role="presentation" onClick={() => setPicker(null)}>
          <section className="picker-sheet" role="dialog" aria-modal="true" aria-label={picker.label} onClick={event => event.stopPropagation()}>
            <div className="picker-head">
              <strong>{picker.label}</strong>
              <button type="button" onClick={() => setPicker(null)} aria-label="Close">×</button>
            </div>
            <div className={`picker-options ${picker.field === 'year' ? 'year-options' : ''}`}>
              {picker.options.map(option => {
                const value = String(option);
                const selected = form[picker.field] === value;
                return (
                  <button type="button" key={value} className={selected ? 'selected' : ''} onClick={() => choosePickerValue(value)}>
                    {value}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
