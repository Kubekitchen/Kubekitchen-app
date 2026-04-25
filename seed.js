const mongoose = require("mongoose");

const MONGO_URIS = {
  restaurant: process.env.RESTAURANT_MONGO_URI || "mongodb://mongo-restaurant:27017/restaurantdb",
  menu: process.env.MENU_MONGO_URI || "mongodb://mongo-menu:27017/menudb",
};

// Matches restaurant-service model EXACTLY
const restaurantSchema = new mongoose.Schema({
  name: String,
  description: String,
  cuisine: { type: [String] },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  phone: String,
  email: String,
  image: String,
  rating: Number,
  totalRatings: Number,
  isActive: { type: Boolean, default: true },
  openingHours: {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "22:00" },
  },
  ownerId: String,
  tags: { type: [String], default: [] },
  deliveryTime: { type: String, default: "30-45 min" },
  minimumOrder: { type: Number, default: 0 },
}, { timestamps: true });

// Matches menu-service model EXACTLY
const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: String },
  name: String,
  description: String,
  price: Number,
  category: {
    type: String,
    enum: ["starter", "main", "dessert", "beverage", "side"],
  },
  image: { type: String, default: "" },
  isAvailable: { type: Boolean, default: true },
  isVeg: { type: Boolean, default: false },
  spiceLevel: {
    type: String,
    enum: ["mild", "medium", "hot", "extra-hot"],
    default: "mild",
  },
  preparationTime: { type: Number, default: 15 },
}, { timestamps: true });

async function seed() {
  try {
    console.log("Connecting to databases...");

    const rConn = await mongoose.createConnection(MONGO_URIS.restaurant).asPromise();
    const mConn = await mongoose.createConnection(MONGO_URIS.menu).asPromise();

    // Model names must match service model names exactly
    const Restaurant = rConn.model("Restaurant", restaurantSchema);
    const MenuItem = mConn.model("MenuItem", menuItemSchema);

    console.log("Clearing existing data...");
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    console.log("Seeding restaurants...");
    const restaurants = await Restaurant.insertMany([
      {
        name: "Pizzeria Napoli",
        description: "Authentic Neapolitan pizza with wood-fired oven",
        cuisine: ["Italian"],
        address: { street: "123 Main St", city: "New York", state: "NY", zipCode: "10001" },
        phone: "+1-555-0101",
        email: "napoli@example.com",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop",
        rating: 4.8,
        totalRatings: 245,
        isActive: true,
        ownerId: "seed-owner-1",
        tags: ["pizza", "italian", "wood-fired"],
        deliveryTime: "25-35 min",
        minimumOrder: 15,
      },
      {
        name: "Tokyo Ramen House",
        description: "Traditional Japanese ramen with rich tonkotsu broth",
        cuisine: ["Japanese"],
        address: { street: "456 Oak Ave", city: "San Francisco", state: "CA", zipCode: "94102" },
        phone: "+1-555-0202",
        email: "tokyo@example.com",
        image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=250&fit=crop",
        rating: 4.9,
        totalRatings: 312,
        isActive: true,
        ownerId: "seed-owner-2",
        tags: ["ramen", "japanese", "noodles"],
        deliveryTime: "30-40 min",
        minimumOrder: 20,
      },
      {
        name: "Casa Mexicana",
        description: "Fresh and vibrant Mexican street food",
        cuisine: ["Mexican"],
        address: { street: "789 Pine St", city: "Austin", state: "TX", zipCode: "73301" },
        phone: "+1-555-0303",
        email: "casa@example.com",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=250&fit=crop",
        rating: 4.6,
        totalRatings: 189,
        isActive: true,
        ownerId: "seed-owner-3",
        tags: ["mexican", "tacos", "burritos"],
        deliveryTime: "20-30 min",
        minimumOrder: 12,
      },
      {
        name: "Spice Garden India",
        description: "Aromatic Indian curries and tandoor specialties",
        cuisine: ["Indian"],
        address: { street: "321 Elm St", city: "Chicago", state: "IL", zipCode: "60601" },
        phone: "+1-555-0404",
        email: "spice@example.com",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=250&fit=crop",
        rating: 4.7,
        totalRatings: 276,
        isActive: true,
        ownerId: "seed-owner-4",
        tags: ["indian", "curry", "tandoor"],
        deliveryTime: "35-45 min",
        minimumOrder: 18,
      },
      {
        name: "Burger Boulevard",
        description: "Gourmet burgers with premium ingredients",
        cuisine: ["American"],
        address: { street: "555 Broadway", city: "Los Angeles", state: "CA", zipCode: "90001" },
        phone: "+1-555-0505",
        email: "burger@example.com",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=250&fit=crop",
        rating: 4.5,
        totalRatings: 198,
        isActive: true,
        ownerId: "seed-owner-5",
        tags: ["burgers", "american", "gourmet"],
        deliveryTime: "20-30 min",
        minimumOrder: 10,
      },
    ]);

    console.log(`✓ Seeded ${restaurants.length} restaurants`);

    console.log("Seeding menu items...");
    const menuItems = [];

    // Pizzeria Napoli
    menuItems.push(
      { restaurantId: restaurants[0]._id.toString(), name: "Margherita Pizza", description: "Classic tomato, mozzarella, and basil", price: 14.99, category: "main", isVeg: true, spiceLevel: "mild", preparationTime: 20 },
      { restaurantId: restaurants[0]._id.toString(), name: "Pepperoni Pizza", description: "Spicy pepperoni with extra cheese", price: 16.99, category: "main", isVeg: false, spiceLevel: "medium", preparationTime: 20 },
      { restaurantId: restaurants[0]._id.toString(), name: "Quattro Formaggi", description: "Four cheese pizza for cheese lovers", price: 17.99, category: "main", isVeg: true, spiceLevel: "mild", preparationTime: 20 },
      { restaurantId: restaurants[0]._id.toString(), name: "Caprese Salad", description: "Fresh tomatoes, mozzarella, and basil", price: 8.99, category: "starter", isVeg: true, spiceLevel: "mild", preparationTime: 10 },
      { restaurantId: restaurants[0]._id.toString(), name: "Tiramisu", description: "Classic Italian dessert", price: 6.99, category: "dessert", isVeg: true, spiceLevel: "mild", preparationTime: 5 },
    );

    // Tokyo Ramen House
    menuItems.push(
      { restaurantId: restaurants[1]._id.toString(), name: "Tonkotsu Ramen", description: "Rich pork bone broth with chashu", price: 15.99, category: "main", isVeg: false, spiceLevel: "mild", preparationTime: 15 },
      { restaurantId: restaurants[1]._id.toString(), name: "Miso Ramen", description: "Savory miso broth with veggies", price: 14.99, category: "main", isVeg: true, spiceLevel: "mild", preparationTime: 15 },
      { restaurantId: restaurants[1]._id.toString(), name: "Gyoza", description: "Pan-fried pork dumplings", price: 7.99, category: "starter", isVeg: false, spiceLevel: "mild", preparationTime: 10 },
      { restaurantId: restaurants[1]._id.toString(), name: "Edamame", description: "Steamed soybeans with sea salt", price: 5.99, category: "starter", isVeg: true, spiceLevel: "mild", preparationTime: 5 },
      { restaurantId: restaurants[1]._id.toString(), name: "Mochi Ice Cream", description: "Japanese rice cake with ice cream", price: 6.50, category: "dessert", isVeg: true, spiceLevel: "mild", preparationTime: 5 },
    );

    // Casa Mexicana
    menuItems.push(
      { restaurantId: restaurants[2]._id.toString(), name: "Beef Tacos", description: "Three soft tacos with seasoned beef", price: 11.99, category: "main", isVeg: false, spiceLevel: "medium", preparationTime: 15 },
      { restaurantId: restaurants[2]._id.toString(), name: "Chicken Burrito", description: "Grilled chicken with rice and beans", price: 13.99, category: "main", isVeg: false, spiceLevel: "medium", preparationTime: 15 },
      { restaurantId: restaurants[2]._id.toString(), name: "Guacamole & Chips", description: "Fresh avocado dip with tortilla chips", price: 8.99, category: "starter", isVeg: true, spiceLevel: "mild", preparationTime: 5 },
      { restaurantId: restaurants[2]._id.toString(), name: "Quesadilla", description: "Cheese quesadilla with sour cream", price: 10.99, category: "main", isVeg: true, spiceLevel: "mild", preparationTime: 10 },
      { restaurantId: restaurants[2]._id.toString(), name: "Churros", description: "Fried dough with cinnamon sugar", price: 5.99, category: "dessert", isVeg: true, spiceLevel: "mild", preparationTime: 10 },
    );

    // Spice Garden India
    menuItems.push(
      { restaurantId: restaurants[3]._id.toString(), name: "Butter Chicken", description: "Creamy tomato curry with tender chicken", price: 16.99, category: "main", isVeg: false, spiceLevel: "medium", preparationTime: 20 },
      { restaurantId: restaurants[3]._id.toString(), name: "Palak Paneer", description: "Spinach curry with cottage cheese", price: 14.99, category: "main", isVeg: true, spiceLevel: "medium", preparationTime: 20 },
      { restaurantId: restaurants[3]._id.toString(), name: "Samosa", description: "Crispy pastry filled with spiced potatoes", price: 6.99, category: "starter", isVeg: true, spiceLevel: "medium", preparationTime: 10 },
      { restaurantId: restaurants[3]._id.toString(), name: "Naan Bread", description: "Oven-baked flatbread", price: 3.99, category: "side", isVeg: true, spiceLevel: "mild", preparationTime: 10 },
      { restaurantId: restaurants[3]._id.toString(), name: "Gulab Jamun", description: "Sweet milk dumplings in syrup", price: 5.99, category: "dessert", isVeg: true, spiceLevel: "mild", preparationTime: 5 },
    );

    // Burger Boulevard
    menuItems.push(
      { restaurantId: restaurants[4]._id.toString(), name: "Classic Cheeseburger", description: "Beef patty with cheddar cheese", price: 12.99, category: "main", isVeg: false, spiceLevel: "mild", preparationTime: 15 },
      { restaurantId: restaurants[4]._id.toString(), name: "Bacon BBQ Burger", description: "Bacon, BBQ sauce, and onion rings", price: 14.99, category: "main", isVeg: false, spiceLevel: "mild", preparationTime: 15 },
      { restaurantId: restaurants[4]._id.toString(), name: "Veggie Burger", description: "Plant-based patty with avocado", price: 13.99, category: "main", isVeg: true, spiceLevel: "mild", preparationTime: 15 },
      { restaurantId: restaurants[4]._id.toString(), name: "French Fries", description: "Crispy golden fries", price: 4.99, category: "side", isVeg: true, spiceLevel: "mild", preparationTime: 10 },
      { restaurantId: restaurants[4]._id.toString(), name: "Milkshake", description: "Chocolate, vanilla, or strawberry", price: 5.99, category: "beverage", isVeg: true, spiceLevel: "mild", preparationTime: 5 },
    );

    await MenuItem.insertMany(menuItems);
    console.log(`✓ Seeded ${menuItems.length} menu items`);

    await rConn.close();
    await mConn.close();

    console.log("\n🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();