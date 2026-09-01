#!/usr/bin/env bash
set -Eeuo pipefail

DOMAIN="${FAIR_STAND_DOMAIN:-fairstand.umaay.com}"
LE_EMAIL="${LETSENCRYPT_EMAIL:-admin@umaay.com}"
SITE_NAME="fair-stand"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${REPO_ROOT}/dist"
NGINX_AVAILABLE="/etc/nginx/sites-available/${SITE_NAME}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${SITE_NAME}"
CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"

log() {
  printf '[fair-stand] %s\n' "$*"
}

fail() {
  printf '[fair-stand] ERROR: %s\n' "$*" >&2
  exit 1
}

if [[ "${EUID}" -ne 0 ]]; then
  fail "Bu script root olarak çalıştırılmalı: sudo bash scripts/install-server.sh"
fi

if [[ ! -f "${REPO_ROOT}/package.json" ]]; then
  fail "package.json bulunamadı: ${REPO_ROOT}"
fi

export DEBIAN_FRONTEND=noninteractive

log "Repo güncelleniyor..."
cd "${REPO_ROOT}"
git pull --ff-only

log "Temel paketler kuruluyor..."
apt-get update
apt-get install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx

need_node_install=0
if ! command -v node >/dev/null 2>&1; then
  need_node_install=1
else
  node_major="$(node -p 'Number(process.versions.node.split(".")[0])')"
  node_minor="$(node -p 'Number(process.versions.node.split(".")[1])')"

  # Vite 8 requires Node >=20.19 or >=22.12. Prefer Node 22 LTS on a fresh server.
  if (( node_major < 20 )); then
    need_node_install=1
  elif (( node_major == 20 && node_minor < 19 )); then
    need_node_install=1
  elif (( node_major == 21 )); then
    need_node_install=1
  elif (( node_major == 22 && node_minor < 12 )); then
    need_node_install=1
  fi
fi

if (( need_node_install == 1 )); then
  log "Uygun Node.js bulunamadı; Node.js 22 kuruluyor..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

command -v npm >/dev/null 2>&1 || fail "npm kurulamadı."

log "Node: $(node --version), npm: $(npm --version)"

log "Frontend bağımlılıkları kuruluyor..."
cd "${REPO_ROOT}"
npm ci

log "Production build alınıyor..."
npm run build
[[ -f "${DIST_DIR}/index.html" ]] || fail "Build tamamlandı ancak dist/index.html bulunamadı."

ssl_ready=0
if [[ -f "${CERT_PATH}" ]] \
  && openssl x509 -checkend 86400 -noout -in "${CERT_PATH}" >/dev/null 2>&1 \
  && [[ -f "${NGINX_AVAILABLE}" ]] \
  && grep -Fq "ssl_certificate ${CERT_PATH}" "${NGINX_AVAILABLE}"; then
  ssl_ready=1
fi

if (( ssl_ready == 1 )); then
  log "Geçerli SSL + nginx yapılandırması mevcut; nginx site dosyası korunuyor."
  ln -sfn "${NGINX_AVAILABLE}" "${NGINX_ENABLED}"
else
  log "HTTP nginx site ayarı hazırlanıyor..."
  cat > "${NGINX_AVAILABLE}" <<EOF
server {
    listen 80;
    listen [::]:80;

    server_name ${DOMAIN};

    root ${DIST_DIR};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

  ln -sfn "${NGINX_AVAILABLE}" "${NGINX_ENABLED}"
fi

log "Nginx yapılandırması doğrulanıyor..."
nginx -t
systemctl enable --now nginx
systemctl reload nginx

# Do not modify SSH rules. Only ensure the web ports are reachable when UFW is active.
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q '^Status: active'; then
  log "UFW aktif; yalnızca HTTP/HTTPS izinleri doğrulanıyor..."
  ufw allow 80/tcp >/dev/null
  ufw allow 443/tcp >/dev/null
fi

if (( ssl_ready == 1 )); then
  log "Geçerli SSL sertifikası mevcut; yeniden alınmayacak."
else
  log "SSL sertifikası alınıyor: ${DOMAIN}"
  if ! getent ahostsv4 "${DOMAIN}" >/dev/null 2>&1; then
    fail "${DOMAIN} için DNS A kaydı çözümlenemiyor. DNS hazır olduktan sonra scripti tekrar çalıştır."
  fi

  certbot --nginx \
    -d "${DOMAIN}" \
    --non-interactive \
    --agree-tos \
    --email "${LE_EMAIL}" \
    --redirect
fi

systemctl enable --now certbot.timer >/dev/null 2>&1 || true

log "Son nginx testi yapılıyor..."
nginx -t
systemctl reload nginx

if curl -fsS --max-time 15 "https://${DOMAIN}" >/dev/null 2>&1; then
  log "READY: https://${DOMAIN}"
else
  log "Kurulum tamamlandı; HTTPS dış erişim testi başarısız oldu. DNS/firewall durumunu kontrol et."
fi
