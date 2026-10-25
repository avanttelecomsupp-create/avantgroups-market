// AngaWorld Initial Ethnic Product Catalog
const INITIAL_PRODUCTS = [
  {
    id: "AW-1001",
    title: "Pure Bhagalpuri Handloom Tussar Silk Saree with Zari Border (Unstitched Blouse Piece)",
    brand: "Anga Bunkar Guild",
    category: "Handloom Sarees",
    origin: "Bhagalpur, Bihar",
    rating: 4.9,
    reviewsCount: 1420,
    price: 4899,
    mrp: 7499,
    discount: "35% off",
    primeEligible: true,
    inStock: true,
    stockQty: 18,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    badges: ["Best Seller", "GI Tagged Handloom"],
    description: "Authentic Bhagalpuri Tussar silk revered worldwide as the 'Queen of All Silks'. Known for its natural golden sheen, breathable texture, and hand-woven artisanal elegance directly from the master weavers of the Anga region."
  },
  {
    id: "AW-1002",
    title: "Handcrafted Madhubani Painting Pure Silk Dupatta - Kachni Tree of Life Art",
    brand: "Mithila-Anga Heritage",
    category: "Stoles & Dupattas",
    origin: "Madhubani-Bhagalpur Cluster",
    rating: 4.8,
    reviewsCount: 890,
    price: 2450,
    mrp: 3500,
    discount: "30% off",
    primeEligible: true,
    inStock: true,
    stockQty: 25,
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    badges: ["Amazon's Choice", "100% Handpainted"],
    description: "Detailed handpainted motifs depicting the sacred Tree of Life and river ecosystem. Painted with traditional bamboo nibs and natural organic pigments by master women artisans."
  },
  {
    id: "AW-1003",
    title: "Handcrafted Terracotta & Dokra Brass Fusion Floral Urli Bowl for Home Festive Decor",
    brand: "Sultanganj Potter's Guild",
    category: "Home Decor",
    origin: "Sultanganj, Bihar",
    rating: 4.7,
    reviewsCount: 520,
    price: 1399,
    mrp: 1999,
    discount: "30% off",
    primeEligible: true,
    inStock: true,
    stockQty: 32,
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    badges: ["Eco-Friendly Craft"],
    description: "Ancient terracotta hand-thrown pottery harmonized with Dokra lost-wax brass ornamentation. Designed for floating flower petals, floating diyas, and welcoming positivity."
  },
  {
    id: "AW-1004",
    title: "Manjusha Folk Art Ceremonial Silk Scarf - Authentic Anga Heritage Line Art",
    brand: "Angika Kala Sangam",
    category: "Stoles & Dupattas",
    origin: "Anga Mahajanapada Crafts",
    rating: 4.9,
    reviewsCount: 310,
    price: 1850,
    mrp: 2600,
    discount: "29% off",
    primeEligible: true,
    inStock: true,
    stockQty: 14,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    badges: ["Heritage Folk Art"],
    description: "Manjusha art is one of the world's oldest continuous narrative folk arts hailing from the ancient kingdom of Anga. Featuring signature pink, green, and yellow floral-snake borders."
  },
  {
    id: "AW-1005",
    title: "Handcrafted Brass Peacock Temple Diya Oil Lamp (Solid Cast Vintage Finish)",
    brand: "Heritage Metalcrafts",
    category: "Home Decor",
    origin: "Mirzapur-Anga Craftsmen",
    rating: 4.8,
    reviewsCount: 740,
    price: 2199,
    mrp: 3200,
    discount: "31% off",
    primeEligible: true,
    inStock: true,
    stockQty: 20,
    images: [
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    badges: ["Festive Essential"],
    description: "Traditional heavy brass oil lamp featuring an intricately engraved dancing peacock atop a classic lotus base. Cast using sand mold metallurgical casting."
  },
  {
    id: "AW-1006",
    title: "Royal Chanderi Silk Zari Woven Salwar Suit Material with Banarasi Dupatta",
    brand: "Bunkar Heritage",
    category: "Ethnic Apparel",
    origin: "Central & Eastern Weaving Cluster",
    rating: 4.7,
    reviewsCount: 430,
    price: 3699,
    mrp: 5499,
    discount: "33% off",
    primeEligible: true,
    inStock: true,
    stockQty: 15,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    badges: ["Festive Edition"],
    description: "A timeless unstitched three-piece ethnic suit crafted with luminous Chanderi yarn, adorned with subtle booties and a majestic contrast jacquard dupatta."
  }
];

function initializeProducts() {
  if (!localStorage.getItem("angaworld_products")) {
    localStorage.setItem("angaworld_products", JSON.stringify(INITIAL_PRODUCTS));
  }
}
initializeProducts();