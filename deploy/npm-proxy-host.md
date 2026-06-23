# Nginx Proxy Manager

Create a Proxy Host for `tuvi.wustudio.art`.

## Details

- Domain Names: `tuvi.wustudio.art`
- Scheme: `http`
- Forward Hostname / IP: `tuvi-web`
- Forward Port: `80`
- Block Common Exploits: ON
- Websockets Support: OFF

Create the host without SSL first, verify HTTP routing, then request a new Let's Encrypt certificate.

## SSL

- SSL Certificate: Request a new SSL Certificate
- Force SSL: ON
- HTTP/2 Support: ON
- HSTS: OFF initially
