import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  pgEnum,
  index,
  varchar,
  primaryKey,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

/// --- Enum for Purchase Table ---

const statusEnum = pgEnum('status', ['pending', 'rejected', 'completed'])
const categoryEnum = pgEnum('category', ['psd', 'photo', 'png', 'svg', 'template', 'vector'])

/// --- User Table ---

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  username: text('username').unique(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
})

/// --- Session Table ---

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
})

/// --- Account Table ---

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

/// --- Verification Table ---

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

/// --- Products Table ---

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  isPublished: boolean('is_published').default(false),
  thumbnailUrl: text('thumbnail_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

/// --- Assets Table --- ///

export const assets = pgTable(
  'assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
      .references(() => products.id)
      .notNull(),
    url: text('url').notNull(),
    publicId: text('public_id').notNull(),
    type: text('type'),
    category: categoryEnum('category').notNull(),
    size: integer('size'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (table) => ({
    categoryIdx: index('category_idx').on(table.category),
  })
)

/// --- Purchases Table ---

export const purchase = pgTable('purchase', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  totalAmount: integer('total_amount').notNull(),
  status: statusEnum('status').default('pending'),
  paypalOrderId: text('paypal_order_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

/// --- Purchase Items Table  -----

export const purchaseItems = pgTable('purchase_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  purchaseId: uuid('purchase_id')
    .references(() => purchase.id)
    .notNull(),
  productId: uuid('product_id')
    .references(() => products.id)
    .notNull(),
  price: integer('price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

// --- Download Table ---

export const downloads = pgTable('downloads', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  assetId: uuid('asset_id')
    .references(() => assets.id)
    .notNull(),
  downloadedAt: timestamp('downloaded_at').defaultNow(),
})

// -- Invoice table

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),

  purchaseId: uuid('purchase_id')
    .notNull()
    .references(() => purchase.id, { onDelete: 'cascade' }),

  buyerId: text('buyer_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  sellerId: text('seller_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  invoiceNumber: text('invoice_number').notNull().unique(),
  issueDate: timestamp('issue_date').defaultNow().notNull(),

  subtotal: integer('subtotal').notNull(),
  tax: integer('tax').default(0),
  total: integer('total').notNull(),

  currency: text('currency').default('USD').notNull(),
  status: text('status').default('paid').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

// ---- Collections Table ------

export const collections = pgTable(
  'collections',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),

    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    collectionName: varchar('collection_name', { length: 155 }).notNull(),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  },
  (table) => {
    return {
      userCollectionIndex: index('user_collection_idx').on(table.userId),
    }
  }
)

// --- Collection items
export const collectionItems = pgTable(
  'collection_items',
  {
    collectionId: uuid('collection_id')
      .references(() => collections.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.collectionId, table.productId] }),
    }
  }
)

// --- likes Table

export const likes = pgTable(
  'likes',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),

    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  },
  (table) => {
    return {
      uniqueUserProduct: uniqueIndex('user_product_unique').on(table.userId, table.productId),
    }
  }
)

// ------ Follow Table -------

export const follow = pgTable(
  'follow',
  {
    followerId: text('follower_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    adminId: text('admin_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),

    isFollowing: boolean('is_following').default(true).notNull(),

    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.followerId, table.adminId] }),
      followIndex: index('follow_idx').on(table.followerId, table.adminId),
    }
  }
)

// relations

export const UserRelations = relations(user, ({ many }) => {
  return {
    sessions: many(session),
    accounts: many(account),
    products: many(products),
    purchase: many(purchase),
    downloads: many(downloads),
    invoiceBuyer: many(invoices, {
      relationName: 'buyer',
    }),
    invoiceSeller: many(invoices, {
      relationName: 'seller',
    }),
    followers: many(follow, { relationName: 'followers' }),
    following: many(follow, { relationName: 'following' }),
    likes: many(likes),
    collections: many(collections),
  }
})

export const SessionRelations = relations(session, ({ one }) => {
  return {
    user: one(user, {
      fields: [session.userId],
      references: [user.id],
    }),
  }
})

export const AccountRelations = relations(account, ({ one }) => {
  return {
    user: one(user, {
      fields: [account.userId],
      references: [user.id],
    }),
  }
})

export const ProductRelations = relations(products, ({ many, one }) => {
  return {
    user: one(user, {
      fields: [products.userId],
      references: [user.id],
    }),
    assets: many(assets),
    purchaseItems: many(purchaseItems),
    likes: many(likes),
    collectionItems: many(collectionItems),
  }
})

export const AssetRelations = relations(assets, ({ one, many }) => {
  return {
    product: one(products, {
      fields: [assets.productId],
      references: [products.id],
    }),
    downloads: many(downloads),
  }
})

export const purchaseRelations = relations(purchase, ({ one, many }) => {
  return {
    user: one(user, {
      fields: [purchase.userId],
      references: [user.id],
    }),
    purchaseItems: many(purchaseItems),
    invoice: many(invoices),
  }
})

export const purchaseItemsRelations = relations(purchaseItems, ({ one }) => {
  return {
    purchase: one(purchase, {
      fields: [purchaseItems.purchaseId],
      references: [purchase.id],
    }),
    product: one(products, {
      fields: [purchaseItems.productId],
      references: [products.id],
    }),
  }
})

export const DownloadRelations = relations(downloads, ({ one }) => {
  return {
    user: one(user, {
      fields: [downloads.userId],
      references: [user.id],
    }),

    asset: one(assets, {
      fields: [downloads.assetId],
      references: [assets.id],
    }),
  }
})

export const InvoiceRelations = relations(invoices, ({ one }) => ({
  buyer: one(user, {
    fields: [invoices.buyerId],
    references: [user.id],
    relationName: 'buyer',
  }),
  seller: one(user, {
    fields: [invoices.sellerId],
    references: [user.id],
    relationName: 'seller',
  }),
  purchase: one(purchase, {
    fields: [invoices.purchaseId],
    references: [purchase.id],
  }),
}))

export const followsRelations = relations(follow, ({ one }) => {
  return {
    admin: one(user, {
      fields: [follow.adminId],
      references: [user.id],
      relationName: 'follower',
    }),
    follower: one(user, {
      fields: [follow.followerId],
      references: [user.id],
      relationName: 'following',
    }),
  }
})

export const likesRelation = relations(likes, ({ one }) => {
  return {
    user: one(user, {
      fields: [likes.userId],
      references: [user.id],
    }),
    product: one(products, {
      fields: [likes.productId],
      references: [products.id],
    }),
  }
})

export const collectionRelations = relations(collections, ({ one, many }) => {
  return {
    user: one(user, {
      fields: [collections.userId],
      references: [user.id],
    }),
    items: many(collectionItems),
  }
})
export const collectionItemsRelations = relations(collectionItems, ({ one }) => {
  return {
    collection: one(collections, {
      fields: [collectionItems.collectionId],
      references: [collections.id],
    }),
    product: one(products, {
      fields: [collectionItems.productId],
      references: [products.id],
    }),
  }
})
