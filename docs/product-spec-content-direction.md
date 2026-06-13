# Kampung Iman WebGL — Product Spec & Content Direction

## 1. Ringkasan Produk
**Kampung Iman WebGL** adalah game browser Three.js/WebGL bergaya playful driving-exploration, terinspirasi oleh pengalaman interaktif seperti bruno-simon.com: pemain mengendarai kendaraan kecil di dunia 3D low-poly, menabrak/menjelajah objek interaktif, membuka mini-aktivitas, dan mengumpulkan progres belajar. Tema utama: pendidikan Islam untuk anak dan keluarga dengan pendekatan aman, ramah, autentik, dan menyenangkan.

**Target pemain:** anak usia 6–12 tahun bersama orang tua/guru.  
**Platform:** desktop dan mobile browser modern.  
**Sesi ideal:** 5–15 menit.  
**Bahasa awal:** Indonesia dengan istilah Islam umum: adab, wudhu, shalat, zakat, masjid, keluarga, tetangga, amanah, syukur.

## 2. Prinsip Konten Islami
1. **Tidak menggambarkan Nabi, Rasul, malaikat, sahabat/sahabiyah, atau tokoh suci secara visual maupun avatar.** Kisah disampaikan lewat narasi teks/audio, simbol lingkungan, artefak non-figuratif, dan pelajaran nilai.
2. **Tidak menggunakan hadits dhaif/lemah.** Konten yang mengutip dalil harus berasal dari Al-Qur'an atau hadits shahih/hasan yang diverifikasi oleh reviewer ilmu syar'i.
3. **Tidak membuat simulasi ibadah yang meremehkan.** Aktivitas ibadah dibuat sebagai edukasi urutan, adab, dan pemahaman; bukan pengganti ibadah nyata.
4. **Menghindari kontroversi fikih detail.** Gunakan materi dasar lintas keluarga Muslim; bila ada perbedaan pendapat, gunakan wording netral: “ikuti bimbingan orang tua/guru/ustadz setempat”.
5. **Child-friendly & family-safe:** tanpa kekerasan, jumpscare, musik/visual berlebihan, monetisasi manipulatif, atau kompetisi yang mempermalukan.
6. **Representasi Islam yang hangat:** masjid, rumah, pasar, taman, sekolah, sedekah, kebersihan, salam, hormat orang tua, menolong tetangga.

## 3. Tujuan Produk
- Membuat anak tertarik mengeksplorasi konsep dasar Islam lewat permainan 3D interaktif.
- Menyediakan aktivitas keluarga: diskusi singkat setelah mini-game, pertanyaan refleksi, dan mode pendamping orang tua.
- Memberi fondasi konten yang dapat diperluas menjadi kampung/zona/lesson pack baru.

## 4. Pilar Pengalaman
1. **Explore:** mengendarai mobil mainan/buggy kecil mengelilingi Kampung Iman.
2. **Discover:** menemukan papan ilmu, NPC warga generik non-tokoh-suci, objek interaktif, dan pintu mini-game.
3. **Practice:** menyelesaikan mini-game edukatif: urutan wudhu, mencocokkan adab, kuis surat pendek, rute sedekah.
4. **Reflect:** mendapatkan pesan singkat, ayat/hadits shahih yang relevan, dan prompt obrolan keluarga.
5. **Collect:** mengumpulkan bintang amal/lencana adab untuk membuka kosmetik kendaraan dan area baru, tanpa pay-to-win.

## 5. Core Gameplay Loop
1. Pemain spawn di **Alun-Alun Kampung Iman** dengan kendaraan kecil.
2. Pemain berkendara bebas, mencoba obstacle ringan, dan mencari ikon aktivitas.
3. Pemain masuk mini-game berdurasi 1–3 menit.
4. Setelah berhasil, pemain menerima:
   - ringkasan pelajaran 1–2 kalimat,
   - dalil bila relevan dan sudah terverifikasi,
   - bintang/lencana,
   - pertanyaan refleksi untuk keluarga.
5. Progres membuka zona/objek dekorasi/warna kendaraan.
6. Pemain kembali menjelajah.

## 6. Dunia & Zona Awal
### A. Alun-Alun Kampung Iman / Hub
**Fungsi:** tutorial kontrol, peta, profil anak, koleksi lencana.  
**Objek:** papan misi harian, pohon kurma dekoratif, air mancur geometris, rambu adab.  
**Aktivitas:** tutorial “Salam & Senyum”: dekati warga, tekan tombol interaksi, pilih salam yang baik.

### B. Masjid Raya Nur
**Fokus:** adab masjid, wudhu, pengenalan shalat secara hormat.  
**Tidak:** menampilkan imam/sahabat/nabi; tidak membuat shalat jadi aksi lucu/kompetitif.  
**Mini-game:**
- **Urutan Wudhu:** drag/click langkah wudhu ke urutan benar; visual tangan/ikon air sederhana, bukan karakter detail.
- **Adab Masjid:** pilih perilaku benar: masuk tenang, jaga kebersihan, tidak berlari, letakkan sandal rapi.

