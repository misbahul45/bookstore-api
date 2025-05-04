import { sql, relations } from 'drizzle-orm';
import { mysqlTable, varchar, text, timestamp, tinyint, int, boolean, index, float, } from 'drizzle-orm/mysql-core';

// ✅ Users Table
export const users = mysqlTable('users_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 255 }),
  avatarId: varchar('avatar_id', { length: 255 }), // Added Cloudinary public ID for avatar
  refreshToken: varchar('refresh_token', { length: 512 }),
  role: varchar('role', { length: 20 }).notNull().default('user'), // 'user', 'admin', 'seller'
  otp: varchar('otp', { length: 255 }), // One Time Password for email verification
  otpExpiresAt: timestamp('otp_expires_at'), // Expiration time for OTP
  isVerified: boolean('is_verified').notNull().default(false),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// ✅ Categories Table
export const categories = mysqlTable('categories_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const books = mysqlTable('books_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar('user_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: varchar('category_id', { length: 36 })
    .references(() => categories.id),
  title: varchar('title', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  caption: text('caption'),
  description: text('description'),
  cover: varchar('image', { length: 255 }),
  coverId: varchar('cover_id', { length: 255 }), // Added Cloudinary public ID for cover
  fileUrl: varchar('file_url', { length: 255 }), // For digital books
  fileId: varchar('file_id', { length: 255 }), // Added Cloudinary public ID for digital book file
  price: int('price').notNull(),
  stock: int('stock').notNull().default(0),
  type: varchar('type', { length: 20 }).notNull(), // 'digital' | 'physical'
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => {
  return {
    titleIdx: index('title_idx').on(table.title),
    authorIdx: index('author_idx').on(table.author),
    categoryIdx: index('category_idx').on(table.categoryId),
  }
});

// Tabel untuk menyimpan banyak gambar/foto untuk setiap buku
export const bookImages = mysqlTable('book_images', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  bookId: varchar('book_id', { length: 36 }).notNull()
    .references(() => books.id, { onDelete: "cascade" }), // Hapus gambar ketika buku dihapus
  imageUrl: varchar('image_url', { length: 255 }).notNull(),
  imageId: varchar('image_id', { length: 255 }).notNull(), // Added Cloudinary public ID for image
  caption: varchar('caption', { length: 255 }),
  isFeatured: boolean('is_featured').default(false), // Menandai gambar unggulan/showcase
  sortOrder: int('sort_order').default(0), // Urutan tampilan
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => {
  return {
    bookIdIdx: index('book_id_idx').on(table.bookId),
    sortOrderIdx: index('sort_order_idx').on(table.sortOrder),
  }
});

// Definisi relasi one-to-many antara books dan bookImages
export const booksRelations = relations(books, ({ many }) => ({
  images: many(bookImages)
}));

// Definisi relasi many-to-one antara bookImages dan books
export const bookImagesRelations = relations(bookImages, ({ one }) => ({
  book: one(books, {
    fields: [bookImages.bookId],
    references: [books.id]
  })
}));


// ✅ Reviews Table
export const reviews = mysqlTable('reviews_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  bookId: varchar('book_id', { length: 36 }).notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  userId: varchar('user_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  review: text('review').notNull(),
  rating: tinyint('rating').notNull(), // 1-5
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => {
  return {
    bookUserIdx: index('book_user_idx').on(table.bookId, table.userId),
  }
});

// ✅ Cart Table
export const carts = mysqlTable('carts_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar('user_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// ✅ Cart Items
export const cartItems = mysqlTable('cart_items_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  cartId: varchar('cart_id', { length: 36 }).notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  bookId: varchar('book_id', { length: 36 }).notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  quantity: int('quantity').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => {
  return {
    cartBookIdx: index('cart_book_idx').on(table.cartId, table.bookId),
  }
});

// ✅ Orders
export const orders = mysqlTable('orders_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar('user_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
  totalPrice: int('total_price').notNull(),
  shippingAddress: text('shipping_address'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentStatus: varchar('payment_status', { length: 20 }).default('unpaid'), // 'unpaid', 'paid', 'refunded'
  trackingNumber: varchar('tracking_number', { length: 100 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => {
  return {
    userIdx: index('user_idx').on(table.userId),
    statusIdx: index('status_idx').on(table.status),
  }
});

// ✅ Order Items
export const orderItems = mysqlTable('order_items_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  orderId: varchar('order_id', { length: 36 }).notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  bookId: varchar('book_id', { length: 36 }).notNull()
    .references(() => books.id),
  title: varchar('title', { length: 255 }).notNull(), // Snapshot dari buku
  quantity: int('quantity').notNull(),
  price: int('price').notNull(), // Snapshot harga saat order
  type: varchar('type', { length: 20 }).notNull(), // 'digital' | 'physical'
  downloadUrl: varchar('download_url', { length: 255 }), // Untuk buku digital
  downloadId: varchar('download_id', { length: 255 }), // Added Cloudinary public ID for downloadable file
  downloadCount: int('download_count').default(0), // Jumlah unduhan untuk buku digital
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    orderIdx: index('order_idx').on(table.orderId),
  }
});

// ✅ Notifications Table
export const notifications = mysqlTable('notifications_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar('user_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  link: varchar('link', { length: 255 }), // Link untuk navigasi 
  type: varchar('type', { length: 50 }).notNull(), // 'order', 'system', 'promotion', 'chat', etc.
  entityId: varchar('entity_id', { length: 36 }), // ID terkait, misalnya order_id
  entityType: varchar('entity_type', { length: 50 }), // Tipe entitas, misalnya 'order', 'book', etc.
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    userIdx: index('user_idx').on(table.userId),
    entityIdx: index('entity_idx').on(table.entityId, table.entityType),
  }
});

// ✅ Wishlist
export const wishlist = mysqlTable('wishlist_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar('user_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bookId: varchar('book_id', { length: 36 }).notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    userBookIdx: index('user_book_idx').on(table.userId, table.bookId),
  }
});

// ✅ Transactions - untuk tracking pembayaran
export const transactions = mysqlTable('transactions_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  orderId: varchar('order_id', { length: 36 }).notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  paymentId: varchar('payment_id', { length: 100 }), // ID dari payment gateway
  amount: int('amount').notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('IDR'),
  status: varchar('status', { length: 20 }).notNull(), // 'pending', 'success', 'failed', 'refunded'
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentDetails: text('payment_details'), // JSON data
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => {
  return {
    orderIdx: index('order_idx').on(table.orderId),
  }
});

// ✅ Book Questions - untuk tanya jawab umum antara pembeli dan penjual
export const bookQuestions = mysqlTable('book_questions_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  bookId: varchar('book_id', { length: 36 }).notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  askerId: varchar('asker_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Pengguna yang bertanya
  sellerId: varchar('seller_id', { length: 36 }).notNull()
    .references(() => users.id), // Penjual buku
  question: text('question').notNull(), // Pertanyaan yang diajukan
  answer: text('answer'), // Jawaban dari penjual
  isAnswered: boolean('is_answered').notNull().default(false),
  isPublic: boolean('is_public').notNull().default(true), // Apakah pertanyaan ditampilkan publik
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => {
  return {
    bookIdx: index('book_idx').on(table.bookId),
    askerIdx: index('asker_idx').on(table.askerId),
    sellerIdx: index('seller_idx').on(table.sellerId),
  }
});

// ✅ Chat Rooms - untuk ruang chat antara pembeli dan penjual
export const chatRooms = mysqlTable('chat_rooms_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  bookId: varchar('book_id', { length: 36 })
    .references(() => books.id, { onDelete: "cascade" }),
  buyerId: varchar('buyer_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerId: varchar('seller_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lastMessage: text('last_message'),
  lastMessageAt: timestamp('last_message_at'),
  buyerUnreadCount: int('buyer_unread_count').notNull().default(0),
  sellerUnreadCount: int('seller_unread_count').notNull().default(0),
  status: varchar('status', { length: 20 }).notNull().default('active'), // 'active', 'archived', 'blocked'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => {
  return {
    bookIdx: index('book_idx').on(table.bookId),
    buyerIdx: index('buyer_idx').on(table.buyerId),
    sellerIdx: index('seller_idx').on(table.sellerId),
    lastMessageIdx: index('last_message_idx').on(table.lastMessageAt),
  }
});

// ✅ Chat Messages - untuk pesan dalam chat
export const chatMessages = mysqlTable('chat_messages_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  roomId: varchar('room_id', { length: 36 }).notNull()
    .references(() => chatRooms.id, { onDelete: "cascade" }),
  senderId: varchar('sender_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: varchar('receiver_id', { length: 36 }).notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  attachmentUrl: varchar('attachment_url', { length: 255 }), // File yang dikirim jika ada
  attachmentId: varchar('attachment_id', { length: 255 }), // Added Cloudinary public ID for attachment
  attachmentType: varchar('attachment_type', { length: 50 }), // 'image', 'pdf', etc.
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    roomIdx: index('room_idx').on(table.roomId),
    senderIdx: index('sender_idx').on(table.senderId),
    receiverIdx: index('receiver_idx').on(table.receiverId),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
  }
});

// ✅ Discounts Table
export const discounts = mysqlTable('discounts_table', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  code: varchar('code', { length: 50 }).notNull().unique(), // Discount code
  type: varchar('type', { length: 20 }).notNull(), // 'percentage' | 'fixed'
  value: float('value').notNull(), // Discount value (e.g., percentage or fixed amount)
  minPurchaseAmount: int('min_purchase_amount'), // Minimum purchase amount to apply discount
  startDate: timestamp('start_date').notNull().defaultNow(), // Default ke waktu sekarang
  endDate: timestamp('end_date').notNull().default(sql`DATE_ADD(NOW(), INTERVAL 30 DAY)`), // Default 30 hari dari sekarang
  isActive: boolean('is_active').notNull().default(true), // Whether the discount is currently active
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
}, (table) => {
  return {
    codeIdx: index('code_idx').on(table.code), // Index on the discount code for faster lookups
    activeIdx: index('active_idx').on(table.isActive), // Index to quickly filter active discounts
  }
});

// ✅ Discounted Books Table (Many-to-Many Relationship between Discounts and Books)
export const discountBooks = mysqlTable('discount_books_table', {
  discountId: varchar('discount_id', { length: 36 }).notNull()
    .references(() => discounts.id, { onDelete: "cascade" }),
  bookId: varchar('book_id', { length: 36 }).notNull()
    .references(() => books.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    discountBookIdx: index('discount_book_idx').on(table.discountId, table.bookId), // Composite index for faster queries
  }
});

// ✅ Discounted Categories Table (Many-to-Many Relationship between Discounts and Categories)
export const discountCategories = mysqlTable('discount_categories_table', {
  discountId: varchar('discount_id', { length: 36 }).notNull()
    .references(() => discounts.id, { onDelete: "cascade" }),
  categoryId: varchar('category_id', { length: 36 }).notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    discountCategoryIdx: index('discount_category_idx').on(table.discountId, table.categoryId), // Composite index for faster queries
  }
});