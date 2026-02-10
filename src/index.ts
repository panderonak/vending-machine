import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline/promises";
import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { type Products, slotsTable } from "@/db/schema";

class VendingMachine {
	denominations: number[];
	selectedProduct: Products | null;
	balance: number;

	constructor() {
		this.denominations = [500, 200, 100, 50, 20, 10, 5, 2, 1];
		this.selectedProduct = null;
		this.balance = 0;
	}

	async selectProduct(slotPosition: number) {
		const slot = await db.query.slotsTable.findFirst({
			where: ({ id, stock }, { and, eq, gt }) =>
				and(eq(id, slotPosition), gt(stock, 0)),
			with: {
				product: true,
			},
		});

		if (!slot) {
			return {
				success: false,
				message: "Selected product is not available.",
			};
		}

		const product = slot.product;

		this.selectedProduct = product;

		return {
			success: true,
			message: `${product.name} costs ₹${product.price}. Please insert the amount.`,
		};
	}

	async insertCash(cash: number) {
		if (!this.selectedProduct) {
			return {
				success: false,
				message: "Select an item before inserting cash.",
			};
		}

		if (cash <= 0 || !Number.isFinite(cash)) {
			return {
				success: false,
				message: "Invalid cash. Please insert a supported note or coin.",
			};
		}

		this.balance += cash;

		if (this.selectedProduct.price > this.balance) {
			const remainingAmount = this.selectedProduct.price - this.balance;

			return {
				success: true,
				message: `Amount received: ₹${this.balance}. Please insert ₹${remainingAmount} more.`,
			};
		}

		return await this.dispance();
	}

	async dispance() {
		if (!this.selectedProduct) {
			return {
				success: false,
				message: "Product is not selected.",
			};
		}

		await db
			.update(slotsTable)
			.set({ stock: sql`${slotsTable.stock} - 1` })
			.where(
				and(
					eq(slotsTable.product_id, this.selectedProduct.id),
					gt(slotsTable.stock, 0),
				),
			);

		if (this.balance > this.selectedProduct.price) {
			const change = this.calculateChange();

			this.balance = 0;
			this.selectedProduct = null;

			if (Array.isArray(change)) {
				return {
					success: true,
					message: `Product has been dispanced. Please collect your change: ₹${change.join(", ")}`,
				};
			}

			return change;
		}

		return {
			success: true,
			message: "Product has been dispanced.",
		};
	}

	calculateChange() {
		if (!this.selectedProduct) {
			return {
				success: false,
				message: "Product is not selected.",
			};
		}

		let changeAmount = this.balance - this.selectedProduct.price;

		const change = [];

		for (const denomination of this.denominations) {
			while (changeAmount >= denomination) {
				change.push(denomination);
				changeAmount -= denomination;
			}
		}

		return change;
	}
}

const main = async () => {
	console.log("🧃 Welcome to the Vending Machine");
	const rl = readline.createInterface({ input, output });

	const vm = new VendingMachine();

	const slots = await db.query.slotsTable.findMany({
		with: {
			product: true,
		},
	});

	console.log("\n📦 Available Products");
	console.log("------------------------------------------------");
	console.log("Slot  Name               Price   Stock");
	console.log("------------------------------------------------");

	for (const slot of slots) {
		const id = String(slot.id).padEnd(4);
		const name = slot.product.name.padEnd(18);
		const price = `₹${slot.product.price}`.padEnd(8);
		const stock = String(slot.stock).padEnd(5);

		console.log(`${id}  ${name}  ${price}  ${stock}`);
	}

	console.log(`
==========================
1. Select product
2. Insert cash
3. Exit
==========================
    `);

	while (true) {
		const choice = await rl.question("Choose an option: ");

		switch (choice.trim()) {
			case "1": {
				const slot = await rl.question("Select slot position: ");
				const result = await vm.selectProduct(Number(slot));
				console.log(`${result.message}\n`);
				break;
			}

			case "2": {
				const cash = await rl.question("Insert cash: ");
				const result = await vm.insertCash(Number(cash));
				console.log(`${result.message}\n`);
				break;
			}

			case "3": {
				console.log("👋🏻 Thank you! Have a great day.");
				rl.close();
				return;
			}

			default:
				console.log("Invalid option");
				break;
		}
	}
};

main();