### C. Rumah Keluarga Sakinah
**Fokus:** adab kepada orang tua, doa harian, kebersihan rumah.  
**Mini-game:**
- **Bantu Rumah:** antar barang ke tempatnya sambil belajar amanah dan kebersihan.
- **Pilih Doa Harian:** cocokkan situasi dengan doa pendek, dengan transliterasi dan arti.

### D. Pasar Halal
**Fokus:** jujur, halal-thayyib, sedekah, timbang-menimbang adil.  
**Mini-game:**
- **Timbangan Jujur:** seimbangkan timbangan barang secara sederhana.
- **Rute Sedekah:** antar paket bantuan ke keluarga/warga yang membutuhkan tanpa time pressure keras.

### E. Taman Akhlak
**Fokus:** adab berteman, menolong, menjaga alam sebagai amanah.  
**Mini-game:**
- **Pilah Sampah:** masukkan sampah ke kategori benar.
- **Teman Baik:** pilih respons dialog yang lembut saat ada konflik anak-anak.

### F. Perpustakaan Cahaya
**Fokus:** literasi Qur'an dasar, huruf hijaiyah, surat pendek, kisah nilai tanpa visual tokoh suci.  
**Mini-game:**
- **Hijaiyah Trail:** berkendara melewati huruf sesuai urutan/audio.
- **Kuis Makna Pendek:** pertanyaan mudah tentang nilai syukur, sabar, jujur.

## 7. Mekanik Utama
### Kontrol Kendaraan
- Desktop: WASD/arrow untuk gas/belok, Space rem/handbrake, E interaksi, R unstuck.
- Mobile: joystick virtual kiri, tombol rem/interaksi kanan.
- Fisika ringan dan lucu, tetapi tidak merusak tema; objek terpental secara toy-like.

### Interaksi Dunia
- Papan ilmu: tampil kartu edukasi singkat.
- Gerbang zona: masuk area/topik.
- Collectible: bintang amal, koin ilmu, stiker kendaraan.
- NPC warga generik: ibu/bapak/anak/guru/tetangga tanpa klaim tokoh historis.

### Progres & Reward
- **Bintang Amal:** diperoleh dari mini-game dan eksplorasi.
- **Lencana Adab:** contoh: Penjaga Kebersihan, Sahabat Jujur, Anak Berbakti.
- **Kosmetik:** warna kendaraan, topi non-religius untuk mobil, trail cahaya geometris. Hindari kosmetik yang merendahkan simbol ibadah.
- **Parent Dashboard sederhana:** daftar topik yang selesai dan saran diskusi.

### Kesulitan
- Tidak ada game over keras.
- Kesalahan diberi feedback lembut: “Coba lagi, yuk. Kita belajar pelan-pelan.”
- Mode bantuan otomatis setelah 2–3 kesalahan.

## 8. Struktur Konten Lesson Card
Setiap aktivitas wajib punya metadata:

```yaml
id: wudhu_order_01
title: Urutan Wudhu
zone: Masjid Raya Nur
age_range: 6-12
learning_goal: Anak mengenal urutan wudhu dasar.
interaction: sequence_ordering
source_type: fiqh_basic
source_reference: Review ustadz/kurikulum internal; tidak mengutip hadits tanpa verifikasi.
review_status: pending_scholarly_review
no_visual_restrictions: [prophets, angels, sahabah]
family_prompt: "Kapan kita berwudhu? Coba praktikkan bersama Ayah/Ibu."
```

Jika mengutip dalil:
```yaml
source_type: quran_or_hadith
source_reference: "QS ... / Sahih al-Bukhari no. ..."
translation_source: "Kemenag RI / reviewer-approved"
review_status: approved
```

## 9. Content Direction Visual
- **Gaya:** low-poly, cerah, seperti mainan kayu/plastik, rounded edges, warna pastel-hangat.
- **Arsitektur:** masjid dan rumah bernuansa Nusantara/umum Muslim; gunakan geometri Islami, pola bintang, kaligrafi non-ayat sebagai dekorasi bila belum direview.
- **Karakter:** warga generik modern/sopan; variasi keluarga Muslim global; pakaian sederhana dan pantas.
- **Hindari:** wajah/tubuh tokoh suci, malaikat bersayap, penggambaran alam gaib, karikatur agama lain, simbol ayat Qur'an di lantai/jalan/objek yang bisa ditabrak.
- **Objek yang boleh ditabrak:** cone, balok mainan, kardus, bola, pagar elastis; bukan mushaf, sajadah, mimbar, nama Allah, atau kaligrafi suci.

## 10. Content Direction Audio & Narasi
- Voice-over anak/dewasa yang lembut, tidak menggurui.
- Musik opsional dan dapat dimatikan; sediakan mode “tanpa musik”.
- Efek suara playful: bunyi roda, pop reward, air wudhu lembut.
- Untuk ayat Qur'an, gunakan tilawah hanya bila lisensi dan adab pemutaran jelas; jangan diputar saat gameplay tabrakan/chaos. Alternatif awal: teks terjemah dan prompt orang tua.

