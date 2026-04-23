import React, { useState, useEffect, useCallback } from 'react';
import emailjs from '@emailjs/browser';

const questions = [

  { id: 1, q: "ما هو النظام الذي ليس من أنظمة لينوكس؟", options: ["Kali", "mac", "Ubuntu"], ans: "mac" },
  { id: 2, q: "نتحكم بسيرفر vps عن طريق:", options: ["IP خاص بالسيرفر", "Filezilla"], ans: "IP خاص بالسيرفر" },
  { id: 3, q: "اسم المستخدم الأساسي في سيرفرات اللينوكس عادة ما يكون:", options: ["root", "admin", "owner"], ans: "root" },
  { id: 4, q: "في لغة بايثون، أمر تثبيت المكتبات (مثل requests) هو:", options: ["pip", "python3", "Cd"], ans: "pip" },
  { id: 5, q: "لتشغيل ملف الباك إيند (بايثون) على اللوكال المحلي، الأمر هو:", options: ["pip", "python", "mv"], ans: "python" },
  { id: 6, q: "هل نستطيع استدعاء صفحة PHP على اللوكال بإضافة اللاحقة مثل بايثون؟ مثال: http://127.0.0.1:5500/index.html", options: ["نعم", "لا"], ans: "لا" },
  { id: 7, q: "لتوجيه api خاص بنموذج ذكاء اصطناعي معين نستخدم:", options: ["system prompt", "payload", "static"], ans: "system prompt" },
  {
    id: 8,
    q: "أي مما يلي يُستخدم لتحويل JSON إلى Object في JavaScript؟",
    options: ["()JSON.parse", "()JSON.stringify", "()Object.assign", "()Object.create"],
    ans: "()JSON.parse"
  },
  {
    id: 9,
    q: "أي من المهام التالية لها الأولوية القصوى في التنفيذ داخل الـ Event Loop؟",
    options: ["setTimeout", "Promises (Microtasks)", "setInterval", "I/O Operations"],
    ans: "Promises (Microtasks)"
  },
]
const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 8 دقائق بالثواني
  const [isFinished, setIsFinished] = useState(false);

  // دالة إرسال الإيميل
  const sendResults = useCallback((finalAnswers) => {
    const templateParams = {
      to_email: 'maherjob@gmail.com', // ضع إيميلك هنا
      message: JSON.stringify(finalAnswers, null, 2),
      subject: "نتائج اختبار البرمجة الجديد"
    };
    
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => console.log('Sent!'))
      .catch((err) => console.error('Error:', err));

    setIsFinished(true);
  }, []);

  // منطق المؤقت
  useEffect(() => {
    if (timeLeft <= 0) {
      sendResults(answers);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, answers, sendResults]);

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: option });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-4 text-green-400">تم إرسال الحل بنجاح!</h1>
        <p className="text-slate-400 text-center">شكراً لك، سيتم مراجعة إجاباتك والتواصل معك قريباً.</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-10">
      <div className="max-w-3xl mx-auto bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">

        {/* Header */}
        <div className="bg-slate-800 p-6 flex justify-between items-center border-b border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-blue-400">اختبار الانضمام ل TechMind</h2>
            <p className="text-sm text-slate-400">السؤال {currentQuestion + 1} من {questions.length}</p>
          </div>
          <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 h-1.5">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Body */}
        <div className="p-8">
          <h3 className="text-2xl mb-8 leading-relaxed">
            {questions[currentQuestion].q}
          </h3>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full text-right p-4 rounded-xl border-2 transition-all duration-200 ${answers[questions[currentQuestion].id] === option
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-800'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-slate-800/50 flex justify-between items-center">
          <button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            className="px-6 py-2 rounded-lg bg-slate-700 disabled:opacity-30 hover:bg-slate-600 transition"
          >
            السابق
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={() => sendResults(answers)}
              className="px-10 py-2 rounded-lg bg-green-600 hover:bg-green-500 font-bold text-white transition shadow-lg shadow-green-900/20"
            >
              إرسال الحل النهائي
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
            >
              التالي
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizApp;