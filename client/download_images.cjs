const fs = require('fs');
const https = require('https');
const path = require('path');

const items = [
    "Classic Beef Burger", "Cheese Burger", "Double Patty Burger", "Spicy Chicken Burger",
    "Fried Chicken Bucket", "Grilled Chicken Breast", "BBQ Chicken Wings", "Crispy Chicken Tenders",
    "Chicken Noodles", "Veg Noodles", "Spicy Seafood Noodles", "Teriyaki Beef Noodles",
    "Premium Ribeye Steak", "T-Bone Steak", "Sirloin Steak", "Garlic Butter Steak Bites",
    "Truffle Mushroom Pasta", "Creamy Alfredo Pasta", "Spaghetti Bolognese", "Seafood Marinara",
    "Classic Margherita Pizza", "Pepperoni Feast", "Vegetarian Supreme", "BBQ Chicken Pizza",
    "Spicy Tuna Roll", "California Roll", "Salmon Nigiri", "Dragon Roll",
    "Lobster Bisque", "Creamy Tomato Soup", "Chicken Sweet Corn", "Hot and Sour Soup",
    "Chicken Briyani", "Mutton Briyani", "Seafood Briyani", "Cheese Briyani",
    "Chicken Fried Rice", "Seafood Fried Rice", "Mixed Fried Rice", "Egg Fried Rice",
    "Dolphin Kothu", "Cheese Kothu", "Chicken Kothu", "Seafood Kothu"
];

const destDir = path.join(__dirname, 'src', 'assets', 'images');
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

function toFileName(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and') + '.jpg';
}

function downloadImage(item) {
    return new Promise((resolve, reject) => {
        const fileName = toFileName(item);
        const destPath = path.join(destDir, fileName);
        
        if (fs.existsSync(destPath)) {
            console.log(`Exists: ${fileName}`);
            return resolve();
        }

        const prompt = `premium dark moody restaurant food photography of ${item}, highly detailed, centered, 8k resolution`;
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;
        
        console.log(`Downloading ${item}...`);
        
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // handle redirect
                https.get(res.headers.location, (redirectRes) => {
                    const file = fs.createWriteStream(destPath);
                    redirectRes.pipe(file);
                    file.on('finish', () => {
                        file.close(resolve);
                    });
                }).on('error', reject);
            } else {
                const file = fs.createWriteStream(destPath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            }
        }).on('error', reject);
    });
}

async function main() {
    for (const item of items) {
        try {
            await downloadImage(item);
            // wait a little bit between requests
            await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
            console.error(`Failed to download ${item}:`, err);
        }
    }
    console.log('All done!');
}

main();
