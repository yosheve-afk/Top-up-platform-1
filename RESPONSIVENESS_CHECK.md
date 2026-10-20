# Checklist Verifikasi Responsivitas

## Cara Testing
1. Buka `index.html` di browser
2. Buka Developer Tools (F12)
3. Toggle Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
4. Test di berbagai ukuran layar

## Breakpoints yang Ditest
- **Desktop**: 1024px+
- **Tablet**: 880px - 1023px
- **Mobile**: 320px - 560px

---

## ✅ Hero Section

### Desktop (1024px+)
- [ ] Slogan terlihat dengan font size besar (52px)
- [ ] Gradient text dari putih ke hijau tampil dengan baik
- [ ] Subtitle centered dengan max-width 60ch
- [ ] Padding 60px atas dan 40px bawah

### Tablet (880px)
- [ ] Slogan masih terbaca dengan baik
- [ ] Padding dikurangi menjadi 40px atas, 32px bawah
- [ ] Text tetap centered

### Mobile (560px dan lebih kecil)
- [ ] Font size otomatis menyesuaikan (clamp: 32px minimum)
- [ ] Padding 32px atas, 24px bawah
- [ ] Tidak ada horizontal overflow
- [ ] Text tetap terbaca dan centered

---

## ✅ Leaderboard Section

### Desktop (1024px+)
- [ ] Grid max-width 720px dan centered
- [ ] 3 kolom: rank (50px), user info (1fr), points (auto)
- [ ] Top 3 memiliki styling khusus (background lebih terang)
- [ ] Medal colors: Gold (#FFD700), Silver (#C0C0C0), Bronze (#CD7F32)
- [ ] Hover effect: border color berubah dan transform translateY(-2px)
- [ ] Username ter-mask dengan benar (1/3 visible, sisanya ***)

### Tablet (880px)
- [ ] Leaderboard tetap centered
- [ ] Grid masih dalam max-width 720px
- [ ] Spacing antar items masih rapi

### Mobile (560px dan lebih kecil)
- [ ] Grid columns: 40px, 1fr, auto (rank lebih kecil)
- [ ] Font size rank: 16px (20px untuk top 3)
- [ ] Username font: 14px
- [ ] Points font: 14px
- [ ] Padding item: 12px 14px (lebih kecil)
- [ ] Gap antar items tetap 12px
- [ ] Tidak ada text overflow

---

## ✅ Footer Section

### Desktop (1024px+)
- [ ] 3 kolom: 2fr (brand), 1fr (navigasi), 1fr (CS)
- [ ] Gap 48px antar kolom
- [ ] Footer links hover effect berfungsi (color: white)
- [ ] Footer bottom dengan border-top dan text centered

### Tablet (880px)
- [ ] Grid berubah menjadi 1 kolom
- [ ] Gap 32px antar section
- [ ] Semua section tetap terbaca dengan baik

### Mobile (560px dan lebih kecil)
- [ ] Single column layout
- [ ] Gap 24px antar section
- [ ] Footer links tetap mudah di-tap (min 44x44px touch target)
- [ ] Padding container 18px

---

## ✅ Floating CS Button

### Desktop (1024px+)
- [ ] Button fixed di bottom: 24px, right: 24px
- [ ] Size: 56x56px, border-radius: 50%
- [ ] Background: var(--green) dengan icon chat
- [ ] Hover: scale(1.1) dengan shadow effect
- [ ] Menu popup: width 280px, positioned above button
- [ ] Menu memiliki 2 items: WhatsApp dan Telegram
- [ ] Click outside menu menutup menu

### Mobile (560px dan lebih kecil)
- [ ] Button size: 52x52px
- [ ] Position: bottom 16px, right 16px
- [ ] Menu width: calc(100vw - 32px) untuk fit screen
- [ ] Menu positioned right: -16px untuk alignment
- [ ] Touch-friendly (easy to tap)
- [ ] Menu items memiliki spacing yang cukup

---

## ✅ Halaman Panduan

### Desktop (1024px+)
- [ ] Content max-width 800px dan centered
- [ ] Button "Kembali" terlihat jelas di atas
- [ ] 4 section: Cara Order, Cara Cari User ID, FAQ, Kontak CS
- [ ] Numbered steps dengan circle counter hijau
- [ ] FAQ accordion/list style terbaca dengan baik
- [ ] Contact buttons (WhatsApp, Telegram) side by side

### Tablet (880px)
- [ ] Content tetap dalam max-width 800px
- [ ] Section padding menyesuaikan
- [ ] Steps masih terbaca dengan jelas

### Mobile (560px dan lebih kecil)
- [ ] Section padding: 24px 18px
- [ ] Steps padding-left: 40px (lebih kecil dari desktop 48px)
- [ ] Contact buttons berubah jadi column (full width)
- [ ] FAQ text tidak overflow
- [ ] Code blocks dalam panduan terbaca (tidak terpotong)
- [ ] List items memiliki line-height yang cukup untuk readability

---

## ✅ Navigasi Halaman

### Semua Ukuran
- [ ] Click "Panduan & Tutorial" di footer → halaman panduan muncul
- [ ] Main page, header, footer asli hidden saat di panduan
- [ ] Button "Kembali ke Beranda" → kembali ke home
- [ ] Floating CS button hidden saat di halaman panduan
- [ ] Admin panel hidden saat di halaman panduan
- [ ] Smooth scroll to top saat navigasi

---

## ✅ Interaksi & Fungsionalitas

### Floating CS Menu
- [ ] Click icon chat → menu toggle (show/hide)
- [ ] Click outside → menu close
- [ ] WhatsApp link membuka wa.me dengan nomor yang benar
- [ ] Telegram link membuka t.me dengan username yang benar
- [ ] Aria attributes berfungsi (aria-expanded)

### Leaderboard
- [ ] Data 10 entries ter-render dengan benar
- [ ] Username masking function bekerja
- [ ] Points format dengan thousand separator (id-ID)
- [ ] Top 3 memiliki class "top-3"
- [ ] Rank colors: gold, silver, bronze untuk top 3

---

## ⚠️ Known Issues / Notes

1. **Cross-browser Testing**:
   - Test di Chrome, Firefox, Safari, Edge
   - Gradient text mungkin tidak support di browser lama

2. **Performance**:
   - Check bahwa tidak ada layout shift saat load
   - Hero gradient tidak menyebabkan rendering lag

3. **Accessibility**:
   - Touch targets minimum 44x44px
   - Color contrast ratio cukup untuk readability
   - Keyboard navigation berfungsi untuk semua interaktif elements

---

## Testing Result Summary

**Tested on**: [Date]
**Browser**: [Browser Name & Version]
**Device**: [Desktop/Tablet/Mobile]

**Status**: 
- [ ] All features responsive and working
- [ ] Minor issues (list below)
- [ ] Major issues (list below)

**Issues Found**:
1. 
2. 
3. 

**Screenshots**: (Optional - attach screenshots of different breakpoints)
