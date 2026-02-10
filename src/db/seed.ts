import { sql } from "drizzle-orm";
import { db } from "@/db/index";
import { productsTable, slotsTable } from "@/db/schema";
import { Product } from "@/types/product.types";
import { ProductCapacity } from "@/types/product-capacity.types";
import { SlotPosition } from "@/types/slot.types";

const main = async () => {
	try {
		await db.insert(productsTable).values([
			{
				name: Product.BottledWater,
				price: 30,
			},
			{
				name: Product.Candy,
				price: 10,
			},
			{
				name: Product.ChocolateBar,
				price: 60,
			},
			{
				name: Product.Cookies,
				price: 20,
			},
			{
				name: Product.Crackers,
				price: 10,
			},
			{
				name: Product.GranolaBar,
				price: 40,
			},
			{
				name: Product.Nuts,
				price: 10,
			},
			{
				name: Product.PotatoChips,
				price: 10,
			},
			{
				name: Product.SoftDrink,
				price: 60,
			},
		]);

		await db.insert(slotsTable).values([
			{
				id: SlotPosition.One,
				product_id: sql`(SELECT id from products_table where name = ${Product.BottledWater})`,
				capacity: ProductCapacity["Bottled Water"],
				stock: ProductCapacity["Bottled Water"],
			},
			{
				id: SlotPosition.Two,
				product_id: sql`(SELECT id from products_table where name = ${Product.Candy})`,
				capacity: ProductCapacity.Candy,
				stock: ProductCapacity.Candy,
			},
			{
				id: SlotPosition.Three,
				product_id: sql`(SELECT id from products_table where name = ${Product.ChocolateBar})`,
				capacity: ProductCapacity["Chocolate Bar"],
				stock: ProductCapacity["Chocolate Bar"],
			},
			{
				id: SlotPosition.Four,
				product_id: sql`(SELECT id from products_table where name = ${Product.Cookies})`,
				capacity: ProductCapacity.Cookies,
				stock: ProductCapacity.Cookies,
			},
			{
				id: SlotPosition.Five,
				product_id: sql`(SELECT id from products_table where name = ${Product.Crackers})`,
				capacity: ProductCapacity.Crackers,
				stock: ProductCapacity.Crackers,
			},
			{
				id: SlotPosition.Six,
				product_id: sql`(SELECT id from products_table where name = ${Product.GranolaBar})`,
				capacity: ProductCapacity["Granola Bar"],
				stock: ProductCapacity["Granola Bar"],
			},
			{
				id: SlotPosition.Seven,
				product_id: sql`(SELECT id from products_table where name = ${Product.Nuts})`,
				stock: ProductCapacity.Nuts,
				capacity: ProductCapacity.Nuts,
			},
			{
				id: SlotPosition.Eight,
				product_id: sql`(SELECT id from products_table where name = ${Product.PotatoChips})`,
				stock: ProductCapacity["Potato Chips"],
				capacity: ProductCapacity["Potato Chips"],
			},
			{
				id: SlotPosition.Nine,
				product_id: sql`(SELECT id from products_table where name = ${Product.SoftDrink})`,
				stock: ProductCapacity["Soft Drink"],
				capacity: ProductCapacity["Soft Drink"],
			},
		]);
		console.log("Products stocked in the inverntory successfully");
	} catch (error) {
		console.error(error);
		console.log("Unable to stock the products in inventory.");
	}
};

main();
