import { faker } from "@faker-js/faker";
import { PrismaClient, ProductType } from "../lib/generated/prisma";
import { mainCategories } from "@/constants/categories";

const prisma = new PrismaClient();

// Picks a random category path (main, sub, subSub) from mainCategories
function pickRandomCategory() {
  const main = faker.helpers.arrayElement(mainCategories);
  const sub = main.sub ? faker.helpers.arrayElement(main.sub) : null;
  const subSub = sub?.sub ? faker.helpers.arrayElement(sub.sub) : null;

  return {
    main: main.id,
    sub: sub?.id ?? null,
    subSub: subSub?.id ?? null,
  };
}

async function main() {
  // Create a seed user
  const user = await prisma.user.upsert({
    where: { userName: "seed_seller" },
    update: {},
    create: {
      userName: "seed_seller",
      email: "seed_seller@example.com",
      location: "10 Rue de Rivoli, 75004 Paris, France",
      latitude: 48.8555,
      longitude: 2.357,
      street: "10 Rue de Rivoli",
      city: "Paris",
      state: "Île-de-France",
      postalCode: "75004",
      countryCode: "FR",
      avatar: "/default-user.png",
    },
  });

  // Predefined image URLs to be randomly assigned to products
  const imagePool = [
    "https://imagedelivery.net/D1tmCeHaZw3ssCcAXbxakA/7ecab0e8-d514-4465-a3b8-8ecd8de6f100",
    "https://imagedelivery.net/D1tmCeHaZw3ssCcAXbxakA/82309ec5-8b96-4ef1-5dc0-fa3220b3e200",
    "https://imagedelivery.net/D1tmCeHaZw3ssCcAXbxakA/13d8f9d4-e33d-4874-16b7-d2aec122ef00",
    "https://imagedelivery.net/D1tmCeHaZw3ssCcAXbxakA/20244ba3-155a-4050-d90e-facf7638fb00",
    "https://imagedelivery.net/D1tmCeHaZw3ssCcAXbxakA/aa0fe5d7-3a7d-4d60-6e2e-e800156f5a00",
  ];

  const COUNT = 30;

  // Generate product data
  const productsData = Array.from({ length: COUNT }).map((_, i) => {
    const category = pickRandomCategory();

    const type = faker.helpers.weightedArrayElement<ProductType>([
      { weight: 7, value: "SALE" },
      { weight: 2, value: "FREE" },
      { weight: 1, value: "WANTED" },
    ]);

    const isFree = type === "FREE";
    const isWanted = type === "WANTED";
    const price = isFree
      ? 0
      : isWanted
      ? 0
      : faker.number.int({ min: 5, max: 500 });

    // Random image selection for photos
    const shuffled = faker.helpers.shuffle(imagePool);
    const numPhotos = faker.number.int({ min: 1, max: 3 });
    const photos = shuffled.slice(0, numPhotos);

    return {
      title: `${faker.commerce.productName()} ${i + 1}`,
      price,
      photo: photos[0],
      description: faker.commerce.productDescription(),
      location: "10 Rue de Rivoli, 75004 Paris, France",
      latitude: 48.8555,
      longitude: 2.357,
      street: "10 Rue de Rivoli",
      city: "Paris",
      state: "Île-de-France",
      postalCode: "75004",
      countryCode: "FR",
      type,
      categoryMain: category.main,
      categorySub: category.sub,
      categorySubSub: category.subSub,
      userId: user.id,
      photos: {
        create: photos.map((url) => ({ url })),
      },
    };
  });

  await prisma.$transaction(
    productsData.map((data) => prisma.product.create({ data }))
  );

  console.log(`✅ Seeded ${COUNT} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
