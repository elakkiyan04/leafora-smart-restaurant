const fs = require('fs');

const items = [
    // Burger
    { id: 1, name: "Classic Beef Burger", price: 1500, category: "Burger" },
    { id: 2, name: "Cheese Burger", price: 1800, category: "Burger" },
    { id: 3, name: "Double Patty Burger", price: 2500, category: "Burger" },
    { id: 4, name: "Spicy Chicken Burger", price: 1600, category: "Burger" },

    // Chicken
    { id: 5, name: "Fried Chicken Bucket", price: 2800, category: "Chicken" },
    { id: 6, name: "Grilled Chicken Breast", price: 2200, category: "Chicken" },
    { id: 7, name: "BBQ Chicken Wings", price: 1900, category: "Chicken" },
    { id: 8, name: "Crispy Chicken Tenders", price: 1700, category: "Chicken" },

    // Noodles
    { id: 9, name: "Chicken Noodles", price: 1200, category: "Noodles" },
    { id: 10, name: "Veg Noodles", price: 900, category: "Noodles" },
    { id: 11, name: "Spicy Seafood Noodles", price: 1800, category: "Noodles" },
    { id: 12, name: "Teriyaki Beef Noodles", price: 1600, category: "Noodles" },

    // Steak
    { id: 13, name: "Premium Ribeye Steak", price: 5500, category: "Steak" },
    { id: 14, name: "T-Bone Steak", price: 6200, category: "Steak" },
    { id: 15, name: "Sirloin Steak", price: 4800, category: "Steak" },
    { id: 16, name: "Garlic Butter Steak Bites", price: 3500, category: "Steak" },

    // Pasta
    { id: 17, name: "Truffle Mushroom Pasta", price: 2400, category: "Pasta" },
    { id: 18, name: "Creamy Alfredo Pasta", price: 1800, category: "Pasta" },
    { id: 19, name: "Spaghetti Bolognese", price: 2100, category: "Pasta" },
    { id: 20, name: "Seafood Marinara", price: 2600, category: "Pasta" },

    // Pizza
    { id: 21, name: "Classic Margherita Pizza", price: 1900, category: "Pizza" },
    { id: 22, name: "Pepperoni Feast", price: 2500, category: "Pizza" },
    { id: 23, name: "Vegetarian Supreme", price: 2200, category: "Pizza" },
    { id: 24, name: "BBQ Chicken Pizza", price: 2700, category: "Pizza" },

    // Sushi
    { id: 25, name: "Spicy Tuna Roll", price: 2800, category: "Sushi" },
    { id: 26, name: "California Roll", price: 2400, category: "Sushi" },
    { id: 27, name: "Salmon Nigiri", price: 3200, category: "Sushi" },
    { id: 28, name: "Dragon Roll", price: 3500, category: "Sushi" },

    // Soup
    { id: 29, name: "Lobster Bisque", price: 2100, category: "Soup" },
    { id: 30, name: "Creamy Tomato Soup", price: 1200, category: "Soup" },
    { id: 31, name: "Chicken Sweet Corn", price: 1400, category: "Soup" },
    { id: 32, name: "Hot & Sour Soup", price: 1500, category: "Soup" },

    // Briyani
    { id: 33, name: "Chicken Briyani", price: 1500, category: "Briyani", rating: 4.8 },
    { id: 34, name: "Mutton Briyani", price: 2200, category: "Briyani", rating: 4.9 },
    { id: 35, name: "Seafood Briyani", price: 2500, category: "Briyani", rating: 4.7 },
    { id: 36, name: "Cheese Briyani", price: 1800, category: "Briyani", rating: 4.6 },

    // Fried Rice
    { id: 37, name: "Chicken Fried Rice", price: 1200, category: "Fried Rice", rating: 4.7 },
    { id: 38, name: "Seafood Fried Rice", price: 1800, category: "Fried Rice", rating: 4.8 },
    { id: 39, name: "Mixed Fried Rice", price: 1600, category: "Fried Rice", rating: 4.9 },
    { id: 40, name: "Egg Fried Rice", price: 900, category: "Fried Rice", rating: 4.5 },

    // Kothu
    { id: 41, name: "Dolphin Kothu", price: 1800, category: "Kothu", rating: 4.9 },
    { id: 42, name: "Cheese Kothu", price: 1500, category: "Kothu", rating: 4.8 },
    { id: 43, name: "Chicken Kothu", price: 1300, category: "Kothu", rating: 4.7 },
    { id: 44, name: "Seafood Kothu", price: 1900, category: "Kothu", rating: 4.8 }
];

let arrayCode = '  const menuItems = [\n';
let currentCategory = '';

items.forEach((item, index) => {
    if (item.category !== currentCategory) {
        currentCategory = item.category;
        if (index !== 0) arrayCode += '\n';
        arrayCode += `    // ${currentCategory}\n`;
    }
    
    const promptName = encodeURIComponent(`premium dark moody restaurant food photography of ${item.name}, highly detailed`);
    const imgUrl = `https://image.pollinations.ai/prompt/${promptName}?width=800&height=600&nologo=true`;
    
    const ratingStr = item.rating ? `, rating: ${item.rating}` : '';
    arrayCode += `    { id: ${item.id}, name: "${item.name}", price: ${item.price}, category: "${item.category}"${ratingStr}, image: "${imgUrl}" }${index === items.length - 1 ? '' : ','}\n`;
});

arrayCode += '  ];';

fs.writeFileSync('generated_array.txt', arrayCode);
console.log('Done generating array.');
