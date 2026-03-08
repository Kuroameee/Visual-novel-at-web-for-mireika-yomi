"use client";
// Language system — Indonesian only (toggle removed)
// useLang() masih bisa dipakai di semua komponen, tapi hanya ID

const STRINGS = {
  enter:           "Sentuh Untuk Memasuki",
  menu_enter:      "Masuk ke Cerita",
  menu_minigame:   "Main Minigame Saja",
  arwah:           "アルワー · Arwah · Spirit",
  fragments_title: "Kumpulkan kepingan jiwa Mirei",
  fragments_warn:  "4 bayangan · 15 kepingan · 60 detik",
  fragments_ctrl:  "WASD / Arrow keys · Klik arah",
  fragments_lbl:   "Kepingan",
  caught:          "Tertangkap...",
  caught_sub:      "kepingan sempat terkumpul",
  all_clear:       "Semua kepingan terkumpul!",
  all_clear_sub:   "Kamu luar biasa",
  timeout:         "Waktu habis",
  timeout_sub:     "dari",
  timeout_sub2:    "kepingan terkumpul",
  continue:        "Lanjutkan Perjalanan",
  soul_contract:   "Kontrak Jiwa",
  q_of:            "Pertanyaan",
  next:            "Lanjut",
  finish:          "Selesai",
  toward_end:      "Menuju Akhir",
  rank_1:          "Jiwa Terpilih",
  rank_2:          "Teman Arwah",
  rank_3:          "Sahabat Alam",
  rank_4:          "Pengelana Baru",
  play_again:      "Mainkan Lagi",
  debut:           "Debut",
  score:           "Skor",
  back_menu:       "Kembali ke Menu",
  minigame_title:  "Labirin Arwah",
  minigame_start:  "Mulai",
  minigame_back:   "Kembali",
} as const;

type T = keyof typeof STRINGS;

// Simple hook — no context, no state, just a static lookup
export function useLang() {
  return {
    lang: "id" as const,
    setLang: (_l: string) => {},
    t: (id: T): string => STRINGS[id],
  };
}

// No-op provider — kept so existing imports don't break
export function LangProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
