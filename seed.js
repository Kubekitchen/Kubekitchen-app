const mongoose = require("mongoose");

// Use Docker service names from docker-compose
const MONGO_URIS = {
  restaurant: process.env.RESTAURANT_MONGO_URI || "mongodb://mongo-restaurant:27017/restaurantdb",
  menu: process.env.MENU_MONGO_URI || "mongodb://mongo-menu:27017/menudb",
};

const restaurantSchema = new mongoose.Schema({
  name: String,
  description: String,
  cuisine: String,        // Changed from array to string to match your service
  address: String,        // Simplified - your service uses simple string
  phone: String,
  email: String,
  image: String,
  rating: Number,
  totalRatings: Number,
  isOpen: { type: Boolean, default: true },  // Changed from isActive to isOpen
  owner: String,          // Changed from ownerId to owner
}, { timestamps: true });

const menuSchema = new mongoose.Schema({
  restaurant: String,     // Changed from restaurantId to restaurant
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

async function seed() {
  try {
    console.log("Connecting to databases...");
    
    const rConn = await mongoose.createConnection(MONGO_URIS.restaurant).asPromise();
    const mConn = await mongoose.createConnection(MONGO_URIS.menu).asPromise();

    const Restaurant = rConn.model("Restaurant", restaurantSchema);
    const Menu = mConn.model("Menu", menuSchema);

    console.log("Clearing existing data...");
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    console.log("Seeding restaurants...");
    const restaurants = await Restaurant.insertMany([
      {
        name: "Pizzeria Napoli",
        description: "Authentic Neapolitan pizza with wood-fired oven",
        cuisine: "Italian",
        address: "123 Main St, New York, NY 10001",
        phone: "+1-555-0101",
        email: "napoli@example.com",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop",
        rating: 4.8,
        totalRatings: 245,
        isOpen: true,
        owner: "seed-owner-1",
      },
      {
        name: "Tokyo Ramen House",
        description: "Traditional Japanese ramen with rich tonkotsu broth",
        cuisine: "Japanese",
        address: "456 Oak Ave, San Francisco, CA 94102",
        phone: "+1-555-0202",
        email: "tokyo@example.com",
        image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=250&fit=crop",
        rating: 4.9,
        totalRatings: 312,
        isOpen: true,
        owner: "seed-owner-2",
      },
      {
        name: "Casa Mexicana",
        description: "Fresh and vibrant Mexican street food",
        cuisine: "Mexican",
        address: "789 Pine St, Austin, TX 73301",
        phone: "+1-555-0303",
        email: "casa@example.com",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=250&fit=crop",
        rating: 4.6,
        totalRatings: 189,
        isOpen: true,
        owner: "seed-owner-3",
      },
      {
        name: "Spice Garden India",
        description: "Aromatic Indian curries and tandoor specialties",
        cuisine: "Indian",
        address: "321 Elm St, Chicago, IL 60601",
        phone: "+1-555-0404",
        email: "spice@example.com",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=250&fit=crop",
        rating: 4.7,
        totalRatings: 276,
        isOpen: true,
        owner: "seed-owner-4",
      },
      {
        name: "Burger Boulevard",
        description: "Gourmet burgers with premium ingredients",
        cuisine: "American",
        address: "555 Broadway, Los Angeles, CA 90001",
        phone: "+1-555-0505",
        email: "burger@example.com",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=250&fit=crop",
        rating: 4.5,
        totalRatings: 198,
        isOpen: true,
        owner: "seed-owner-5",
      },
    ]);

    console.log(`✓ Seeded ${restaurants.length} restaurants`);

    console.log("Seeding menu items...");
    const menuItems = [];
    
    // Pizzeria Napoli
    menuItems.push(
      { restaurant: restaurants[0]._id.toString(), name: "Margherita Pizza", description: "Classic tomato, mozzarella, and basil", price: 14.99, category: "Pizza", isAvailable: true },
      { restaurant: restaurants[0]._id.toString(), name: "Pepperoni Pizza", description: "Spicy pepperoni with extra cheese", price: 16.99, category: "Pizza", isAvailable: true },
      { restaurant: restaurants[0]._id.toString(), name: "Quattro Formaggi", description: "Four cheese pizza for cheese lovers", price: 17.99, category: "Pizza", isAvailable: true },
      { restaurant: restaurants[0]._id.toString(), name: "Caprese Salad", description: "Fresh tomatoes, mozzarella, and basil", price: 8.99, category: "Salad", isAvailable: true },
      { restaurant: restaurants[0]._id.toString(), name: "Tiramisu", description: "Classic Italian dessert", price: 6.99, category: "Dessert", isAvailable: true },
    );

    // Tokyo Ramen
    menuItems.push(
      { restaurant: restaurants[1]._id.toString(), name: "Tonkotsu Ramen", description: "Rich pork bone broth with chashu", price: 15.99, category: "Ramen", isAvailable: true },
      { restaurant: restaurants[1]._id.toString(), name: "Miso Ramen", description: "Savory miso broth with veggies", price: 14.99, category: "Ramen", isAvailable: true },
      { restaurant: restaurants[1]._id.toString(), name: "Gyoza", description: "Pan-fried pork dumplings", price: 7.99, category: "Appetizer", isAvailable: true },
      { restaurant: restaurants[1]._id.toString(), name: "Edamame", description: "Steamed soybeans with sea salt", price: 5.99, category: "Appetizer", isAvailable: true },
      { restaurant: restaurants[1]._id.toString(), name: "Mochi Ice Cream", description: "Japanese rice cake with ice cream", price: 6.50, category: "Dessert", isAvailable: true },
    );

    // Casa Mexicana
    menuItems.push(
      { restaurant: restaurants[2]._id.toString(), name: "Beef Tacos", description: "Three soft tacos with seasoned beef", price: 11.99, category: "Tacos", isAvailable: true },
      { restaurant: restaurants[2]._id.toString(), name: "Chicken Burrito", description: "Grilled chicken with rice and beans", price: 13.99, category: "Burrito", isAvailable: true },
      { restaurant: restaurants[2]._id.toString(), name: "Guacamole & Chips", description: "Fresh avocado dip with tortilla chips", price: 8.99, category: "Appetizer", isAvailable: true },
      { restaurant: restaurants[2]._id.toString(), name: "Quesadilla", description: "Cheese quesadilla with sour cream", price: 10.99, category: "Main", isAvailable: true },
      { restaurant: restaurants[2]._id.toString(), name: "Churros", description: "Fried dough with cinnamon sugar", price: 5.99, category: "Dessert", isAvailable: true },
    );

    // Spice Garden India
    menuItems.push(
      { restaurant: restaurants[3]._id.toString(), name: "Butter Chicken", description: "Creamy tomato curry with tender chicken", price: 16.99, category: "Curry", isAvailable: true },
      { restaurant: restaurants[3]._id.toString(), name: "Palak Paneer", description: "Spinach curry with cottage cheese", price: 14.99, category: "Curry", isAvailable: true },
      { restaurant: restaurants[3]._id.toString(), name: "Samosa", description: "Crispy pastry filled with spiced potatoes", price: 6.99, category: "Appetizer", isAvailable: true },
      { restaurant: restaurants[3]._id.toString(), name: "Naan Bread", description: "Oven-baked flatbread", price: 3.99, category: "Bread", isAvailable: true },
      { restaurant: restaurants[3]._id.toString(), name: "Gulab Jamun", description: "Sweet milk dumplings in syrup", price: 5.99, category: "Dessert", isAvailable: true },
    );

    // Burger Boulevard
    menuItems.push(
      { restaurant: restaurants[4]._id.toString(), name: "Classic Cheeseburger", description: "Beef patty with cheddar cheese", price: 12.99, category: "Burger", isAvailable: true },
      { restaurant: restaurants[4]._id.toString(), name: "Bacon BBQ Burger", description: "Bacon, BBQ sauce, and onion rings", price: 14.99, category: "Burger", isAvailable: true },
      { restaurant: restaurants[4]._id.toString(), name: "Veggie Burger", description: "Plant-based patty with avocado", price: 13.99, category: "Burger", isAvailable: true },
      { restaurant: restaurants[4]._id.toString(), name: "French Fries", description: "Crispy golden fries", price: 4.99, category: "Side", isAvailable: true },
      { restaurant: restaurants[4]._id.toString(), name: "Milkshake", description: "Chocolate, vanilla, or strawberry", price: 5.99, category: "Beverage", isAvailable: true },
    );

    await Menu.insertMany(menuItems);
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
