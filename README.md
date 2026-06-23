# Tử Vi Wustudio

Mobile-first Tử Vi reading website with multilingual AI interpretation powered by Gemini 2.5 Flash.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and add `GEMINI_API_KEY`, or copy `key.example.txt` to `key.txt` and add one Gemini key per line.
3. Start the app:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5174`; the API runs on `http://localhost:8788`.

The app includes a demo fallback when no Gemini key is configured.
