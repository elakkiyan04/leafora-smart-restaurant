const fs = require('fs');
const https = require('https');
const path = require('path');

const items = [
    { name: "Classic Beef Burger", query: "classic beef burger" },
    { name: "Cheese Burger", query: "cheese burger" },
    { name: "Double Patty Burger", query: "double patty burger" },
    { name: "Spicy Chicken Burger", query: "spicy chicken burger" },
    { name: "Fried Chicken Bucket", query: "fried chicken bucket" },
    { name: "Grilled Chicken Breast", query: "grilled chicken breast" },
    { name: "BBQ Chicken Wings", query: "bbq chicken wings" },
    { name: "Crispy Chicken Tenders", query: "chicken tenders" },
    { name: "Chicken Noodles", query: "chicken noodles" },
    { name: "Veg Noodles", query: "veg noodles" },
    { name: "Spicy Seafood Noodles", query: "seafood noodles" },
    { name: "Teriyaki Beef Noodles", query: "beef noodles" },
    { name: "Premium Ribeye Steak", query: "ribeye steak" },
    { name: "T-Bone Steak", query: "t bone steak" },
    { name: "Sirloin Steak", query: "sirloin steak" },
    { name: "Garlic Butter Steak Bites", query: "steak bites" },
    { name: "Truffle Mushroom Pasta", query: "mushroom pasta" },
    { name: "Creamy Alfredo Pasta", query: "alfredo pasta" },
    { name: "Spaghetti Bolognese", query: "spaghetti bolognese" },
    { name: "Seafood Marinara", query: "seafood pasta" },
    { name: "Classic Margherita Pizza", query: "margherita pizza" },
    { name: "Pepperoni Feast", query: "pepperoni pizza" },
    { name: "Vegetarian Supreme", query: "vegetarian pizza" },
    { name: "BBQ Chicken Pizza", query: "bbq chicken pizza" },
    { name: "Spicy Tuna Roll", query: "spicy tuna sushi" },
    { name: "California Roll", query: "california roll sushi" },
    { name: "Salmon Nigiri", query: "salmon nigiri sushi" },
    { name: "Dragon Roll", query: "dragon roll sushi" },
    { name: "Lobster Bisque", query: "lobster bisque" },
    { name: "Creamy Tomato Soup", query: "tomato soup" },
    { name: "Chicken Sweet Corn", query: "chicken corn soup" },
    { name: "Hot & Sour Soup", query: "hot and sour soup" },
    { name: "Chicken Briyani", query: "chicken biryani" },
    { name: "Mutton Briyani", query: "mutton biryani" },
    { name: "Seafood Briyani", query: "seafood biryani" },
    { name: "Cheese Briyani", query: "cheese biryani" },
    { name: "Chicken Fried Rice", query: "chicken fried rice" },
    { name: "Seafood Fried Rice", query: "seafood fried rice" },
    { name: "Mixed Fried Rice", query: "mixed fried rice" },
    { name: "Egg Fried Rice", query: "egg fried rice" },
    { name: "Dolphin Kothu", query: "kothu roti" },
    { name: "Cheese Kothu", query: "cheese kothu" },
    { name: "Chicken Kothu", query: "chicken kothu roti" },
    { name: "Seafood Kothu", query: "seafood kothu roti" }
];

const destDir = path.join(__dirname, 'src', 'assets', 'images');
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

function toFileName(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and') + '.jpg';
}

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch(e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                downloadImage(res.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        });
        req.on('error', reject);
        // Timeout
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function main() {
    for (const item of items) {
        const fileName = toFileName(item.name);
        const destPath = path.join(destDir, fileName);
        
        if (fs.existsSync(destPath)) {
            const stats = fs.statSync(destPath);
            if (stats.size > 1000) {
                console.log(`Exists and valid: ${fileName}`);
                continue;
            }
        }

        try {
            console.log(`Searching for ${item.query}...`);
            const apiUrl = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(item.query)}&per_page=1`;
            const data = await fetchJson(apiUrl);
            if (data.results && data.results.length > 0) {
                const imgUrl = data.results[0].urls.raw + '&auto=format&fit=crop&w=800&q=80';
                console.log(`Downloading ${imgUrl} for ${item.name}...`);
                await downloadImage(imgUrl, destPath);
            } else {
                console.log(`No results for ${item.query}, using a fallback.`);
                const fallbackUrl = `https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80`;
                await downloadImage(fallbackUrl, destPath);
            }
            // small delay
            await new Promise(r => setTimeout(r, 500));
        } catch (err) {
            console.error(`Error processing ${item.name}:`, err);
        }
    }
    console.log("All done!");
}

main();
