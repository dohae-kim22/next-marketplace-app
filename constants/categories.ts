export interface Category {
  name: string;
  sub?: Category[];
}

export const mainCategories: Category[] = [
  {
    name: "Women",
    sub: [
      {
        name: "Top",
        sub: [
          { name: "T-Shirts" },
          { name: "Shirts" },
          { name: "Sweaters" },
          { name: "Hoodies" },
          { name: "Jackets" },
          { name: "Coats" },
          { name: "Other" },
        ],
      },
      {
        name: "Bottom",
        sub: [
          { name: "Jeans" },
          { name: "Pants" },
          { name: "Shorts" },
          { name: "Skirts" },
          { name: "Other" },
        ],
      },
      {
        name: "Dresses",
        sub: [{ name: "Casual" }, { name: "Formal" }],
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
          { name: "Belts" },
          { name: "Watches" },
          { name: "Hats" },
          { name: "Jewelry" },
          { name: "Hair Accessories" },
          { name: "Hats" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Men",
    sub: [
      {
        name: "Top",
        sub: [
          { name: "T-Shirts" },
          { name: "Shirts" },
          { name: "Sweaters" },
          { name: "Hoodies" },
          { name: "Jackets" },
          { name: "Coats" },
          { name: "Other" },
        ],
      },
      {
        name: "Bottom",
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
          { name: "Dress Shoes" },
          { name: "Boots" },
          { name: "Other" },
        ],
      },
      {
        name: "Accessories",
        sub: [
          { name: "Bags" },
          { name: "Belts" },
          { name: "Watches" },
          { name: "Jewelry" },
          { name: "Hats" },
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
    name: "Electronics",
    sub: [
      {
        name: "Mobile Devices",
        sub: [
          { name: "Mobile Phones" },
          { name: "Tablets" },
          { name: "Smartwatches" },
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
          { name: "Accessories" },
          { name: "Other" },
        ],
      },
      {
        name: "Home Electronics",
        sub: [
          { name: "TV" },
          { name: "Audio" },
          { name: "Cameras" },
          { name: "Gaming Consoles" },
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
      {
        name: "Education",
        sub: [
          { name: "Textbooks" },
          { name: "Children's Books" },
          { name: "Other" },
        ],
      },
    ],
  },
  {
    name: "Pets",
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
    name: "Vehicles",
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
        name: "Bicycles",
        sub: [
          { name: "Mountain Bikes" },
          { name: "Road Bikes" },
          { name: "E-Bikes" },
          { name: "Kick Scooters" },
          { name: "Other" },
        ],
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
          { name: "Sports" },
          { name: "Theater" },
          { name: "Other" },
        ],
      },
      {
        name: "Coupons and Gift Cards",
        sub: [{ name: "Food" }, { name: "Shopping" }],
      },
    ],
  },
  {
    name: "Local Services",
    sub: [
      {
        name: "Home",
        sub: [
          { name: "Cleaning" },
          { name: "Moving" },
          { name: "Repair" },
          { name: "Other" },
        ],
      },
      {
        name: "Personal",
        sub: [
          { name: "Beauty" },
          { name: "Tutor" },
          { name: "Pet Sittng" },
          { name: "Other" },
        ],
      },
      {
        name: "Event",
        sub: [{ name: "Photography" }, { name: "Rental" }, { name: "Other" }],
      },
    ],
  },
];
