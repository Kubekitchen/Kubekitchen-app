const mongoose = require("mongoose");

const MONGO_URIS = {
  restaurant: "mongodb://localhost:27017/restaurantdb",
  menu: "mongodb://localhost:27017/menudb",
};

const restaurantSchema = new mongoose.Schema({
  name: String, description: String, cuisine: [String],
  address: { street: String, city: String, state: String, zipCode: String },
  phone: String, email: String, image: String, rating: Number,
  totalRatings: Number, isActive: Boolean,
  openingHours: { open: String, close: String },
  ownerId: String, tags: [String], deliveryTime: String, minimumOrder: Number,
}, { timestamps: true });

const menuSchema = new mongoose.Schema({
  restaurantId: String, name: String, description: String,
  price: Number, category: String, image: String, isAvailable: Boolean,
  isVeg: Boolean, spiceLevel: String, preparationTime: Number,
  calories: Number, allergens: [String],
}, { timestamps: true });

async function seed() {
  const rConn = await mongoose.createConnection(MONGO_URIS.restaurant).asPromise();
  const mConn = await mongoose.createConnection(MONGO_URIS.menu).asPromise();

  const Restaurant = rConn.model("Restaurant", restaurantSchema);
  const MenuItem = mConn.model("MenuItem", menuSchema);

  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});

  const restaurants = await Restaurant.insertMany([
    {
      name: "Pizzeria Napoli", description: "Authentic Neapolitan pizza with wood-fired oven",
      cuisine: ["Italian"], address: { street: "123 Main St", city: "New York", state: "NY", zipCode: "10001" },
      phone: "+1-555-0101", email: "napoli@example.com",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop",
      rating: 4.8, totalRatings: 245, isActive: true,
      openingHours: { open: "11:00", close: "23:00" }, ownerId: "seed-owner-1",
      tags: ["pizza", "italian", "wood-fired"], deliveryTime: "25-35 min", minimumOrder: 15,
    },
    {
      name: "Tokyo Ramen House", description: "Traditional Japanese ramen with rich tonkotsu broth",
      cuisine: ["Japanese"], address: { street: "456 Oak Ave", city: "San Francisco", state: "CA", zipCode: "94102" },
      phone: "+1-555-0202", email: "tokyo@example.com",
      image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=250&fit=crop",
      rating: 4.9, totalRatings: 312, isActive: true,
      openingHours: { open: "12:00", close: "22:00" }, ownerId: "seed-owner-2",
      tags: ["ramen", "japanese", "noodles"], deliveryTime: "30-40 min", minimumOrder: 20,
    },
    {
      name: "Casa Mexicana", description: "Fresh and vibrant Mexican street food",
      cuisine: ["Mexican"], address: { street: "789 Pine St", city: "Austin", state: "TX", zipCode: "73301" },
      phone: "+1-555-0303", email: "casa@example.com",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=250&fit=crop",
      rating: 4.6, totalRatings: 189, isActive: true,
      openingHours: { open: "10:00", close: "22:00" }, ownerId: "seed-owner-3",
      tags: ["tacos", "mexican", "burritos"], deliveryTime: "20-30 min", minimumOrder: 10,
    },
    {
      name: "Spice Garden India", description: "Aromatic Indian curries and tandoor specialties",
      cuisine: ["Indian"], address: { street: "321 Elm St", city: "Chicago", state: "IL", zipCode: "60601" },
      phone: "+1-555-0404", email: "spice@example.com",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=250&fit=crop",
      rating: 4.7, totalRatings: 276, isActive: true,
      openingHours: { open: "11:30", close: "22:30" }, ownerId: "seed-owner-4",
      tags: ["curry", "indian", "tandoor"], deliveryTime: "35-45 min", minimumOrder: 18,
    },
  ]);

  console.log(`Seeded ${restaurants.length} restaurants`);

  const menuItems = [];
  for (const r of restaurants) {
    menuItems.push(
      { restaurantId: r._id.toString(), name: "Signature Starter", description: "Chef's special appetizer to begin your journey", price: 8.99, category: "starter", isAvailable: true, isVeg: false, spiceLevel: "mild", preparationTime: 10, calories: 220 },
      { restaurantId: r._id.toString(), name: "Garden Fresh Salad", description: "Crisp greens with house dressing", price: 7.50, category: "starter", isAvailable: true, isVeg: true, spiceLevel: "mild", preparationTime: 5, calories: 150 },
      { restaurantId: r._id.toString(), name: "House Special Main", description: "The signature main course you will love", price: 18.99, category: "main", isAvailable: true, isVeg: false, spiceLevel: "medium", preparationTime: 20, calories: 650 },
      { restaurantId: r._id.toString(), name: "Veggie Delight", description: "A hearty vegetarian main dish bursting with flavor", price: 15.99, category: "main", isAvailable: true, isVeg: true, spiceLevel: "mild", preparationTime: 18, calories: 520 },
      { restaurantId: r._id.toString(), name: "Spicy Fire Bowl", description: "Bold and spicy for the brave adventurers", price: 17.50, category: "main", isAvailable: true, isVeg: false, spiceLevel: "hot", preparationTime: 22, calories: 700 },
      { restaurantId: r._id.toString(), name: "Classic Dessert", description: "Sweet ending to your perfect meal", price: 6.99, category: "dessert", isAvailable: true, isVeg: true, spiceLevel: "mild", preparationTime: 8, calories: 380 },
      { restaurantId: r._id.toString(), name: "Artisan Lemonade", description: "House-made fresh squeezed lemonade", price: 4.50, category: "beverage", isAvailable: true, isVeg: true, spiceLevel: "mild", preparationTime: 3, calories: 120 },
      { restaurantId: r._id.toString(), name: "Crispy Side Fries", description: "Golden crispy fries with seasoning", price: 5.99, category: "side", isAvailable: true, isVeg: true, spiceLevel: "mild", preparationTime: 8, calories: 320 }
    );
  }

  await MenuItem.insertMany(menuItems);
  console.log(`Seeded ${menuItems.length} menu items`);

  await rConn.close();
  await mConn.close();
  console.log("Seeding complete!");
}

seed().catch((err) => { console.error(err); process.exit(1); });