## 11. MVP Scope
### Must Have
- WebGL scene dengan kendaraan dapat dikontrol.
- Hub + 3 zona: Masjid Raya Nur, Rumah Keluarga Sakinah, Pasar Halal.
- 6 mini-game awal:
  1. Salam & Senyum
  2. Urutan Wudhu
  3. Adab Masjid
  4. Bantu Rumah
  5. Timbangan Jujur
  6. Rute Sedekah
- Sistem collectible/lencana sederhana.
- Konten lesson card berbasis JSON/YAML dengan status review.
- Mode orang tua: ringkasan topik dan prompt diskusi.
- Safety rules diterapkan di asset/content pipeline.

### Should Have
- Mobile controls.
- Audio narration Bahasa Indonesia.
- Accessibility: text size, color contrast, reduce motion.
- Save progress localStorage.

### Could Have
- Seasonal packs: Ramadan, Haji/Umrah intro, Akhlak di Sekolah.
- Multiplayer keluarga lokal/asinkron.
- Printable family activity sheet.

## 12. Acceptance Criteria MVP
### Gameplay
- Pemain dapat memuat game di Chrome/Firefox/Safari modern dan mulai bermain dalam <10 detik pada koneksi broadband normal.
- Kendaraan dapat bergerak, belok, rem, reset/unstuck, dan berinteraksi dengan trigger zona.
- Minimal 3 zona dapat dikunjungi tanpa reload halaman penuh.
- Minimal 6 mini-game dapat diselesaikan dari awal sampai reward.

### Education & Content Safety
- Tidak ada visual Nabi/Rasul, malaikat, sahabat/sahabiyah, atau klaim penggambaran tokoh suci.
- Tidak ada kutipan hadits kecuali tercatat shahih/hasan dan berstatus `approved` oleh reviewer.
- Semua lesson card memiliki learning goal, age range, family prompt, dan review_status.
- Objek suci seperti mushaf, ayat, nama Allah, sajadah, mihrab/mimbar tidak ditempatkan sebagai objek tabrakan/komedi fisika.

### UX Anak & Keluarga
- Feedback kesalahan bersifat lembut dan memberi bantuan setelah percobaan berulang.
- Ada tombol mute/audio, reduce motion, dan reset posisi.
- Orang tua dapat melihat daftar pelajaran yang diselesaikan.

### Technical
- Konten edukasi dipisah dari kode game agar dapat direview non-developer.
- Build produksi berjalan tanpa error console kritis.
- FPS target 45–60 pada laptop umum; fallback kualitas tersedia.
- Save progress lokal tidak menyimpan data sensitif anak.

## 13. Backlog Kanban Awal
### Product / Design
- [ ] Finalisasi nama zona dan world map.
- [ ] Wireframe HUD: peta, bintang, tombol orang tua, pause.
- [ ] Prototype driving feel: toy-like, forgiving, fun.

### Content
- [ ] Buat 20 lesson card awal dengan `review_status: draft`.
- [ ] Tetapkan daftar sumber yang boleh dipakai: Qur'an terjemah Kemenag, hadits shahih/hasan dengan rujukan jelas, kurikulum reviewer.
- [ ] Review syar'i untuk semua materi MVP.

### Engineering
- [ ] Setup Three.js/R3F scene, physics, camera follow.
- [ ] Implement interaction trigger system.
- [ ] Implement mini-game framework.
- [ ] Implement content loader JSON/YAML.
- [ ] Implement localStorage progress.

### Art / Audio
- [ ] Low-poly hub blockout.
- [ ] Asset list zona Masjid/Rumah/Pasar.
- [ ] SFX pack friendly.
- [ ] VO script draft dan pronunciation guide.

### QA / Safety
- [ ] Content safety checklist in PR template.
- [ ] Device/browser test matrix.
- [ ] Accessibility pass.
- [ ] Parent review playtest.

## 14. Risiko & Mitigasi
- **Risiko konten agama tidak akurat:** wajib review syar'i sebelum rilis; lesson card punya status review.
- **Risiko visual tidak adab:** asset blacklist dan checklist sebelum merge.
- **Risiko anak hanya bermain tanpa belajar:** reward selalu dikaitkan dengan refleksi/pelajaran singkat.
- **Risiko performa WebGL:** low-poly, texture atlas, lazy-load zona, quality presets.
- **Risiko perbedaan praktik keluarga:** wording netral dan parent guidance.

## 15. Definition of Done untuk Konten Baru
Sebuah lesson/mini-game dianggap selesai jika:
1. Ada learning goal yang jelas untuk usia 6–12.
2. Tidak melanggar batas representasi Islam.
3. Dalil, bila ada, memiliki rujukan dan status review approved.
4. Ada gameplay task yang selesai dalam 1–3 menit.
5. Ada feedback benar/salah yang ramah anak.
6. Ada family prompt.
7. Sudah diuji minimal oleh 1 anak/keluarga atau reviewer internal untuk kejelasan bahasa.
