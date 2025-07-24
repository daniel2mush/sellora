import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

/// --- Enum for Order Table ---

const statusEnum = pgEnum("status", ["pending", "rejected", "completed"]);
const categoryEnum = pgEnum("category", [
  "psd",
  "photo",
  "png",
  "svg",
  "template",
  "vector",
]);

/// --- User Table ---

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

/// --- Session Table ---

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

/// --- Account Table ---

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

/// --- Verification Table ---

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

/// --- Products Table ---

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  isPublished: boolean("is_published").default(false),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

/// --- Assets Table --- ///

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    url: text("url").notNull(),
    publicId: text("public_id").notNull(), // Cloudinary ID
    type: text("type"), // pdf, zip, etc.
    category: categoryEnum("category").notNull(),
    size: integer("size"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
  },
  (table) => ({
    categoryIdx: index("category_idx").on(table.category),
  })
);

/// --- Orders Table ---

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  totalAmount: integer("total_amount").notNull(),
  status: statusEnum("status").default("pending"), // or 'pending'
  paypalOrderId: text("paypal_order_id").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});

/// --- Order Items Table  -----

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
});

// --- Download Table ---

export const downloads = pgTable("downloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  assetId: uuid("asset_id")
    .references(() => assets.id)
    .notNull(),
  downloadedAt: timestamp("downloaded_at").$defaultFn(() => new Date()),
});

// relations

//----- User Relations --------
export const UserRelations = relations(user, ({ one, many }) => {
  return {
    sessions: many(session),
    accounts: many(account),
    products: many(products),
    orders: many(orders),
    downloads: many(downloads),
  };
});

// ----- Session Relations -------
export const SessionRelations = relations(session, ({ one }) => {
  return {
    user: one(user, {
      fields: [session.userId],
      references: [user.id],
    }),
  };
});

// --- Account Relations ------

export const AccountRelations = relations(account, ({ one }) => {
  return {
    user: one(user, {
      fields: [account.userId],
      references: [user.id],
    }),
  };
});

/// --- Product Relations ------

export const ProductRelations = relations(products, ({ many, one }) => {
  return {
    user: one(user, {
      fields: [products.userId],
      references: [user.id],
    }),
    assets: many(assets),
    orderItems: many(orderItems),
  };
});

// ---- Assets Relations -----

export const AssetRelations = relations(assets, ({ one, many }) => {
  return {
    product: one(products, {
      fields: [assets.productId],
      references: [products.id],
    }),
    downloads: many(downloads),
  };
});

// --- Order Relations -----

export const OrdersRelations = relations(orders, ({ one, many }) => {
  return {
    user: one(user, {
      fields: [orders.userId],
      references: [user.id],
    }),
    orderItems: many(orderItems),
  };
});

// --- Order items relations ----

export const OrderItemsRelations = relations(orderItems, ({ one }) => {
  return {
    order: one(orders, {
      fields: [orderItems.orderId],
      references: [orders.id],
    }),
    product: one(products, {
      fields: [orderItems.productId],
      references: [products.id],
    }),
  };
});

// --- Download Relations ----

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
  };
});
