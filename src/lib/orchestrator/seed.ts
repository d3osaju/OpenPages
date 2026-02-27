import { prisma } from "../prisma";

async function main() {
    console.log("Seeding database with mock websites...");

    await prisma.website.createMany({
        data: [
            {
                name: "neon-launch-842",
                githubUrl: "https://github.com/syndicayte/neon-launch-842",
                vercelUrl: "neon-launch-842.openpages.zetalabs.in",
                status: "DEPLOYED",
                screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
            },
            {
                name: "swift-forge-115",
                githubUrl: "https://github.com/syndicayte/swift-forge-115",
                status: "PENDING",
            },
            {
                name: "ultra-wave-993",
                githubUrl: "https://github.com/syndicayte/ultra-wave-993",
                vercelUrl: "ultra-wave-993.openpages.zetalabs.in",
                status: "FAILED",
            }
        ]
    });

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
