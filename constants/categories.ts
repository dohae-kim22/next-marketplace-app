export interface Category {
  name: string;
  sub?: Category[];
}

export const mainCategories: Category[] = [
  {
    name: "Men's Fashion",
    sub: [
      {
        name: "Tops",
        sub: [
          { name: "T-Shirts" },
          { name: "Shirts" },
          { name: "Sweaters" },
          { name: "Jackets" },
          { name: "Other" },
        ],
      },
      {
        name: "Bottoms",
        sub: [
          { name: "Jeans" },
          { name: "Pants" },
          { name: "Shorts" },
          { name: "Other" },
        ],
      },
      {
        name: "Shoes",
        sub: [
          { name: "Sneakers" },
          { name: "Formal Shoes" },
          { name: "Boots" },
          { name: "Other" },
        ],
      },
      {
        name: "Accessories",
        sub: [
          { name: "Watches" },
          { name: "Bags" },
          { name: "Hats" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Women's Fashion",
    sub: [
      {
        name: "Tops",
        sub: [
          { name: "Blouses" },
          { name: "T-Shirts" },
          { name: "Sweaters" },
          { name: "Jackets" },
          { name: "Other" },
        ],
      },
      {
        name: "Bottoms",
        sub: [
          { name: "Jeans" },
          { name: "Skirts" },
          { name: "Pants" },
          { name: "Other" },
        ],
      },
      {
        name: "Shoes",
        sub: [
          { name: "Heels" },
          { name: "Flats" },
          { name: "Sneakers" },
          { name: "Boots" },
          { name: "Other" },
        ],
      },
      {
        name: "Accessories",
        sub: [
          { name: "Bags" },
          { name: "Jewelry" },
          { name: "Hats & Scarves" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Electronics",
    sub: [
      {
        name: "Phones & Tablets",
        sub: [
          { name: "Mobile Phones" },
          { name: "Tablets" },
          { name: "Accessories" },
          { name: "Other" },
        ],
      },
      {
        name: "Computers",
        sub: [
          { name: "Laptops" },
          { name: "Desktops" },
          { name: "Monitors" },
          { name: "Other" },
        ],
      },
      {
        name: "Cameras",
        sub: [
          { name: "DSLR" },
          { name: "Mirrorless" },
          { name: "Compact" },
          { name: "Other" },
        ],
      },
      {
        name: "Audio",
        sub: [
          { name: "Headphones" },
          { name: "Speakers" },
          { name: "Home Audio" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Cars & Motorbikes",
    sub: [
      {
        name: "Cars",
        sub: [
          { name: "Sedans" },
          { name: "SUVs" },
          { name: "Electric Cars" },
          { name: "Classic Cars" },
          { name: "Other" },
        ],
      },
      {
        name: "Motorbikes",
        sub: [
          { name: "Scooters" },
          { name: "Sport Bikes" },
          { name: "Cruisers" },
          { name: "Other" },
        ],
      },
      {
        name: "Bicycles & Scooters",
        sub: [
          { name: "Mountain Bikes" },
          { name: "Road Bikes" },
          { name: "E-Bikes" },
          { name: "Kick Scooters" },
          { name: "Other" },
        ],
      },
      {
        name: "Vehicle Accessories",
        sub: [
          { name: "Tires" },
          { name: "Helmets" },
          { name: "Tools & Parts" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Furniture",
    sub: [
      {
        name: "Living Room",
        sub: [
          { name: "Sofas" },
          { name: "Tables" },
          { name: "Chairs" },
          { name: "Other" },
        ],
      },
      {
        name: "Bedroom",
        sub: [
          { name: "Beds" },
          { name: "Dressers" },
          { name: "Nightstands" },
          { name: "Other" },
        ],
      },
      {
        name: "Office",
        sub: [
          { name: "Desks" },
          { name: "Chairs" },
          { name: "Storage" },
          { name: "Other" },
        ],
      },
      {
        name: "Garden",
        sub: [
          { name: "Outdoor Chairs" },
          { name: "Tables" },
          { name: "Benches" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Home Appliances",
    sub: [
      {
        name: "Kitchen",
        sub: [
          { name: "Microwaves" },
          { name: "Ovens" },
          { name: "Blenders" },
          { name: "Other" },
        ],
      },
      {
        name: "Cleaning",
        sub: [{ name: "Vacuum Cleaners" }, { name: "Mops" }, { name: "Other" }],
      },
      {
        name: "Climate",
        sub: [
          { name: "Heaters" },
          { name: "Fans" },
          { name: "Air Conditioners" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Books",
    sub: [
      {
        name: "Fiction",
        sub: [
          { name: "Novels" },
          { name: "Short Stories" },
          { name: "Fantasy" },
          { name: "Other" },
        ],
      },
      {
        name: "Non-Fiction",
        sub: [
          { name: "History" },
          { name: "Science" },
          { name: "Self-Help" },
          { name: "Other" },
        ],
      },
      {
        name: "Comics & Manga",
        sub: [
          { name: "Comics" },
          { name: "Manga" },
          { name: "Graphic Novels" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Sports & Outdoors",
    sub: [
      {
        name: "Fitness",
        sub: [
          { name: "Gym Equipment" },
          { name: "Weights" },
          { name: "Yoga" },
          { name: "Other" },
        ],
      },
      {
        name: "Outdoor",
        sub: [
          { name: "Camping" },
          { name: "Hiking" },
          { name: "Fishing" },
          { name: "Other" },
        ],
      },
      {
        name: "Cycling Gear",
        sub: [
          { name: "Helmets" },
          { name: "Clothing" },
          { name: "Accessories" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Toys & Games",
    sub: [
      {
        name: "Action Figures",
        sub: [
          { name: "Collectibles" },
          { name: "Superheroes" },
          { name: "Other" },
        ],
      },
      {
        name: "Board Games",
        sub: [{ name: "Family" }, { name: "Strategy" }, { name: "Other" }],
      },
      {
        name: "Puzzles",
        sub: [{ name: "Jigsaw" }, { name: "3D Puzzles" }, { name: "Other" }],
      },
    ],
  },
  {
    name: "Pet Supplies",
    sub: [
      {
        name: "Food",
        sub: [{ name: "Dog Food" }, { name: "Cat Food" }, { name: "Other" }],
      },
      {
        name: "Toys",
        sub: [
          { name: "Chew Toys" },
          { name: "Interactive Toys" },
          { name: "Other" },
        ],
      },
      {
        name: "Accessories",
        sub: [
          { name: "Leashes" },
          { name: "Beds" },
          { name: "Bowls" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Baby & Kids",
    sub: [
      {
        name: "Clothing",
        sub: [
          { name: "0–2Y" },
          { name: "3–5Y" },
          { name: "6–12Y" },
          { name: "Other" },
        ],
      },
      {
        name: "Toys",
        sub: [
          { name: "Educational" },
          { name: "Plush" },
          { name: "Outdoor" },
          { name: "Other" },
        ],
      },
      {
        name: "Gear",
        sub: [
          { name: "Strollers" },
          { name: "Car Seats" },
          { name: "High Chairs" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Beauty & Personal Care",
    sub: [
      {
        name: "Skincare",
        sub: [{ name: "Face" }, { name: "Body" }, { name: "Other" }],
      },
      {
        name: "Haircare",
        sub: [
          { name: "Shampoo" },
          { name: "Styling" },
          { name: "Tools" },
          { name: "Other" },
        ],
      },
      {
        name: "Makeup",
        sub: [
          { name: "Eyes" },
          { name: "Lips" },
          { name: "Face" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Musical Instruments & Gear",
    sub: [
      {
        name: "Instruments",
        sub: [
          { name: "Guitar" },
          { name: "Piano" },
          { name: "Violin" },
          { name: "Other" },
        ],
      },
      {
        name: "DJ & Audio Equipment",
        sub: [{ name: "Mixers" }, { name: "Speakers" }, { name: "Other" }],
      },
      {
        name: "Accessories",
        sub: [{ name: "Stands" }, { name: "Cases" }, { name: "Other" }],
      },
    ],
  },
  {
    name: "Garden & DIY",
    sub: [
      {
        name: "Tools",
        sub: [
          { name: "Power Tools" },
          { name: "Hand Tools" },
          { name: "Other" },
        ],
      },
      {
        name: "Garden",
        sub: [
          { name: "Plants" },
          { name: "Pots" },
          { name: "Outdoor Furniture" },
          { name: "Other" },
        ],
      },
      {
        name: "DIY Materials",
        sub: [{ name: "Wood" }, { name: "Paint" }, { name: "Other" }],
      },
    ],
  },
  {
    name: "Tickets & Vouchers",
    sub: [
      {
        name: "Events",
        sub: [
          { name: "Concerts" },
          { name: "Festivals" },
          { name: "Theater" },
          { name: "Other" },
        ],
      },
      {
        name: "Travel",
        sub: [
          { name: "Flights" },
          { name: "Trains" },
          { name: "Bus" },
          { name: "Other" },
        ],
      },
      {
        name: "Sports",
        sub: [{ name: "Football" }, { name: "Basketball" }, { name: "Other" }],
      },
    ],
  },
];
