export type ZoneId = 'adab' | 'ilmu' | 'sadaqah'
export type Quiz = { question: string; choices: string[]; answer: number; explanation: string; source: string }
export const quizzes: Record<ZoneId, Quiz[]> = {
  adab: [
    {"question": "A friend feels sad. What is a beautiful way to speak?", "choices": ["Use kind words and comfort them", "Laugh at them", "Ignore them", "Say something mean"], "answer": 0, "explanation": "Wonderful. The Qur'an teaches us to speak good words to people. Source: Qur'an 2:83 — speak good to people", "source": "Qur'an 2:83 — speak good to people"},
    {"question": "How should we treat our parents or caregivers?", "choices": ["With kindness and respect", "Only when we want a treat", "By shouting", "By refusing every request"], "answer": 0, "explanation": "Yes. The Qur'an teaches excellent kindness to parents. Source: Qur'an 17:23 — kindness to parents", "source": "Qur'an 17:23 — kindness to parents"},
    {"question": "You see a banana peel on the walkway. What can be a charity?", "choices": ["Move it safely so no one slips", "Step over it and leave it", "Put more peels there", "Hide it under a rug"], "answer": 0, "explanation": "Excellent. Removing harm from the road is a charity. Source: Sahih al-Bukhari and Sahih Muslim — removing harmful things from the road is charity", "source": "Sahih al-Bukhari and Sahih Muslim — removing harmful things from the road is charity"},
  ],
  ilmu: [
    {"question": "What short du'a asks Allah for more knowledge?", "choices": ["Rabbi zidni 'ilma", "I know everything already", "No more learning today", "Only games, never books"], "answer": 0, "explanation": "Beautiful. It means: My Lord, increase me in knowledge. Source: Qur'an 20:114 — My Lord, increase me in knowledge", "source": "Qur'an 20:114 — My Lord, increase me in knowledge"},
    {"question": "Surah Al-'Asr reminds us that time is precious. What should we fill it with?", "choices": ["Faith, good deeds, truth, and patience", "Only wasting time", "Teasing others", "Breaking promises"], "answer": 0, "explanation": "Yes. Time is a gift, so we use it for good. Source: Qur'an 103:1-3 — Surah Al-'Asr", "source": "Qur'an 103:1-3 — Surah Al-'Asr"},
    {"question": "What does the Qur'an teach about making fun of people?", "choices": ["Do not mock or insult others", "Mock people if others laugh", "Give mean nicknames", "Only be kind to best friends"], "answer": 0, "explanation": "Correct. Respect keeps the community safe and happy. Source: Qur'an 49:11 — do not ridicule or insult one another", "source": "Qur'an 49:11 — do not ridicule or insult one another"},
    {"question": "People are different nations and tribes so that we may...", "choices": ["Know one another", "Feel proud over others", "Refuse to meet anyone", "Argue about colors"], "answer": 0, "explanation": "Yes. Our differences are a sign to learn and show respect. Source: Qur'an 49:13 — made into nations and tribes so you may know one another", "source": "Qur'an 49:13 — made into nations and tribes so you may know one another"},
    {"question": "If you are not sure your words are helpful, what is a safe choice?", "choices": ["Speak good or stay silent", "Say the first thing in your mind", "Shout louder", "Spread rumors"], "answer": 0, "explanation": "Wise choice. Good speech or silence protects everyone. Source: Sahih al-Bukhari and Sahih Muslim — speak good or remain silent", "source": "Sahih al-Bukhari and Sahih Muslim — speak good or remain silent"},
    {"question": "How should we treat people and animals in Allah's creation?", "choices": ["With mercy and care", "With roughness", "Only if someone is watching", "By scaring them"], "answer": 0, "explanation": "Yes. Mercy is a beautiful Islamic character. Source: Sahih al-Bukhari and Sahih Muslim — Allah shows mercy to those who show mercy to people", "source": "Sahih al-Bukhari and Sahih Muslim — Allah shows mercy to those who show mercy to people"},
    {"question": "When something feels hard, what hopeful lesson does Surah Ash-Sharh teach?", "choices": ["With hardship comes ease", "Give up right away", "No one should help", "Hard days last forever"], "answer": 0, "explanation": "Alhamdulillah. Allah reminds us that ease comes with hardship. Source: Qur'an 94:5-6 — with hardship comes ease", "source": "Qur'an 94:5-6 — with hardship comes ease"},
  ],
  sadaqah: [
    {"question": "What should you love for others?", "choices": ["The good things you love for yourself", "Only toys for yourself", "Being first every time", "Making others lose"], "answer": 0, "explanation": "Great. A believer loves good for others too. Source: Sahih al-Bukhari and Sahih Muslim — love for your brother what you love for yourself", "source": "Sahih al-Bukhari and Sahih Muslim — love for your brother what you love for yourself"},
    {"question": "A good word can be counted as what?", "choices": ["Charity", "A race", "A secret code", "A mistake"], "answer": 0, "explanation": "Yes. A gentle good word can be charity. Source: Sahih al-Bukhari and Sahih Muslim — a good word is charity", "source": "Sahih al-Bukhari and Sahih Muslim — a good word is charity"},
  ],
}

export const zoneLessons: Record<ZoneId, string> = {
  adab: "Practice beautiful manners with gentle words and respect.",
  ilmu: "Kind words light up the village. (Qur'an 2:83; Sahih al-Bukhari and Sahih Muslim — speak good or remain silent) A little star of learning joins your journal. (Qur'an 20:114) Plant mercy and watch kindness grow. (Sahih al-Bukhari and Sahih Muslim — mercy shown ",
  sadaqah: "Give and help sincerely.",
}
