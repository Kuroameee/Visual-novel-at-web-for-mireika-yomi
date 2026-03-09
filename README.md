# 🌑 Mireika Yomi — Debut Web Game

Web game interaktif sebagai hadiah debut Mireika Yomi.
Dibuat dengan Next.js 14, Tailwind CSS, dan Framer Motion.

---

## 🗂️ Struktur Game

```
Intro → Visual Novel → Forest Walk (dikejar) → Fragments Game → Soul Quiz → Ending
```

### Scene breakdown:
1. **Intro** — Landing page atmosferik dengan title dan partikel
2. **VN Scene** — 5 slide narasi dengan typewriter effect + background forest
3. **Forest Walk** — POV diikuti bayangan, lari, ketemu Mireika
4. **Fragments Game** — Kumpulkan 10 kepingan dalam 45 detik, hindari shadow
5. **Soul Quiz** — 5 pertanyaan tentang Mireika (Kontrak Jiwa)
6. **Ending** — Pesan debut, rank berdasarkan score, tombol sosmed

---

## 🚀 Setup & Install

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`

---

## 🎨 Aset Yang Dibutuhkan

Taruh semua aset di folder `public/assets/`:

| File | Keterangan |
|------|-----------|
| `mireika.png` | PNG cutout karakter Mireika (transparent background) |
| `bgm.mp3` | Background music / BGM |
| `forest1.png` | Background hutan gelap (gambar ke-2 / ke-4 dari debut) |
| `forest2.png` | Background hutan dengan cahaya teal |

> ⚠️ Jika aset tidak ada, game tetap bisa berjalan dengan fallback gradient

---

## ✏️ Konfigurasi

### Ganti pertanyaan quiz di `components/games/SoulQuiz.tsx`:
Edit array `questions` untuk menyesuaikan dengan lore karakter.

### Sesuaikan narasi VN di `components/scenes/VNScene.tsx`:
Edit array `slides` untuk teks dialog.

### Sesuaikan narasi Forest Walk di `components/scenes/ForestWalkScene.tsx`:
Edit array `WALK_STEPS`.

---

## 🎭 Sistem Rank (Ending)

| Score | Rank |
|-------|------|
| 14–15 | 👑 Jiwa Terpilih |
| 10–13 | ✨ Teman Arwah |
| 6–9   | 🌙 Sahabat Alam |
| 0–5   | 🌿 Pengelana Baru |

Score maksimal: 15 (10 kepingan + 5 quiz)

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom dark gothic palette)
- **Framer Motion** (transisi scene, animasi)
- **Canvas API** (particle system)

---

## 📁 Struktur File

```
mireika-yomi/
├── app/
│   ├── globals.css        # CSS global, animasi, font
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Game orchestrator (main controller)
├── components/
│   ├── scenes/
│   │   ├── IntroScene.tsx       # Landing
│   │   ├── VNScene.tsx          # Visual Novel
│   │   ├── ForestWalkScene.tsx  # POV dikejar
│   │   ├── BridgeScene.tsx      # Transisi antar game
│   │   └── EndingScene.tsx      # Pesan debut + rank
│   ├── games/
│   │   ├── FragmentsGame.tsx    # Kumpulkan kepingan
│   │   └── SoulQuiz.tsx         # Kontrak Jiwa quiz
│   └── ui/
│       ├── CustomCursor.tsx     # Cursor teal custom
│       ├── ParticleCanvas.tsx   # Partikel atmosferik
│       └── useTypewriter.ts     # Typewriter hook
└── public/
    └── assets/                  # ← Taruh aset di sini
```

---

## 🌐 Deploy

```bash
npm run build
npm run start
```

Atau deploy ke Vercel:
```bash
npx vercel
```

---

*Dibuat dengan 💙 sebagai hadiah debut Mireika Yomi*
