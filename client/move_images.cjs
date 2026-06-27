const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/hp/Desktop/RESTURANT/leafora/client/src/assets';
const destDir = 'c:/Users/hp/Desktop/RESTURANT/leafora/client/src/assets/images';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

files.forEach(file => {
    const fullPath = path.join(srcDir, file);
    if (fs.lstatSync(fullPath).isFile()) {
        // Skip hero.png, react.svg, vite.svg
        if (['hero.png', 'react.svg', 'vite.svg'].includes(file)) return;

        let newName = file.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
        
        // Handle files without extensions
        if (!path.extname(file)) {
            newName += '.jpg'; // Assume jpg for missing extensions
        }

        const destPath = path.join(destDir, newName);
        
        console.log(`Moving ${file} to ${newName}`);
        try {
            fs.renameSync(fullPath, destPath);
        } catch (err) {
            console.error(`Error moving ${file}: ${err.message}`);
        }
    }
});
