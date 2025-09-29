// Temporary script to add reviews to all products
import { products } from './js/data.js';
import fs from 'fs';

const dummyReviews = [
    { user: "User1", rating: 5, comment: "Excellent product!" },
    { user: "User2", rating: 4, comment: "Good value." },
    { user: "User3", rating: 5, comment: "Highly recommend." }
];

products.forEach(product => {
    if (!product.reviews) {
        product.reviews = dummyReviews;
    }
});

const content = `// js/data.js

export const products = ${JSON.stringify(products, null, 4)};`;

fs.writeFileSync('./js/data.js', content);
console.log('Reviews added to all products.');
