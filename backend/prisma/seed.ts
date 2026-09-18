import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma";

async function main() {
	const password = await bcrypt.hash("password123", 12);

	const user = await prisma.user.upsert({
		where: { email: "demo@notlify.com" },
		update: {},
		create: {
			name: "Demo User",
			email: "demo@notlify.com",
			password,
			folders: {
				create: [{ name: "Personal" }, { name: "Work" }],
			},
			tags: {
				create: [{ name: "Ideas" }, { name: "Todo" }],
			},
			notes: {
				create: [
					{
						title: "Welcome to Not-lify",
						content: "<p>This is your first seeded note.</p>",
					},
				],
			},
		},
	});

	console.log(`Seeded user: ${user.email}`);
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
