# Topline - Robux Top-Up Platform

Platform top-up Robux dengan fitur modern, responsif, dan user-friendly.

## 🎉 Fitur Baru (Update Terbaru)

### 1. 🎯 Hero Section dengan Slogan
**"Top Up Robux Instan, Murah & Terpercaya"**

- Tipografi modern dengan gradient text effect (putih → hijau)
- Fully responsive dengan clamp() untuk fluid typography
- Subtitle informatif tentang keunggulan platform
- Positioning yang menonjol di bagian atas halaman

**Teknologi**: CSS gradient text, clamp(), flexbox

---

### 2. 🏆 Leaderboard Top 10 Buyer

Menampilkan pembeli terbaik bulan ini dengan detail:
- **Rank**: Peringkat 1-10
- **Username**: Disamarkan untuk privasi (1/3 karakter visible, sisanya *)
- **Transaksi**: Jumlah total transaksi
- **Points**: Total poin yang dikumpulkan

**Fitur Special**:
- 🥇 Top 3 mendapat highlight khusus
- Medal colors: Gold (#FFD700), Silver (#C0C0C0), Bronze (#CD7F32)
- Hover effect dengan transform & border color change
- Responsive grid layout

**Data**: Mock data dengan 10 entries
**Teknologi**: JavaScript rendering, CSS Grid, custom masking function

---

### 3. 💬 Customer Service Contact

#### Footer Section
Footer yang lebih informatif dengan 3 kolom:
1. **Brand Section**: Logo + deskripsi singkat
2. **Navigasi**: Link ke Beranda dan Panduan
3. **Customer Service**: 
   - 📱 WhatsApp: +62 812-3456-7890
   - 💬 Telegram: @topline_cs

#### Floating CS Button
Tombol melayang di pojok kanan bawah dengan:
- Icon chat yang menarik
- Popup menu saat diklik
- 2 pilihan kontak: WhatsApp & Telegram
- Auto-close saat click outside
- Smooth animations & hover effects

**Positioning**: Fixed bottom-right dengan z-index tinggi
**Responsive**: Size dan posisi menyesuaikan di mobile

---

### 4. 📚 Halaman Panduan & Tutorial

Halaman lengkap `/panduan` dengan konten:

#### a. Cara Melakukan Order (5 langkah)
1. Pilih Metode Top-Up
2. Masukkan Data Akun
3. Pilih Paket Robux
4. Lanjutkan ke Pembayaran
5. Tunggu Proses

Dengan numbered steps dan counter circle hijau.

#### b. Cara Menemukan Roblox User ID
- **Metode 1**: Melalui Profil Roblox (step-by-step dengan contoh URL)
- **Metode 2**: Menggunakan Username (cara termudah di platform ini)

Dengan callout boxes dan code examples.

#### c. FAQ - 6 Pertanyaan Umum
1. Berapa lama proses pengiriman Robux?
2. Apakah data saya aman?
3. Metode pembayaran apa saja yang tersedia?
4. Bagaimana jika pembayaran sudah dilakukan tapi Robux belum masuk?
5. Apakah bisa refund jika salah input username?
6. Minimum dan maksimum pembelian berapa?

Dengan accordion-style layout dan detailed answers.

#### d. Kontak CS
CTA buttons untuk WhatsApp dan Telegram.

**Navigasi**:
- Link "Panduan & Tutorial" di footer
- Button "← Kembali ke Beranda" di halaman panduan
- Smooth page transitions

---

## 🎨 Design System

### Colors
- **Background**: `#0a0a0a` (dark)
- **Surface**: `#111111` / `#161616`
- **Border**: `#262626` / `#404040`
- **Text**: `#ededed` (light)
- **Muted**: `#8f8f8f`
- **Accent Green**: `#3ecf8e`
- **Accent Amber**: `#f5a524`

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono (untuk angka & username)
- **Responsive Sizing**: Menggunakan `clamp()` untuk fluid typography

### Spacing
- Container max-width: `1040px`
- Section spacing: `40px - 60px`
- Card padding: `20px - 32px`
- Mobile optimized: Reduced padding di layar kecil

---

## 📱 Responsiveness

### Breakpoints
1. **Desktop**: 1024px+ (full layout, 3-column footer)
2. **Tablet**: 880px - 1023px (2-column/1-column layout)
3. **Mobile**: ≤ 560px (single column, optimized touch targets)

### Mobile Optimizations
- Reduced font sizes (with clamp)
- Stacked layouts (column instead of row)
- Larger touch targets (min 44x44px)
- Adjusted padding & spacing
- Responsive floating CS button & menu
- Full-width buttons di panduan page

### Testing
Lihat `RESPONSIVENESS_CHECK.md` untuk checklist lengkap.

---

## 🛠️ Teknologi

### Frontend
- **HTML5**: Semantic markup, accessibility attributes
- **CSS3**: 
  - CSS Grid & Flexbox
  - Custom properties (CSS variables)
  - Gradient text effects
  - Smooth transitions & animations
  - Media queries untuk responsive
- **JavaScript (Vanilla)**:
  - No frameworks/libraries
  - ES6+ syntax
  - Event delegation
  - DOM manipulation
  - State management

### Features Implemented
- ✅ Hero section dengan gradient text
- ✅ Leaderboard dengan data masking
- ✅ Footer dengan navigasi & kontak CS
- ✅ Floating CS button dengan popup menu
- ✅ Halaman panduan lengkap
- ✅ Client-side routing (show/hide pages)
- ✅ Responsive design (mobile-first approach)
- ✅ Accessibility (ARIA attributes, semantic HTML)

---

## 🚀 Quick Start

1. Clone atau download project ini
2. Buka `index.html` di browser modern
3. Tidak perlu build process atau dependencies

```bash
# Langsung buka di browser
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

---

## 📁 File Structure

```
.
├── index.html                  # Main HTML file
├── style.css                   # All styles (termasuk responsive)
├── script.js                   # All JavaScript functionality
├── README.md                   # Dokumentasi ini
└── RESPONSIVENESS_CHECK.md     # Checklist untuk testing responsive
```

---

## 🔄 Updates Log

### v2.1 - [2026-10-20 14:27]
- 🎨 Replaced all emoji icons with custom SVG icons
- ✨ Added premium trophy icon for leaderboard title
- 🏅 Added animated medal SVG badges for Top 3 (Gold, Silver, Bronze)
- 🎯 Added custom icons for all panduan sections (clipboard, search, question, chat)
- 💬 Replaced emoji in CS contacts with professional WhatsApp & Telegram SVG icons
- 🌟 Added subtle animations (iconPulse, medalShine) for visual polish
- 🎨 Enhanced icon styling with drop-shadows and hover effects
- ♿ Improved accessibility with proper SVG structure

### v2.0 - [2026-10-20]
- ✨ Added Hero Section dengan slogan utama
- ✨ Added Leaderboard Top 10 Buyer
- ✨ Added Enhanced Footer dengan navigasi & CS contact
- ✨ Added Floating CS Button
- ✨ Added Halaman Panduan & Tutorial lengkap
- 🎨 Improved responsiveness untuk semua fitur
- 📱 Mobile-optimized layouts
- ♿ Enhanced accessibility

### v1.0 - [Initial Release]
- Basic order flow (username/gamepass/login methods)
- Package selection
- QRIS payment simulation
- Order processing & success states
- Admin debug panel

---

## 🎯 Future Enhancements (Potential)

1. **Backend Integration**:
   - Real payment gateway (Midtrans, Xendit, dll)
   - Database untuk leaderboard real-time
   - User authentication & order history

2. **Additional Features**:
   - Live chat integration
   - Order tracking dengan real-time updates
   - Promo codes & discount system
   - Multi-language support

3. **Performance**:
   - Image optimization
   - Code splitting
   - Service Worker untuk offline support

4. **Analytics**:
   - User behavior tracking
   - Conversion funnel analysis
   - A/B testing framework

---

## 📞 Contact

Untuk pertanyaan atau support:
- 📱 WhatsApp: [+62 812-3456-7890](https://wa.me/6281234567890)
- 💬 Telegram: [@topline_cs](https://t.me/topline_cs)

---

## 📄 License

This is a frontend prototype. No actual payments are processed.

---

**Made with ❤️ for Roblox players**
