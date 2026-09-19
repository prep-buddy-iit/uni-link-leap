# Fix production logo asset

- Convert the supplied PrepBuddy logo into `public/logo.png` so it is committed and served directly by every deployment.
- Replace the CDN asset-pointer imports in the navbar and footer with the production-safe `/logo.png` path.
- Point organization logo metadata at `/logo.png` while keeping the optimized favicon unchanged.
- Confirm the file is not ignored, is present in repository status, appears in production output, and loads from the built site.
