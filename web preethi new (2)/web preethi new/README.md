# Vedha's Clothing - E-commerce Website

A modern, frontend-only React e-commerce website for Vedha's Clothing, featuring traditional and modern clothing items with elegant premium typography.

## Features

- **Product Listing**: Browse 50 products across 5 categories (Kurti, Maternity Wears, Sarees, Jewelry, Handbags)
- **Product Details**: View detailed information about each product
- **Shopping Cart**: Add products to cart with quantity management
- **Checkout**: Complete checkout process with order summary
- **User Authentication**: Full authentication flow with Sign Up and Sign In (frontend only, localStorage)
- **Currency**: All prices displayed in Indian Rupees (INR)
- **Responsive Design**: Modern, clean UI with elegant serif typography

## Products

The website includes **50 products** (10 products per category):

### Kurti (10 products)
- Traditional Kurti, Kurti Set, Embroidered Cotton Kurti, Printed Anarkali Kurti, Designer Silk Kurti, A-Line Cotton Kurti, Long Embroidered Kurti, Georgette Kurti, Chiffon Kurti, Party Wear Kurti

### Maternity Wears (10 products)
- Maternity Wear, Maternity Kurti, Maternity Tunic, Maternity Dress, Maternity Top, Maternity Leggings, Maternity Gown, Maternity Jumpsuit, Maternity Nightdress, Maternity Set

### Sarees (10 products)
- Saree Collection, Silk Saree, Cotton Saree, Georgette Saree, Chiffon Saree, Embroidered Saree, Printed Saree, Party Wear Saree, Traditional Saree, Designer Saree

### Jewelry (10 products)
- Necklace Set, Hand Chain, Bangles, Pearl Earrings, Gold Plated Necklace, Jhumka Earrings, Kundan Set, Bridal Jewelry Set, Nose Pin, Anklet Set

### Handbags (10 products)
- Sling Bag, Leather Handbag, Designer Clutch, Shoulder Bag, Tote Bag, Crossbody Bag, Evening Bag, Satchel Bag, Bucket Bag, Mini Bag

## Installation

1. Extract the zip file to your desired location

2. Install dependencies:
```bash
npm install
```

3. Add product images to `public/images/` directory (50 images total):
   - All image filenames are specified in `src/data/products.js`
   - Images should be in JPG format
   - Recommended size: 300x400px or larger

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/       # Reusable components (Sidebar, ProductCard)
├── pages/           # Page components (Home, Products, Cart, etc.)
├── context/         # React Context (CartContext, AuthContext)
├── data/            # Product data (50 products)
├── utils/           # Utility functions (currency conversion)
└── App.js           # Main app component with routing
```

## Technologies Used

- React 18.2.0
- React Router DOM 6.8.0
- React Icons 4.12.0
- CSS3 (no external CSS frameworks)
- Elegant serif fonts (Cormorant Garamond, Lora, Playfair Display)

## Currency

All prices are displayed in **Indian Rupees (INR)** with proper formatting. Prices are converted from USD at a rate of 1 USD = 83 INR.

## Authentication

- Users must **Sign Up first** before they can Sign In
- Credentials are stored securely in localStorage
- Session persists across page refreshes
- Clear validation and error messages

## Notes

- This is a frontend-only application with no backend
- Cart data and user authentication are stored in localStorage
- Product images should be placed in `public/images/` directory
- All form submissions are handled on the frontend only
- No compilation errors - ready to share and deploy

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Sharing the Project

1. Zip the entire project folder (excluding `node_modules` and `build`)
2. Share the zip file with your friend
3. They should:
   - Extract the zip file
   - Run `npm install` to install dependencies
   - Run `npm start` to start the development server
