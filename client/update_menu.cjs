const fs = require('fs');

const menuFile = 'src/pages/Menu.jsx';
const generatedFile = 'generated_array.txt';

let menuContent = fs.readFileSync(menuFile, 'utf8');
const newArrayContent = fs.readFileSync(generatedFile, 'utf8');

const regex = /  const menuItems = \[[\s\S]*?\];/;
menuContent = menuContent.replace(regex, newArrayContent);

fs.writeFileSync(menuFile, menuContent);
console.log('Menu.jsx updated successfully!');
