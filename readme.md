Berdasarkan skema database yang kita punya, berikut adalah daftar router yang Anda butuhkan untuk mengimplementasikan API lengkap untuk aplikasi toko buku Anda:

## Router yang Dibutuhkan untuk Aplikasi Toko Buku

### 1. Autentikasi & Manajemen Pengguna
- `auth.router.ts`
  - POST /api/auth/register - Pendaftaran pengguna baru
  - POST /api/auth/login - Login pengguna
  - POST /api/auth/logout - Logout pengguna
  - POST /api/auth/refresh-token - Memperbarui access token
  - POST /api/auth/verify-email - Verifikasi email dengan OTP
  - POST /api/auth/resend-otp - Kirim ulang kode OTP
  - POST /api/auth/forgot-password - Permintaan reset password
  - POST /api/auth/reset-password - Reset password

- `users.router.ts`
  - GET /api/users/me - Mendapatkan profil pengguna sendiri
  - PUT /api/users/me - Update profil pengguna
  - PUT /api/users/me/avatar - Update avatar pengguna
  - GET /api/users/:id - Mendapatkan profil pengguna tertentu (admin)
  - GET /api/users - Mendapatkan daftar pengguna (admin)
  - PUT /api/users/:id/status - Mengubah status pengguna (admin)
  - DELETE /api/users/:id - Menghapus pengguna (admin)

### 2. Manajemen Buku
- `books.router.ts`
  - GET /api/books - Mendapatkan daftar buku dengan filter & pagination
  - GET /api/books/:id - Mendapatkan detail buku tertentu
  - POST /api/books - Menambahkan buku baru (seller/admin)
  - PUT /api/books/:id - Edit buku (seller/admin)
  - DELETE /api/books/:id - Hapus buku (seller/admin)
  - GET /api/books/user/:userId - Mendapatkan buku dari penjual tertentu
  - PUT /api/books/:id/publish - Publikasikan/unpublish buku (seller/admin)
  - PUT /api/books/:id/cover - Update cover buku
  - GET /api/books/featured - Mendapatkan buku unggulan

- `bookImages.router.ts`
  - POST /api/books/:bookId/images - Menambahkan gambar ke buku
  - PUT /api/books/images/:id - Update data gambar
  - DELETE /api/books/images/:id - Hapus gambar
  - PUT /api/books/images/:id/featured - Set gambar sebagai featured

### 3. Kategori
- `categories.router.ts`
  - GET /api/categories - Mendapatkan semua kategori
  - GET /api/categories/:id - Mendapatkan kategori tertentu
  - POST /api/categories - Membuat kategori baru (admin)
  - PUT /api/categories/:id - Edit kategori (admin)
  - DELETE /api/categories/:id - Hapus kategori (admin)
  - GET /api/categories/:id/books - Mendapatkan buku dari kategori tertentu

### 4. Keranjang Belanja
- `carts.router.ts`
  - GET /api/cart - Mendapatkan keranjang pengguna
  - POST /api/cart/items - Menambahkan item ke keranjang
  - PUT /api/cart/items/:id - Update quantity item keranjang
  - DELETE /api/cart/items/:id - Hapus item dari keranjang
  - DELETE /api/cart/clear - Kosongkan keranjang

### 5. Wishlist
- `wishlist.router.ts`
  - GET /api/wishlist - Mendapatkan wishlist pengguna
  - POST /api/wishlist - Menambahkan buku ke wishlist
  - DELETE /api/wishlist/:id - Hapus buku dari wishlist

### 6. Pemesanan & Transaksi
- `orders.router.ts`
  - POST /api/orders - Membuat pesanan baru
  - GET /api/orders - Mendapatkan daftar pesanan pengguna
  - GET /api/orders/:id - Mendapatkan detail pesanan
  - PUT /api/orders/:id/status - Update status pesanan (admin/seller)
  - GET /api/orders/seller - Mendapatkan pesanan untuk seller
  - GET /api/orders/download/:orderItemId - Download ebook yang dibeli

- `transactions.router.ts`
  - POST /api/transactions/:orderId/create - Membuat transaksi untuk pesanan
  - POST /api/transactions/webhook - Endpoint untuk webhook payment gateway
  - GET /api/transactions/:id - Mendapatkan detail transaksi
  - GET /api/transactions - Mendapatkan daftar transaksi (admin)

### 7. Ulasan & Rating
- `reviews.router.ts`
  - GET /api/books/:bookId/reviews - Mendapatkan ulasan buku
  - POST /api/books/:bookId/reviews - Menulis ulasan buku
  - PUT /api/reviews/:id - Edit ulasan
  - DELETE /api/reviews/:id - Hapus ulasan
  - GET /api/users/:userId/reviews - Mendapatkan ulasan oleh pengguna tertentu

### 8. Tanya Jawab Buku
- `questions.router.ts`
  - GET /api/books/:bookId/questions - Mendapatkan Q&A buku
  - POST /api/books/:bookId/questions - Mengajukan pertanyaan baru
  - PUT /api/questions/:id/answer - Menjawab pertanyaan (seller)
  - PUT /api/questions/:id - Edit pertanyaan/jawaban
  - DELETE /api/questions/:id - Hapus pertanyaan

### 9. Chat
- `chat.router.ts`
  - GET /api/chat/rooms - Mendapatkan daftar chat room pengguna
  - GET /api/chat/rooms/:id - Mendapatkan detail chat room
  - POST /api/chat/rooms - Membuat chat room baru
  - GET /api/chat/rooms/:id/messages - Mendapatkan pesan dalam chat room
  - POST /api/chat/rooms/:id/messages - Mengirim pesan baru
  - PUT /api/chat/rooms/:id/read - Menandai pesan sebagai dibaca
  - POST /api/chat/rooms/:id/attachment - Mengirim file attachment

### 10. Notifikasi
- `notifications.router.ts`
  - GET /api/notifications - Mendapatkan notifikasi pengguna
  - PUT /api/notifications/:id/read - Menandai notifikasi sebagai dibaca
  - PUT /api/notifications/read-all - Menandai semua notifikasi sebagai dibaca
  - DELETE /api/notifications/:id - Hapus notifikasi

### 11. Diskon & Promo
- `discounts.router.ts`
  - GET /api/discounts - Mendapatkan semua diskon (admin)
  - POST /api/discounts - Membuat diskon baru (admin)
  - PUT /api/discounts/:id - Edit diskon (admin)
  - DELETE /api/discounts/:id - Hapus diskon (admin)
  - POST /api/discounts/:id/books - Menambahkan buku ke diskon
  - DELETE /api/discounts/:id/books/:bookId - Hapus buku dari diskon
  - POST /api/discounts/:id/categories - Menambahkan kategori ke diskon
  - DELETE /api/discounts/:id/categories/:categoryId - Hapus kategori dari diskon
  - POST /api/discounts/verify - Memverifikasi kode diskon

### 12. Analitik & Dashboard (Opsional)
- `analytics.router.ts`
  - GET /api/analytics/sales - Mendapatkan data penjualan (admin/seller)
  - GET /api/analytics/users - Mendapatkan statistik pengguna (admin)
  - GET /api/analytics/books - Mendapatkan statistik buku (admin/seller)
  - GET /api/analytics/dashboard - Mendapatkan data untuk dashboard