# NookStore 500 starter
Upload `index.html`, `manifest.webmanifest`, and `sw.js` to the root of your GitHub Pages repository, replacing the old `index.html`.

Includes responsive marketplace UI, Royal Iris/Mint Frost branding, sample preview products, Supabase email auth, store creation, product CRUD, seller dashboard, and NookSignal Business Growth Hub.

Supabase URL and browser publishable key are configured in index.html. Never add a service-role/secret key to frontend code. The project expects existing `profiles`, `stores`, and `products` tables and suitable RLS policies.

NOT production checkout: orders, payment verification, wallet, customer checkout, reviews, analytics, public seller URL routing, image uploads, admin moderation and email notifications are not implemented yet. Demo products are only displayed when the database has no live products. Test with separate seller accounts before launch.