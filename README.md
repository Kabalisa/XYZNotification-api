# Classifieds app api

## System process flow

- A seller must authenticate first
- A seller wants to create a new products
- Product model should include the name, price, short description, image/logo, and the manufacturing date
- A seller must select a category (Must be predefined as well )
- Customer wants to be able to view a list of all products image, name, price and manufacturing date
- The list should show only the first 10 items
- The list should be sorted alphabetically.
- The customer should be able to select a product and view details
- The customer should be able to share the product link via Whatsapp or FB

## Tools used

- NodeJs/Express
- MongoDB
- Mongoose

## installation

- git clone https://github.com/Kabalisa/classifieds-api.git
- cd classifieds-api && npm i
- npm run dev
- you can then see the app at http://localhost:3000