// js/productsList.js

// Define display names for categories
const categoryNames = {
  auto: "Авто",
  home: "За Дома",
  tools: "Инструменти",
  // Add any other top-level categories you have here
};

// Define display names for subcategories (e.g., car brands)
const subcategoryNames = {
  audi: "Audi",
  bmw: "BMW",
  vw: "Volkswagen",
  seat: "Seat",
  int: "Интериор",
  ext: "Екстериор",
  // Add any other subcategories (e.g., for decor or tools)
};

// Define display names for subcategory2 (e.g., car parts/sections)
const subcategory2Names = {
  func: "Функционални",
  deco: "Декоративни",
  interior: "",
  // Add any other subcategory2 values you have here
};

// Define the desired names of colors
const orderedColorNames = [
  "Черно", "Червено", "Оранжево", "Жълто", "Лайм", "Зелено", "Циан", "Синьо", "Лилаво", "Розово", "Бяло",
];

// Define the desired colors
const availableColors = {
  Черно: "#000000ff",
  Червено: "#9c4242ff",
  Оранжево: "#bb7d4aff",
  Жълто: "#FFFF00",
  Лайм: "#7cb67cff",
  Зелено: "#488148ff",
  Циан: "#7eb7c5ff",
  Синьо: "#4653c7ff",
  Лилаво: "#765691ff",
  Розово: "#a874bdff",
  Бяло: "#FFFFFF",
};

// Define the desired order of colors
 const colorIndexMap = {
  "Черно": 1,
  "Червено": 2,
  "Оранжево": 3,
  "Жълто": 4,
  "Лайм": 5,
  "Зелено": 6,
  "Циан": 7,
  "Синьо": 8,
  "Лилаво": 9,
  "Розово": 10,
  "Бяло": 11,
};

