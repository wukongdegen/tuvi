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

## VPS Deployment

The Docker Compose setup is prepared for `tuvi.wustudio.art` behind Nginx Proxy Manager.

On the VPS:

```bash
mkdir -p ~/www
cd ~/www
git clone https://github.com/wukongdegen/tuvi.git tuvi
cd tuvi
cp key.example.txt key.txt
nano key.txt
docker network create proxy || true
docker compose up -d --build
docker compose ps
```

In Nginx Proxy Manager, create a Proxy Host:

- Domain Names: `tuvi.wustudio.art`
- Scheme: `http`
- Forward Hostname / IP: `tuvi-web`
- Forward Port: `80`
- Block Common Exploits: ON

After HTTP works, request a Let's Encrypt certificate and enable Force SSL.
