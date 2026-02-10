import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { check, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { Product } from "@/types/product.types";
import type { SlotPosition } from "@/types/slot.types";

export const slotsTable = sqliteTable(
	"slots_table",
	{
		id: int().$type<SlotPosition>().primaryKey(),
		product_id: int()
			.references(() => productsTable.id)
			.notNull()
			.unique(),
		stock: int().notNull(), // how many items are currently in the slot
		capacity: int().notNull(), // maximum items the slot can hold
	},
	(table) => [
		check("position_check", sql`${table.id} BETWEEN 1 AND 9`),
		check("stock_check", sql`${table.stock} <= ${table.capacity}`),
	],
);

export const productsTable = sqliteTable("products_table", {
	id: int().primaryKey({
		autoIncrement: true,
	}),
	name: text().$type<Product>().notNull().unique(),
	price: int().notNull(),
});

export const productRealtions = relations(productsTable, ({ many }) => ({
	solts: many(slotsTable),
}));

export const slotsRelations = relations(slotsTable, ({ one }) => ({
	product: one(productsTable, {
		fields: [slotsTable.product_id],
		references: [productsTable.id],
	}),
}));

export type Products = InferSelectModel<typeof productsTable>;
export type Slots = InferSelectModel<typeof slotsTable>;
