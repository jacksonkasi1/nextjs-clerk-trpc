import { InferModel, relations, sql } from "drizzle-orm";
import { text, sqliteTable, integer, blob } from "drizzle-orm/sqlite-core";

import { tbl_users } from "./users";

export const tbl_usage_metrics = sqliteTable("tbl_usage_metrics", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  external_id: text("external_id")
    .notNull()
    .references(() => tbl_users.external_id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  text_count: integer("text_count").default(0),
  image_count: integer("image_count").default(0),
  magic_ai_count: blob("magic_ai_count", { mode: "json" }).default({
    gpt3: {
      count: 0,
      characters: 0,
    },
    gpt4: {
      count: 0,
      characters: 0,
    },
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export type GPTUsage = {
  gpt3: {
    count: number | null; // Allow null
    characters: number | null; // Allow null
  };
  gpt4: {
    count: number | null; // Allow null
    characters: number | null; // Allow null
  };
};

export type UsageMetrics_ = {
  id: number;
  external_id: string;
  text_count: number; // Allow null
  image_count: number; // Allow null
  magic_ai_count: GPTUsage;
  createdAt: Date | string; // Allow null
  updatedAt: Date | string; // Allow null
};

export const usageMetricsRelations = relations(
  tbl_usage_metrics,
  ({ one }) => ({
    user: one(tbl_users, {
      fields: [tbl_usage_metrics.external_id],
      references: [tbl_users.external_id],
    }),
  }),
);

export type UsageMetrics = InferModel<typeof tbl_usage_metrics>;
