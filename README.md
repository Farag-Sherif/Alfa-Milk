# Al Omda Coffee - E-Commerce Storefront

Welcome to the **Al Omda Coffee** storefront repository! This project is a modern, responsive, and bilingual React application built for a premium coffee brand.

## 🌟 Overview

Al Omda Coffee is an e-commerce platform that allows customers to browse a catalog of coffee products, view special offers, read blog articles, and purchase high-quality coffee. The platform is designed with a premium aesthetic and is fully optimized for both desktop and mobile devices.

## ✨ Key Features

- **Bilingual & RTL Support**: Full support for both Arabic (Default, Right-to-Left) and English (Left-to-Right). The UI seamlessly adapts its layout and typography based on the selected language.
- **Dynamic Content**: Integrates with the Al Omda backend API (`https://admin.omdacoffee.com/api/`) to fetch dynamic settings, categories, products, offers, and blog posts.
- **Product Catalog & Cart**: Browse products, view detailed descriptions, select weight variations, and add items to a Redux-managed shopping cart or wishlist.
- **Responsive Design**: A robust mobile-first layout featuring a mobile bottom navigation bar and a sticky top bar.
- **Custom Neo UI System**: Built with a custom, lightweight, and modern UI system (`src/neo/ui.js` and `src/neo/styles.css`) focusing on performance, glassmorphism, and smooth animations.
- **Branding Integration**: Dynamic fetching of contact details (emails, phone numbers) and social links directly from the admin dashboard to populate the footer and contact pages.

## 🛠️ Technology Stack

- **Frontend Framework**: React.js
- **State Management**: Redux (for Cart, Wishlist, Language, and Global UI states)
- **Routing**: React Router DOM
- **API Calls**: Axios (configured with a custom instance to point to the backend)
- **Styling**: Vanilla CSS (`styles.css` with CSS variables for theming)

## 📁 Project Structure (Key Areas)

- `src/neo/`: Contains the core of the new UI rebuild.
  - `ui.js`: The central component library (Navbar, Footer, Product Cards, Modals).
  - `pages.js`: Page-level components (Home, Shop, Offers, Blog, About, Contact).
  - `styles.css`: The central stylesheet containing all Neo UI styles, grid layouts, and responsive queries.
  - `translations.js`: Dictionary for English/Arabic text translations.
  - `lib.js`: Helper functions and hooks (e.g., `useCurrentLanguage`, `formatCurrency`).

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Omdaa_Master_Rebuilt_Source
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the development server:
```bash
npm start
```
The app will run locally at `http://localhost:3000`.

### Building for Production
To build the app for production deployment:
```bash
npm run build
```
This will create an optimized build in the `build/` folder.

## 🌍 Language & Localization

The application relies on a Redux state variable (`multilang.currentLanguageCode`) to determine the language (`ar` or `en`). 
- When Arabic is selected, the `<Shell>` component applies the `rtl` class and `dir="rtl"` to the root layout, automatically flipping CSS grids, flex layouts, and adjusting specific paddings.
- The `translations.js` file handles static strings, while dynamic content uses the `pickTranslation` helper to extract the correct language from the API's JSON structures.

## 🤝 Contributing

When contributing to the UI or adding new pages:
1. Always use the `t(lang, "key")` function for static text.
2. Ensure mobile responsiveness by utilizing the predefined CSS grid utility classes.
3. Keep custom components inside `src/neo/ui.js` unless they require a dedicated file.

---
*Built with ❤️ for Al Omda Coffee.*
