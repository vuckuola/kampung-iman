# Kampung Iman — Islamic Learning Content Summary

This pack contains child-friendly learning content grounded in Qur'an references and widely known sahih hadith reports. It is written for gentle quiz gameplay and parent/teacher review.

## Source policy

- Qur'an references are cited by surah:ayah only, with simple paraphrase in child-facing copy.
- Hadith references use well-known sahih reports from Sahih al-Bukhari and/or Sahih Muslim.
- No fiqh rulings, sectarian details, unseen depictions, or sacred-person imagery are included.
- Parent-facing UI should show the source line attached to each quiz or collectible.

## Included content

- 12 multiple-choice quiz questions in `content/islamic-learning-content.json`
- 6 collectible lesson snippets in `content/islamic-learning-content.json`
- 3 visual zone themes in `docs/art-direction.md`

## Quick integration notes

- Load `quizQuestions` for quiz stations, source cards, and parent dashboard review.
- Load `collectibleLessons` for pickup rewards and journal entries.
- Keep the `source` string visible in parent/teacher review and optionally hidden behind a small info icon in child mode.
- Use gentle feedback only: no shaming, no scary failure audio, no competitive religious scoring.

## Recommended source drawer labels

- Qur'an 2:83 — speak good to people
- Qur'an 17:23 — kindness to parents
- Qur'an 20:114 — "My Lord, increase me in knowledge"
- Qur'an 49:11 — do not ridicule or insult one another
- Qur'an 49:13 — know one another
- Qur'an 94:5-6 — with hardship comes ease
- Qur'an 103:1-3 — faith, good deeds, truth, patience
- Sahih al-Bukhari and Sahih Muslim — love for others what you love for yourself
- Sahih al-Bukhari and Sahih Muslim — removing harm from the road is charity
- Sahih al-Bukhari and Sahih Muslim — a good word is charity
- Sahih al-Bukhari and Sahih Muslim — speak good or remain silent
- Sahih al-Bukhari and Sahih Muslim — Allah shows mercy to those who show mercy to people
