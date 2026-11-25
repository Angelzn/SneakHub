import type { Tenis } from "../components/TarjetaTenis";

// Catálogo de demostración de SneakHub.
// Los precios son de ejemplo en dólares (USD).
// Las imágenes se cargan desde URLs externas.

type Modelo = {
  id: number;
  title: string;
  brand: string;
  price: number;
  thumbnail: string;
  category: "mens-shoes" | "womens-shoes";
};

const modelos: Modelo[] = [
  // ========== HOMBRE ==========

  {
    id: 1001,
    title: "Air Jordan 1 Chicago Lost & Found",
    brand: "Nike",
    price: 420,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/080/963/035/original/920714_00.png.png",
    category: "mens-shoes",
  },
  {
    id: 1002,
    title: "Air Jordan 1 Stage Haze",
    brand: "Nike",
    price: 240,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/072/682/079/original/895937_00.png.png",
    category: "mens-shoes",
  },
  {
    id: 1003,
    title: "Travis Scott x Air Jordan 1 Mocha",
    brand: "Nike",
    price: 440,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/079/299/626/original/488879_00.png.png",
    category: "mens-shoes",
  },
  {
    id: 1004,
    title: "Air Jordan 4 Red Cement",
    brand: "Nike",
    price: 230,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/092/326/342/original/1200361_00.png",
    category: "mens-shoes",
  },
  {
    id: 1005,
    title: "Air Jordan 4 Military Black",
    brand: "Nike",
    price: 390,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/071/333/263/original/895934_00.png.png",
    category: "mens-shoes",
  },
  {
    id: 1006,
    title: "New Balance 550 White Green",
    brand: "New Balance",
    price: 100,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/056/052/227/original/781801_00.png.png",
    category: "mens-shoes",
  },
  {
    id: 1007,
    title: "Yeezy Boost 350 V2 Carbon Beluga",
    brand: "Adidas",
    price: 210,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/089/100/257/original/1072889_00.png.png",
    category: "mens-shoes",
  },
  {
    id: 1008,
    title: "Air Jordan 3 White Cement Reimagined",
    brand: "Nike",
    price: 290,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/082/913/709/original/1101598_00.png.png",
    category: "mens-shoes",
  },
  {
    id: 1009,
    title: "Yeezy Boost 350 V2 Granite",
    brand: "Adidas",
    price: 215,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/080/255/684/original/1003886_00.png.png",
    category: "mens-shoes",
  },
  {
    id: 1010,
    title: "Air Jordan 1 UNC Toe",
    brand: "Nike",
    price: 170,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/090/732/808/original/1145907_00.png.png",
    category: "mens-shoes",
  },

  // ========== MUJER / UNISEX ==========

  {
    id: 2001,
    title: "New Balance 550 White Vintage Indigo",
    brand: "New Balance",
    price: 80,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/091/190/375/original/1229872_00.png.png",
    category: "womens-shoes",
  },
  {
    id: 2002,
    title: "Converse Chuck 70 CDG Milk",
    brand: "Converse",
    price: 190,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/068/534/681/original/77243_00.png.png",
    category: "womens-shoes",
  },
  {
    id: 2003,
    title: "Converse Chuck 70 CDG Black",
    brand: "Converse",
    price: 120,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/096/977/177/original/147186_00.png.png",
    category: "womens-shoes",
  },
  {
    id: 2004,
    title: "Nike Air Force 1 Triple White",
    brand: "Nike",
    price: 70,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/048/340/054/original/712867_00.png.png",
    category: "womens-shoes",
  },
  {
    id: 2005,
    title: "Air Jordan 11 Cherry",
    brand: "Nike",
    price: 190,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/081/526/420/original/920713_00.png.png",
    category: "womens-shoes",
  },
  {
    id: 2006,
    title: "Nike Dunk Low Reverse Curry",
    brand: "Nike",
    price: 110,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/097/104/892/original/1249413_00.png.png",
    category: "womens-shoes",
  },
  {
    id: 2007,
    title: "Nike Dunk Low SB Turbo Green",
    brand: "Nike",
    price: 180,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/092/705/125/original/1236006_00.png.png",
    category: "womens-shoes",
  },
  {
    id: 2008,
    title: "Air Jordan 1 Low Year of the Dragon",
    brand: "Nike",
    price: 160,
    thumbnail:
      "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/097/139/606/original/1293059_00.png.png",
    category: "womens-shoes",
  },
];

// Convertimos los modelos al tipo que utiliza
// el componente TarjetaTenis.

export const sneakersLocales: Tenis[] = modelos.map((modelo) => ({
  ...modelo,
  description: "Sneaker del catálogo de demostración SneakHub.",
  stock: 0,
}));
