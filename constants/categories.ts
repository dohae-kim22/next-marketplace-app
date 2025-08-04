export interface Category {
  id: string;
  name: { en: string; fr: string };
  slug: string;
  sub?: Category[];
}

export const mainCategories: Category[] = [
  {
    id: "women",
    name: { en: "Women", fr: "Femmes" },
    slug: "women",
    sub: [
      {
        id: "women-tops",
        name: { en: "Tops", fr: "Hauts" },
        slug: "tops",
        sub: [
          {
            id: "women-tshirts",
            name: { en: "T-Shirts", fr: "T-shirts" },
            slug: "t-shirts",
          },
          {
            id: "women-shirts",
            name: { en: "Shirts", fr: "Chemises" },
            slug: "shirts",
          },
          {
            id: "women-sweaters",
            name: { en: "Sweaters", fr: "Pulls" },
            slug: "sweaters",
          },
          {
            id: "women-hoodies",
            name: { en: "Hoodies", fr: "Sweats à capuche" },
            slug: "hoodies",
          },
          {
            id: "women-jackets",
            name: { en: "Jackets", fr: "Vestes" },
            slug: "jackets",
          },
          {
            id: "women-coats",
            name: { en: "Coats", fr: "Manteaux" },
            slug: "coats",
          },
          {
            id: "women-other-tops",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "women-bottoms",
        name: { en: "Bottoms", fr: "Bas" },
        slug: "bottoms",
        sub: [
          {
            id: "women-jeans",
            name: { en: "Jeans", fr: "Jeans" },
            slug: "jeans",
          },
          {
            id: "women-pants",
            name: { en: "Pants", fr: "Pantalons" },
            slug: "pants",
          },
          {
            id: "women-shorts",
            name: { en: "Shorts", fr: "Shorts" },
            slug: "shorts",
          },
          {
            id: "women-skirts",
            name: { en: "Skirts", fr: "Jupes" },
            slug: "skirts",
          },
          {
            id: "women-other-bottoms",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "women-dresses",
        name: { en: "Dresses", fr: "Robes" },
        slug: "dresses",
        sub: [
          {
            id: "women-casual-dresses",
            name: { en: "Casual", fr: "Décontractées" },
            slug: "casual",
          },
          {
            id: "women-formal-dresses",
            name: { en: "Formal", fr: "Habillées" },
            slug: "formal",
          },
        ],
      },
      {
        id: "women-shoes",
        name: { en: "Shoes", fr: "Chaussures" },
        slug: "shoes",
        sub: [
          {
            id: "women-heels",
            name: { en: "Heels", fr: "Talons" },
            slug: "heels",
          },
          {
            id: "women-flats",
            name: { en: "Flats", fr: "Chaussures plates" },
            slug: "flats",
          },
          {
            id: "women-sneakers",
            name: { en: "Sneakers", fr: "Baskets" },
            slug: "sneakers",
          },
          {
            id: "women-boots",
            name: { en: "Boots", fr: "Bottes" },
            slug: "boots",
          },
          {
            id: "women-other-shoes",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "women-accessories",
        name: { en: "Accessories", fr: "Accessoires" },
        slug: "accessories",
        sub: [
          { id: "women-bags", name: { en: "Bags", fr: "Sacs" }, slug: "bags" },
          {
            id: "women-belts",
            name: { en: "Belts", fr: "Ceintures" },
            slug: "belts",
          },
          {
            id: "women-watches",
            name: { en: "Watches", fr: "Montres" },
            slug: "watches",
          },
          {
            id: "women-hats",
            name: { en: "Hats", fr: "Chapeaux" },
            slug: "hats",
          },
          {
            id: "women-jewelry",
            name: { en: "Jewelry", fr: "Bijoux" },
            slug: "jewelry",
          },
          {
            id: "women-hair-accessories",
            name: { en: "Hair Accessories", fr: "Accessoires cheveux" },
            slug: "hair-accessories",
          },
          {
            id: "women-other-accessories",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
  {
    id: "men",
    name: { en: "Men", fr: "Hommes" },
    slug: "men",
    sub: [
      {
        id: "men-tops",
        name: { en: "Tops", fr: "Hauts" },
        slug: "tops",
        sub: [
          {
            id: "men-tshirts",
            name: { en: "T-Shirts", fr: "T-shirts" },
            slug: "t-shirts",
          },
          {
            id: "men-shirts",
            name: { en: "Shirts", fr: "Chemises" },
            slug: "shirts",
          },
          {
            id: "men-sweaters",
            name: { en: "Sweaters", fr: "Pulls" },
            slug: "sweaters",
          },
          {
            id: "men-hoodies",
            name: { en: "Hoodies", fr: "Sweats à capuche" },
            slug: "hoodies",
          },
          {
            id: "men-jackets",
            name: { en: "Jackets", fr: "Vestes" },
            slug: "jackets",
          },
          {
            id: "men-coats",
            name: { en: "Coats", fr: "Manteaux" },
            slug: "coats",
          },
          {
            id: "men-other-tops",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "men-bottoms",
        name: { en: "Bottoms", fr: "Bas" },
        slug: "bottoms",
        sub: [
          {
            id: "men-jeans",
            name: { en: "Jeans", fr: "Jeans" },
            slug: "jeans",
          },
          {
            id: "men-pants",
            name: { en: "Pants", fr: "Pantalons" },
            slug: "pants",
          },
          {
            id: "men-shorts",
            name: { en: "Shorts", fr: "Shorts" },
            slug: "shorts",
          },
          {
            id: "men-other-bottoms",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "men-shoes",
        name: { en: "Shoes", fr: "Chaussures" },
        slug: "shoes",
        sub: [
          {
            id: "men-sneakers",
            name: { en: "Sneakers", fr: "Baskets" },
            slug: "sneakers",
          },
          {
            id: "men-dress-shoes",
            name: { en: "Dress Shoes", fr: "Chaussures habillées" },
            slug: "dress-shoes",
          },
          {
            id: "men-boots",
            name: { en: "Boots", fr: "Bottes" },
            slug: "boots",
          },
          {
            id: "men-other-shoes",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "men-accessories",
        name: { en: "Accessories", fr: "Accessoires" },
        slug: "accessories",
        sub: [
          { id: "men-bags", name: { en: "Bags", fr: "Sacs" }, slug: "bags" },
          {
            id: "men-belts",
            name: { en: "Belts", fr: "Ceintures" },
            slug: "belts",
          },
          {
            id: "men-watches",
            name: { en: "Watches", fr: "Montres" },
            slug: "watches",
          },
          {
            id: "men-jewelry",
            name: { en: "Jewelry", fr: "Bijoux" },
            slug: "jewelry",
          },
          {
            id: "men-hats",
            name: { en: "Hats", fr: "Chapeaux" },
            slug: "hats",
          },
          {
            id: "men-other-accessories",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
  {
    id: "baby-kids",
    name: { en: "Baby & Kids", fr: "Bébés & Enfants" },
    slug: "baby-kids",
    sub: [
      {
        id: "baby-kids-clothing",
        name: { en: "Clothing", fr: "Vêtements" },
        slug: "clothing",
        sub: [
          {
            id: "baby-kids-0-2y",
            name: { en: "0–2Y", fr: "0–2 ans" },
            slug: "0-2y",
          },
          {
            id: "baby-kids-3-5y",
            name: { en: "3–5Y", fr: "3–5 ans" },
            slug: "3-5y",
          },
          {
            id: "baby-kids-6-12y",
            name: { en: "6–12Y", fr: "6–12 ans" },
            slug: "6-12y",
          },
          {
            id: "baby-kids-other-clothing",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "baby-kids-toys",
        name: { en: "Toys", fr: "Jouets" },
        slug: "toys",
        sub: [
          {
            id: "baby-kids-educational-toys",
            name: { en: "Educational", fr: "Éducatifs" },
            slug: "educational",
          },
          {
            id: "baby-kids-plush-toys",
            name: { en: "Plush", fr: "Peluches" },
            slug: "plush",
          },
          {
            id: "baby-kids-outdoor-toys",
            name: { en: "Outdoor", fr: "Extérieur" },
            slug: "outdoor",
          },
          {
            id: "baby-kids-other-toys",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "baby-kids-gear",
        name: { en: "Gear", fr: "Équipement" },
        slug: "gear",
        sub: [
          {
            id: "baby-kids-strollers",
            name: { en: "Strollers", fr: "Poussettes" },
            slug: "strollers",
          },
          {
            id: "baby-kids-car-seats",
            name: { en: "Car Seats", fr: "Sièges auto" },
            slug: "car-seats",
          },
          {
            id: "baby-kids-high-chairs",
            name: { en: "High Chairs", fr: "Chaises hautes" },
            slug: "high-chairs",
          },
          {
            id: "baby-kids-other-gear",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
  {
    id: "beauty",
    name: { en: "Beauty", fr: "Beauté" },
    slug: "beauty",
    sub: [
      {
        id: "beauty-skincare",
        name: { en: "Skincare", fr: "Soins de la peau" },
        slug: "skincare",
        sub: [
          {
            id: "beauty-face-skincare",
            name: { en: "Face", fr: "Visage" },
            slug: "face",
          },
          {
            id: "beauty-body-skincare",
            name: { en: "Body", fr: "Corps" },
            slug: "body",
          },
          {
            id: "beauty-other-skincare",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "beauty-haircare",
        name: { en: "Haircare", fr: "Soins capillaires" },
        slug: "haircare",
        sub: [
          {
            id: "beauty-shampoo",
            name: { en: "Shampoo", fr: "Shampooing" },
            slug: "shampoo",
          },
          {
            id: "beauty-styling",
            name: { en: "Styling", fr: "Coiffage" },
            slug: "styling",
          },
          {
            id: "beauty-tools",
            name: { en: "Tools", fr: "Outils" },
            slug: "tools",
          },
          {
            id: "beauty-other-haircare",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "beauty-makeup",
        name: { en: "Makeup", fr: "Maquillage" },
        slug: "makeup",
        sub: [
          {
            id: "beauty-eyes-makeup",
            name: { en: "Eyes", fr: "Yeux" },
            slug: "eyes",
          },
          {
            id: "beauty-lips-makeup",
            name: { en: "Lips", fr: "Lèvres" },
            slug: "lips",
          },
          {
            id: "beauty-face-makeup",
            name: { en: "Face", fr: "Visage" },
            slug: "face",
          },
          {
            id: "beauty-other-makeup",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
  {
    id: "home-furniture",
    name: { en: "Home & Furniture", fr: "Maison & Meubles" },
    slug: "home-furniture",
    sub: [
      {
        id: "home-furniture-furniture",
        name: { en: "Furniture", fr: "Meubles" },
        slug: "furniture",
        sub: [
          {
            id: "home-furniture-sofas",
            name: { en: "Sofas", fr: "Canapés" },
            slug: "sofas",
          },
          {
            id: "home-furniture-beds",
            name: { en: "Beds", fr: "Lits" },
            slug: "beds",
          },
          {
            id: "home-furniture-tables",
            name: { en: "Tables", fr: "Tables" },
            slug: "tables",
          },
          {
            id: "home-furniture-dressers",
            name: { en: "Dressers", fr: "Commodes" },
            slug: "dressers",
          },
          {
            id: "home-furniture-cabinets",
            name: { en: "Cabinets", fr: "Armoires" },
            slug: "cabinets",
          },
          {
            id: "home-furniture-chairs",
            name: { en: "Chairs", fr: "Chaises" },
            slug: "chairs",
          },
          {
            id: "home-furniture-other-furniture",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "home-furniture-appliances",
        name: { en: "Appliances", fr: "Appareils" },
        slug: "appliances",
        sub: [
          {
            id: "home-furniture-kitchen-appliances",
            name: { en: "Kitchen", fr: "Cuisine" },
            slug: "kitchen",
          },
          {
            id: "home-furniture-cleaning-appliances",
            name: { en: "Cleaning", fr: "Nettoyage" },
            slug: "cleaning",
          },
          {
            id: "home-furniture-air-heating",
            name: { en: "Air & Heating", fr: "Air & Chauffage" },
            slug: "air-heating",
          },
          {
            id: "home-furniture-other-appliances",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "home-furniture-kitchenware",
        name: { en: "Kitchenware", fr: "Ustensiles de cuisine" },
        slug: "kitchenware",
        sub: [
          {
            id: "home-furniture-cups",
            name: { en: "Cups", fr: "Tasses" },
            slug: "cups",
          },
          {
            id: "home-furniture-plates",
            name: { en: "Plates", fr: "Assiettes" },
            slug: "plates",
          },
          {
            id: "home-furniture-cutlery",
            name: { en: "Cutlery", fr: "Couverts" },
            slug: "cutlery",
          },
          {
            id: "home-furniture-cooking-utensils",
            name: { en: "Cooking Utensils", fr: "Ustensiles" },
            slug: "cooking-utensils",
          },
          {
            id: "home-furniture-pots-pans",
            name: { en: "Pots & Pans", fr: "Casseroles & Poêles" },
            slug: "pots-pans",
          },
          {
            id: "home-furniture-other-kitchenware",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
  {
    id: "electronics",
    name: { en: "Electronics", fr: "Électronique" },
    slug: "electronics",
    sub: [
      {
        id: "electronics-mobile-devices",
        name: { en: "Mobile Devices", fr: "Appareils mobiles" },
        slug: "mobile-devices",
        sub: [
          {
            id: "electronics-mobile-phones",
            name: { en: "Mobile Phones", fr: "Téléphones mobiles" },
            slug: "mobile-phones",
          },
          {
            id: "electronics-tablets",
            name: { en: "Tablets", fr: "Tablettes" },
            slug: "tablets",
          },
          {
            id: "electronics-smartwatches",
            name: { en: "Smartwatches", fr: "Montres intelligentes" },
            slug: "smartwatches",
          },
          {
            id: "electronics-mobile-accessories",
            name: { en: "Accessories", fr: "Accessoires" },
            slug: "accessories",
          },
          {
            id: "electronics-other-mobile",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "electronics-computers",
        name: { en: "Computers", fr: "Ordinateurs" },
        slug: "computers",
        sub: [
          {
            id: "electronics-laptops",
            name: { en: "Laptops", fr: "Ordinateurs portables" },
            slug: "laptops",
          },
          {
            id: "electronics-desktops",
            name: { en: "Desktops", fr: "Ordinateurs de bureau" },
            slug: "desktops",
          },
          {
            id: "electronics-monitors",
            name: { en: "Monitors", fr: "Moniteurs" },
            slug: "monitors",
          },
          {
            id: "electronics-computer-accessories",
            name: { en: "Accessories", fr: "Accessoires" },
            slug: "accessories",
          },
          {
            id: "electronics-other-computers",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "electronics-home",
        name: { en: "Home Electronics", fr: "Électronique domestique" },
        slug: "home-electronics",
        sub: [
          {
            id: "electronics-tvs",
            name: { en: "TVs", fr: "Téléviseurs" },
            slug: "tvs",
          },
          {
            id: "electronics-audio",
            name: { en: "Audio", fr: "Audio" },
            slug: "audio",
          },
          {
            id: "electronics-cameras",
            name: { en: "Cameras", fr: "Appareils photo" },
            slug: "cameras",
          },
          {
            id: "electronics-gaming-consoles",
            name: { en: "Gaming Consoles", fr: "Consoles de jeux" },
            slug: "gaming-consoles",
          },
          {
            id: "electronics-other-home",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
  {
    id: "sports",
    name: { en: "Sports", fr: "Sports" },
    slug: "sports",
    sub: [
      {
        id: "sports-fitness",
        name: { en: "Fitness", fr: "Fitness" },
        slug: "fitness",
        sub: [
          {
            id: "sports-gym-equipment",
            name: { en: "Gym Equipment", fr: "Équipement de gym" },
            slug: "gym-equipment",
          },
          {
            id: "sports-weights",
            name: { en: "Weights", fr: "Poids" },
            slug: "weights",
          },
          { id: "sports-yoga", name: { en: "Yoga", fr: "Yoga" }, slug: "yoga" },
          {
            id: "sports-other-fitness",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "sports-outdoor",
        name: { en: "Outdoor", fr: "Plein air" },
        slug: "outdoor",
        sub: [
          {
            id: "sports-camping",
            name: { en: "Camping", fr: "Camping" },
            slug: "camping",
          },
          {
            id: "sports-hiking",
            name: { en: "Hiking", fr: "Randonnée" },
            slug: "hiking",
          },
          {
            id: "sports-fishing",
            name: { en: "Fishing", fr: "Pêche" },
            slug: "fishing",
          },
          {
            id: "sports-other-outdoor",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "sports-cycling",
        name: { en: "Cycling Gear", fr: "Équipement de cyclisme" },
        slug: "cycling-gear",
        sub: [
          {
            id: "sports-helmets",
            name: { en: "Helmets", fr: "Casques" },
            slug: "helmets",
          },
          {
            id: "sports-cycling-clothing",
            name: { en: "Clothing", fr: "Vêtements" },
            slug: "clothing",
          },
          {
            id: "sports-cycling-accessories",
            name: { en: "Accessories", fr: "Accessoires" },
            slug: "accessories",
          },
          {
            id: "sports-other-cycling",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
  {
    id: "books",
    name: { en: "Books", fr: "Livres" },
    slug: "books",
    sub: [
      {
        id: "books-fiction",
        name: { en: "Fiction", fr: "Fiction" },
        slug: "fiction",
        sub: [
          {
            id: "books-novels",
            name: { en: "Novels", fr: "Romans" },
            slug: "novels",
          },
          {
            id: "books-short-stories",
            name: { en: "Short Stories", fr: "Nouvelles" },
            slug: "short-stories",
          },
          {
            id: "books-fantasy",
            name: { en: "Fantasy", fr: "Fantastique" },
            slug: "fantasy",
          },
          {
            id: "books-other-fiction",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "books-non-fiction",
        name: { en: "Non-Fiction", fr: "Non-fiction" },
        slug: "non-fiction",
        sub: [
          {
            id: "books-history",
            name: { en: "History", fr: "Histoire" },
            slug: "history",
          },
          {
            id: "books-science",
            name: { en: "Science", fr: "Science" },
            slug: "science",
          },
          {
            id: "books-self-help",
            name: { en: "Self-Help", fr: "Développement personnel" },
            slug: "self-help",
          },
          {
            id: "books-other-non-fiction",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "books-comics",
        name: { en: "Comics & Manga", fr: "Bandes dessinées et mangas" },
        slug: "comics-manga",
        sub: [
          {
            id: "books-comics-only",
            name: { en: "Comics", fr: "Bandes dessinées" },
            slug: "comics",
          },
          {
            id: "books-manga",
            name: { en: "Manga", fr: "Mangas" },
            slug: "manga",
          },
          {
            id: "books-graphic-novels",
            name: { en: "Graphic Novels", fr: "Romans graphiques" },
            slug: "graphic-novels",
          },
          {
            id: "books-other-comics",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "books-education",
        name: { en: "Education", fr: "Éducation" },
        slug: "education",
        sub: [
          {
            id: "books-textbooks",
            name: { en: "Textbooks", fr: "Manuels" },
            slug: "textbooks",
          },
          {
            id: "books-children",
            name: { en: "Children's Books", fr: "Livres pour enfants" },
            slug: "children-books",
          },
          {
            id: "books-other-education",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
  {
    id: "pets",
    name: { en: "Pets", fr: "Animaux" },
    slug: "pets",
    sub: [
      {
        id: "pets-food",
        name: { en: "Food", fr: "Nourriture" },
        slug: "food",
        sub: [
          {
            id: "pets-dog-food",
            name: { en: "Dog Food", fr: "Nourriture pour chiens" },
            slug: "dog-food",
          },
          {
            id: "pets-cat-food",
            name: { en: "Cat Food", fr: "Nourriture pour chats" },
            slug: "cat-food",
          },
          {
            id: "pets-other-food",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "pets-toys",
        name: { en: "Toys", fr: "Jouets" },
        slug: "toys",
        sub: [
          {
            id: "pets-chew-toys",
            name: { en: "Chew Toys", fr: "Jouets à mâcher" },
            slug: "chew-toys",
          },
          {
            id: "pets-interactive-toys",
            name: { en: "Interactive Toys", fr: "Jouets interactifs" },
            slug: "interactive-toys",
          },
          {
            id: "pets-other-toys",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "pets-accessories",
        name: { en: "Accessories", fr: "Accessoires" },
        slug: "accessories",
        sub: [
          {
            id: "pets-leashes",
            name: { en: "Leashes", fr: "Laisses" },
            slug: "leashes",
          },
          { id: "pets-beds", name: { en: "Beds", fr: "Lits" }, slug: "beds" },
          {
            id: "pets-bowls",
            name: { en: "Bowls", fr: "Gamelles" },
            slug: "bowls",
          },
          {
            id: "pets-other-accessories",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
  {
    id: "vehicles",
    name: { en: "Vehicles", fr: "Véhicules" },
    slug: "vehicles",
    sub: [
      {
        id: "vehicles-cars",
        name: { en: "Cars", fr: "Voitures" },
        slug: "cars",
        sub: [
          {
            id: "vehicles-sedans",
            name: { en: "Sedans", fr: "Berlines" },
            slug: "sedans",
          },
          {
            id: "vehicles-suvs",
            name: { en: "SUVs", fr: "SUV" },
            slug: "suvs",
          },
          {
            id: "vehicles-electric-cars",
            name: { en: "Electric Cars", fr: "Voitures électriques" },
            slug: "electric-cars",
          },
          {
            id: "vehicles-classic-cars",
            name: { en: "Classic Cars", fr: "Voitures classiques" },
            slug: "classic-cars",
          },
          {
            id: "vehicles-other-cars",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "vehicles-motorbikes",
        name: { en: "Motorbikes", fr: "Motos" },
        slug: "motorbikes",
        sub: [
          {
            id: "vehicles-scooters",
            name: { en: "Scooters", fr: "Scooters" },
            slug: "scooters",
          },
          {
            id: "vehicles-sport-bikes",
            name: { en: "Sport Bikes", fr: "Motos sportives" },
            slug: "sport-bikes",
          },
          {
            id: "vehicles-cruisers",
            name: { en: "Cruisers", fr: "Cruisers" },
            slug: "cruisers",
          },
          {
            id: "vehicles-other-motorbikes",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "vehicles-bicycles",
        name: { en: "Bicycles", fr: "Vélos" },
        slug: "bicycles",
        sub: [
          {
            id: "vehicles-mountain-bikes",
            name: { en: "Mountain Bikes", fr: "VTT" },
            slug: "mountain-bikes",
          },
          {
            id: "vehicles-road-bikes",
            name: { en: "Road Bikes", fr: "Vélos de route" },
            slug: "road-bikes",
          },
          {
            id: "vehicles-e-bikes",
            name: { en: "E-Bikes", fr: "Vélos électriques" },
            slug: "e-bikes",
          },
          {
            id: "vehicles-kick-scooters",
            name: { en: "Kick Scooters", fr: "Trottinettes" },
            slug: "kick-scooters",
          },
          {
            id: "vehicles-other-bicycles",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
  {
    id: "tickets-vouchers",
    name: { en: "Tickets & Vouchers", fr: "Billets et bons" },
    slug: "tickets-vouchers",
    sub: [
      {
        id: "tickets-events",
        name: { en: "Events", fr: "Événements" },
        slug: "events",
        sub: [
          {
            id: "tickets-concerts",
            name: { en: "Concerts", fr: "Concerts" },
            slug: "concerts",
          },
          {
            id: "tickets-festivals",
            name: { en: "Festivals", fr: "Festivals" },
            slug: "festivals",
          },
          {
            id: "tickets-sports",
            name: { en: "Sports", fr: "Sports" },
            slug: "sports",
          },
          {
            id: "tickets-theater",
            name: { en: "Theater", fr: "Théâtre" },
            slug: "theater",
          },
          {
            id: "tickets-other-events",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "tickets-coupons",
        name: { en: "Coupons", fr: "Coupons" },
        slug: "coupons",
        sub: [
          {
            id: "tickets-coupons-food",
            name: { en: "Food", fr: "Nourriture" },
            slug: "food",
          },
          {
            id: "tickets-coupons-shopping",
            name: { en: "Shopping", fr: "Shopping" },
            slug: "shopping",
          },
        ],
      },
    ],
  },
  {
    id: "local-services",
    name: { en: "Local Services", fr: "Services locaux" },
    slug: "local-services",
    sub: [
      {
        id: "local-home",
        name: { en: "Home", fr: "Maison" },
        slug: "home",
        sub: [
          {
            id: "local-cleaning",
            name: { en: "Cleaning", fr: "Nettoyage" },
            slug: "cleaning",
          },
          {
            id: "local-moving",
            name: { en: "Moving", fr: "Déménagement" },
            slug: "moving",
          },
          {
            id: "local-repair",
            name: { en: "Repair", fr: "Réparation" },
            slug: "repair",
          },
          {
            id: "local-other-home",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "local-personal",
        name: { en: "Personal", fr: "Personnel" },
        slug: "personal",
        sub: [
          {
            id: "local-beauty",
            name: { en: "Beauty", fr: "Beauté" },
            slug: "beauty",
          },
          {
            id: "local-tutoring",
            name: { en: "Tutoring", fr: "Cours particuliers" },
            slug: "tutoring",
          },
          {
            id: "local-pet-sitting",
            name: { en: "Pet Sitting", fr: "Garde d'animaux" },
            slug: "pet-sitting",
          },
          {
            id: "local-other-personal",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
      {
        id: "local-events",
        name: { en: "Events", fr: "Événements" },
        slug: "events",
        sub: [
          {
            id: "local-photography",
            name: { en: "Photography", fr: "Photographie" },
            slug: "photography",
          },
          {
            id: "local-rental",
            name: { en: "Rental", fr: "Location" },
            slug: "rental",
          },
          {
            id: "local-other-events",
            name: { en: "Other", fr: "Autres" },
            slug: "other",
          },
        ],
      },
    ],
  },
];