// Your array of products
const products = [
  {
  id: 100001,
  name: "Front bumper, lower grill",
  price: 35.00, // This will be dynamic
  images: ["images/cars/audi/front bumper lower grill/1.png", "images/cars/audi/front bumper lower grill/5.webp", "images/cars/audi/front bumper lower grill/6.jpg", "images/cars/audi/front bumper lower grill/1.png", "images/cars/audi/front bumper lower grill/2.png", "images/cars/audi/front bumper lower grill/3.png", "images/cars/audi/front bumper lower grill/4.png", "images/cars/audi/front bumper lower grill/7.webp", "images/cars/audi/front bumper lower grill/8.jpg"], // Can be empty as images are in variations"],
  description: "Audi A3 8L FACELIFT решетки за броня.",
  category: "auto",
  subcategory: "audi",
  subcategory2: "",
  productDetail: "Предни долни решетки за Audi A3 8L, изработени от PETG материал. Състоят се от два компонента, които са залепени заедно, осигурявайки здравина и устойчивост.",
    fitsTheseCars:[
      {
        make: "Volkswagen",
        model: "Golf",
        submodel: "IV",
        engine: "",
        notes: "",
      },
      {
        make: "Seat",
        model: "Leon",
        submodel: "1M",
        engine: "",
        notes: "",
      }
      
    ],
  faq: [      {
        q: "Коя е лява и коя е дясна страна на автомобила?",
        a: "Лявата и дясната страна се определят спрямо посоката на движение. Така, както седите в автомобила с лице напред. Лявата страна е откъм шофьора, а дясната – откъм пътника."
      },
      {
        q: "Диаметър на халогена?",
        a: "Диаметъра на халогенът е 150мм."
      }],
  variations: [
    {
      id: 1,
      model: "С халоген",
      spotlightImage: "images/cars/audi/front bumper lower grill/5.webp",
      options: [
        {
          id: 1,
          variant: "Лява",
          price: 35.00,
        },
        {
          id: 2,
          variant: "Дясна",
          price: 35.00,
        },
        {
          id: 3,
          variant: "Комплект",
          price: 65.00,
        },
      ],
    },
    {
      id: 2,
      model: "Без халоген",
      spotlightImage: "images/cars/audi/front bumper lower grill/6.jpg",
      options: [
        {
          id: 1,
          variant: "Лява",
          price: 30.00,
        },
        {
          id: 2,
          variant: "Дясна",
          price: 30.00,
        },
        {
          id: 3,
          variant: "Комплект",
          price: 55.00,
        },
      ],
    },
  ],
},
{
  id: 100002,
  name: "Централна Решетка Пчелна Пита",
  price: 35.00, // This will be dynamic
  images: ["images/cars/audi/front bumper lower grill/1.png", "images/cars/audi/front bumper lower grill/5.webp", "images/cars/audi/front bumper lower grill/6.jpg", "images/cars/audi/front bumper lower grill/1.png", "images/cars/audi/front bumper lower grill/2.png", "images/cars/audi/front bumper lower grill/3.png", "images/cars/audi/front bumper lower grill/4.png", "images/cars/audi/front bumper lower grill/7.webp", "images/cars/audi/front bumper lower grill/8.jpg"], // Can be empty as images are in variations"],
  description: "Audi A3 8L FACELIFT решетки за броня Решетки за броня Audi A3 8L FACELIFT Решетки за броня Audi A3 8L FACELIFT.",
  category: "auto",
  subcategory: "audi",
  subcategory2: "",
  productDetail: "Предни долни решетки за Audi A3 8L, изработени от PETG материал. Състоят се от два компонента, които са залепени заедно, осигурявайки здравина и устойчивост.",
    fitsTheseCars:[
      {
        make: "Volkswagen",
        model: "Golf",
        submodel: "IV",
        engine: "",
        notes: "",
      },
      {
        make: "Seat",
        model: "Leon",
        submodel: "1M",
        engine: "",
        notes: "",
      }
      
    ],
  faq: [      {
        q: "Коя е лява и коя е дясна страна на автомобила?",
        a: "Лявата и дясната страна се определят спрямо посоката на движение. Така, както седите в автомобила с лице напред. Лявата страна е откъм шофьора, а дясната – откъм пътника."
      },
      {
        q: "Диаметър на халогена?",
        a: "Диаметъра на халогенът е 150мм."
      }],
  variations: [
    {
      id: 1,
      model: "С емблема",
      hasColors: true, 
      spotlightImage: "images/cars/audi/front bumper lower grill/5.webp",
      options: [
        {
          id: 1,
          variant: "Голяма пчелна пита",
          price: 35.00,
        },
        {
          id: 2,
          variant: "Малка пчелна пита",
          price: 35.00,
        },
        {
          id: 3,
          variant: "ОЕМ",
          price: 65.00,
        },
      ],
    },
    {
      id: 2,
      model: "Без емблема",
      spotlightImage: "images/cars/audi/front bumper lower grill/6.jpg",
      options: [
        {
          id: 1,
          variant: "Голяма пчелна пита",
          price: 30.00,
        },
        {
          id: 2,
          variant: "Малка пчелна пита",
          price: 30.00,
        },
        {
          id: 3,
          variant: "ОЕМ",
          price: 55.00,
        },
      ],
    },
  ],
},
{
  id: 100003,
  name: "Централна Решетка Пчелна Пита",
  price: 35.00, // This will be dynamic
  images: ["images/cars/audi/front bumper lower grill/1.png", "images/cars/audi/front bumper lower grill/5.webp", "images/cars/audi/front bumper lower grill/6.jpg", "images/cars/audi/front bumper lower grill/1.png", "images/cars/audi/front bumper lower grill/2.png", "images/cars/audi/front bumper lower grill/3.png", "images/cars/audi/front bumper lower grill/4.png", "images/cars/audi/front bumper lower grill/7.webp", "images/cars/audi/front bumper lower grill/8.jpg"], // Can be empty as images are in variations"],
  description: "Audi A3 8L FACELIFT решетки за броня Решетки за броня Audi A3 8L FACELIFT Решетки за броня Audi A3 8L FACELIFT.",
  category: "auto",
  subcategory: "audi",
  subcategory2: "",
  productDetail: "Предни долни решетки за Audi A3 8L, изработени от PETG материал. Състоят се от два компонента, които са залепени заедно, осигурявайки здравина и устойчивост.",
    fitsTheseCars:[
      {
        make: "Volkswagen",
        model: "Golf",
        submodel: "IV",
        engine: "",
        notes: "",
      },
      {
        make: "Seat",
        model: "Leon",
        submodel: "1M",
        engine: "",
        notes: "",
      }
      
    ],
  faq: [      {
        q: "Коя е лява и коя е дясна страна на автомобила?",
        a: "Лявата и дясната страна се определят спрямо посоката на движение. Така, както седите в автомобила с лице напред. Лявата страна е откъм шофьора, а дясната – откъм пътника."
      },
      {
        q: "Диаметър на халогена?",
        a: "Диаметъра на халогенът е 150мм."
      }],
  variations: [],
},
  {
    id: 100004,
    name: "Nekuv Hui",
    price: 10.00,
    images: [""],
    description: "A custom keychain with your name.",
    category: "auto",
    subcategory: "audi",
    subcategory2: ""
  },
  {
    id: 100005,
    name: "Drug hui",
    price: 10.00,
    images: [""],
    description: "A custom keychain with your name.",
    category: "auto",
    subcategory: "audi",
    subcategory2: ""
  },
  {
    id: 100006,
    name: "Drug hui",
    price: 10.00,
    images: [""],
    description: "A custom keychain with your name.",
    category: "auto",
    subcategory: "audi",
    subcategory2: ""
  },
  {
    id: 100007,
    name: "Drug hui",
    price: 10.00,
    images: [""],
    description: "A custom keychain with your name.",
    category: "auto",
    subcategory: "vw",
    subcategory2: ""
  },
  {
    id: 100008,
    name: "Drug hui",
    price: 10.00,
    images: [""],
    description: "A custom keychain with your name.",
    category: "auto",
    subcategory: "vw",
    subcategory2: ""
  },
  {
    id: 100009,
    name: "Drug hui",
    price: 10.00,
    images: [""],
    description: "A custom keychain with your name.",
    category: "home",
    subcategory: "ext",
    subcategory2: "deco"
  },
  {
    id: 100010,
    name: "Lapai",
    price: 10.00,
    images: [""],
    description: "A custom keychain with your name.",
    category: "home",
    subcategory: "int",
    subcategory2: "func"
  },
];
