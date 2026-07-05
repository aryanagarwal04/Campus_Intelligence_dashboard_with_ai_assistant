const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app', '*'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Indian college cafeteria mock data
const weeklyMenu = {
  monday: {
    breakfast: [
      { item: "Idli Sambar", description: "Soft steamed rice cakes with lentil soup", isVeg: true, price: 25 },
      { item: "Poha", description: "Flattened rice with peanuts, curry leaves & lemon", isVeg: true, price: 20 },
      { item: "Chai & Biscuits", description: "Masala tea with Marie biscuits", isVeg: true, price: 10 }
    ],
    lunch: [
      { item: "Rajma Chawal", description: "Kidney bean curry with steamed rice — today's special!", isVeg: true, price: 60, isSpecial: true },
      { item: "Dal Tadka + Roti", description: "Tempered yellow lentils with 4 wheat rotis", isVeg: true, price: 45 },
      { item: "Aloo Jeera + Rice", description: "Cumin potato stir-fry with rice", isVeg: true, price: 50 },
      { item: "Salad", description: "Fresh cucumber, tomato, onion salad with chaat masala", isVeg: true, price: 15 }
    ],
    dinner: [
      { item: "Paneer Butter Masala + Naan", description: "Rich cottage cheese curry with 2 naans", isVeg: true, price: 80 },
      { item: "Dal Makhani + Rice", description: "Slow-cooked black lentils with basmati rice", isVeg: true, price: 65 },
      { item: "Mix Veg Sabzi + Roti", description: "Seasonal vegetable curry with 4 rotis", isVeg: true, price: 50 }
    ],
    specials: "Rajma Chawal"
  },
  tuesday: {
    breakfast: [
      { item: "Upma", description: "Semolina porridge with vegetables and cashews", isVeg: true, price: 22 },
      { item: "Paratha + Curd", description: "Stuffed wheat flatbread with fresh yogurt", isVeg: true, price: 35 },
      { item: "Chai", description: "Hot masala tea", isVeg: true, price: 8 }
    ],
    lunch: [
      { item: "Chole Bhature", description: "Spiced chickpea curry with fluffy fried bread — today's special!", isVeg: true, price: 70, isSpecial: true },
      { item: "Sambar Rice", description: "Lentil vegetable stew with rice", isVeg: true, price: 50 },
      { item: "Kadai Paneer + Roti", description: "Wok-tossed cottage cheese with 3 rotis", isVeg: true, price: 75 },
      { item: "Raita", description: "Cucumber in spiced yogurt", isVeg: true, price: 15 }
    ],
    dinner: [
      { item: "Palak Paneer + Roti", description: "Spinach cottage cheese gravy with 4 rotis", isVeg: true, price: 70 },
      { item: "Biryani (Veg)", description: "Fragrant basmati rice with vegetables and spices", isVeg: true, price: 90, isSpecial: true },
      { item: "Rasam + Rice", description: "South Indian pepper soup with rice", isVeg: true, price: 40 }
    ],
    specials: "Chole Bhature"
  },
  wednesday: {
    breakfast: [
      { item: "Dosa + Chutney", description: "Crispy rice crepe with coconut & tomato chutney", isVeg: true, price: 30 },
      { item: "Bread Butter Jam", description: "Toasted bread with butter and mixed fruit jam", isVeg: true, price: 20 },
      { item: "Filter Coffee", description: "South Indian decoction coffee", isVeg: true, price: 12 }
    ],
    lunch: [
      { item: "Dal Tadka + Jeera Rice", description: "Tempered lentils with cumin rice — today's special!", isVeg: true, price: 55, isSpecial: true },
      { item: "Aloo Paratha + Curd", description: "Potato-stuffed flatbread with yogurt", isVeg: true, price: 45 },
      { item: "Bhindi Masala + Roti", description: "Spiced okra stir-fry with 3 rotis", isVeg: true, price: 50 },
      { item: "Fresh Fruit", description: "Seasonal cut fruits", isVeg: true, price: 20 }
    ],
    dinner: [
      { item: "Matar Paneer + Naan", description: "Peas and cottage cheese curry with butter naan", isVeg: true, price: 75 },
      { item: "Khichdi + Kadhi", description: "Rice-lentil porridge with yogurt-based curry", isVeg: true, price: 45 },
      { item: "Egg Curry + Rice", description: "Spiced egg gravy with rice", isVeg: false, price: 60 }
    ],
    specials: "Dal Tadka & Jeera Rice"
  },
  thursday: {
    breakfast: [
      { item: "Aloo Paratha", description: "Crispy potato-stuffed flatbread with pickle", isVeg: true, price: 30 },
      { item: "Poha", description: "Flattened rice with tempered mustard seeds", isVeg: true, price: 20 },
      { item: "Chai", description: "Ginger masala tea", isVeg: true, price: 8 }
    ],
    lunch: [
      { item: "Chicken Curry + Rice", description: "North Indian spiced chicken with basmati — today's special!", isVeg: false, price: 95, isSpecial: true },
      { item: "Dal Fry + Roti", description: "Fried lentils with 4 wheat rotis", isVeg: true, price: 45 },
      { item: "Veg Biryani", description: "Fragrant vegetable rice", isVeg: true, price: 80 },
      { item: "Lassi", description: "Chilled sweet yogurt drink", isVeg: true, price: 25 }
    ],
    dinner: [
      { item: "Butter Chicken + Naan", description: "Creamy tomato-based chicken curry with naan", isVeg: false, price: 105, isSpecial: true },
      { item: "Paneer Masala + Roti", description: "Cottage cheese in spiced gravy", isVeg: true, price: 70 },
      { item: "Dahi Chawal", description: "Curd rice with pickle", isVeg: true, price: 35 }
    ],
    specials: "Chicken Curry"
  },
  friday: {
    breakfast: [
      { item: "Medu Vada + Sambar", description: "Crispy lentil donuts with sambar dip", isVeg: true, price: 30 },
      { item: "Boiled Eggs + Toast", description: "2 boiled eggs with buttered toast", isVeg: false, price: 25 },
      { item: "Chai", description: "Cardamom tea", isVeg: true, price: 8 }
    ],
    lunch: [
      { item: "Pav Bhaji", description: "Mashed vegetable curry with buttered pav bread — today's special!", isVeg: true, price: 55, isSpecial: true },
      { item: "Rajma Chawal", description: "Kidney bean curry with rice", isVeg: true, price: 60 },
      { item: "Roti + Mixed Veg", description: "4 rotis with seasonal vegetable curry", isVeg: true, price: 45 },
      { item: "Jalebi", description: "Sweet crispy fried spirals", isVeg: true, price: 20, isSpecial: true }
    ],
    dinner: [
      { item: "Mutton Curry + Rice", description: "Slow-cooked spiced mutton with rice — Friday special!", isVeg: false, price: 120, isSpecial: true },
      { item: "Paneer Tikka Masala + Naan", description: "Grilled cottage cheese in rich gravy", isVeg: true, price: 85 },
      { item: "Dal Baati Churma", description: "Traditional Rajasthani baked wheat rolls with lentil dip", isVeg: true, price: 70 }
    ],
    specials: "Pav Bhaji"
  },
  saturday: {
    breakfast: [
      { item: "Chole Kulche", description: "Chickpea curry with soft kulcha bread", isVeg: true, price: 45 },
      { item: "Banana Shake", description: "Chilled blended banana with milk", isVeg: true, price: 30 },
      { item: "Chai", description: "Hot ginger tea", isVeg: true, price: 8 }
    ],
    lunch: [
      { item: "Biryani (Chicken/Veg)", description: "Saturday Special: Dum-cooked aromatic biryani!", isVeg: false, price: 110, isSpecial: true },
      { item: "Butter Naan + Paneer", description: "Butter naan with paneer curry", isVeg: true, price: 80 },
      { item: "Kheer", description: "Sweet rice pudding with cardamom", isVeg: true, price: 25, isSpecial: true }
    ],
    dinner: [
      { item: "Pizza (Veg)", description: "Loaded veggie pizza — weekend treat!", isVeg: true, price: 100, isSpecial: true },
      { item: "Pasta + Garlic Bread", description: "Arrabbiata pasta with garlic toast", isVeg: true, price: 90 },
      { item: "Dal Rice", description: "Simple lentil soup with rice", isVeg: true, price: 40 }
    ],
    specials: "Dum Biryani"
  },
  sunday: {
    breakfast: [
      { item: "Masala Dosa", description: "Crispy crepe with spiced potato filling", isVeg: true, price: 40 },
      { item: "Bread Omelette", description: "Fluffy egg omelette with toasted bread", isVeg: false, price: 35 },
      { item: "Cold Coffee", description: "Blended cold coffee with ice cream", isVeg: true, price: 45, isSpecial: true }
    ],
    lunch: [
      { item: "Sunday Thali", description: "Complete meal: 4 rotis, dal, sabzi, rice, salad, dessert — Sunday Special!", isVeg: true, price: 85, isSpecial: true },
      { item: "Puri Bhaji", description: "Deep-fried bread with potato curry", isVeg: true, price: 45 },
      { item: "Gulab Jamun", description: "Soft milk-solid balls in rose syrup", isVeg: true, price: 20, isSpecial: true }
    ],
    dinner: [
      { item: "Pasta + Soup", description: "Pasta in white/red sauce with veg soup", isVeg: true, price: 80 },
      { item: "Noodles (Veg)", description: "Indo-Chinese style vegetable noodles", isVeg: true, price: 60 },
      { item: "Paneer Roll", description: "Cottage cheese wrapped in whole wheat paratha", isVeg: true, price: 50 }
    ],
    specials: "Sunday Thali"
  }
};

const getDayKey = (day) => {
  if (!day || day.toLowerCase() === 'today') {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  }
  return day.toLowerCase();
};

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cafeteria', timestamp: new Date().toISOString() });
});

// Menu endpoint
app.get('/menu', (req, res) => {
  const { day } = req.query;
  const dayKey = getDayKey(day);
  const menu = weeklyMenu[dayKey];

  if (!menu) {
    return res.status(400).json({ error: `Invalid day: ${day}. Use today, monday, tuesday, etc.` });
  }

  res.json({
    source: 'cafeteria',
    day: dayKey,
    date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    specials: menu.specials,
    menu: {
      breakfast: menu.breakfast,
      lunch: menu.lunch,
      dinner: menu.dinner
    }
  });
});

app.listen(PORT, () => {
  console.log(`🍽️  Cafeteria MCP Server running on http://localhost:${PORT}`);
});
