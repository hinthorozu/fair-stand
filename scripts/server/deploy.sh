#!/usr/bin/env bash
# Independent Fair Stand API deploy (pip, alembic, catalog seed reseed, fair-stand.service, :8002 health).
# Integrated Core+CRM+Stand bring-up is Fair CRM scripts/server/deploy-all.sh.
# Configurator UI continues to ship with the CRM frontend (@fair-stand alias).
#
# Catalog SoT = git (catalog_seed_data.py). After alembic, deploy reseeds fair_stand
# catalog tables so merged item keys/dimensions reach the live API without manual DB edits.
# Skip with SKIP_CATALOG_RESEED=1 (escape hatch only).
set -euo pipefail
FAIR_STAND_DIR="${FAIR_STAND_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
DEPLOY_SERVICE_USER="${DEPLOY_SERVICE_USER:-${SUDO_USER:-$(id -un)}}"
STAND_PORT="${STAND_PORT:-8002}"
log() { printf '[fair-stand-api] %s\n' "$*"; }
die() { printf '[fair-stand-api] ERROR: %s\n' "$*" >&2; exit 1; }
[[ "$(uname -s)" == "Linux" ]] || die "Linux only"
ensure_env() {
  local target="${FAIR_STAND_DIR}/backend/.env"
  [[ -f "$target" ]] || cp "${FAIR_STAND_DIR}/backend/.env.example" "$target"
}
reseed_catalog_from_git() {
  if [[ "${SKIP_CATALOG_RESEED:-0}" == "1" ]]; then
    log "catalog reseed skipped (SKIP_CATALOG_RESEED=1)"
    return 0
  fi
  log "Reseeding fair_stand catalog from git seed…"
  (
    cd "${FAIR_STAND_DIR}/backend"
    PYTHONPATH="${FAIR_STAND_DIR}/backend" \
      "${FAIR_STAND_DIR}/backend/.venv/bin/python" scripts/resync_catalog_from_seed.py
  ) || die "catalog reseed failed"
}
main() {
  command -v python3 >/dev/null
  ensure_env
  python3 -m venv "${FAIR_STAND_DIR}/backend/.venv"
  "${FAIR_STAND_DIR}/backend/.venv/bin/pip" install -q -r "${FAIR_STAND_DIR}/backend/requirements.txt"
  (
    cd "${FAIR_STAND_DIR}/backend"
    PYTHONPATH="${FAIR_STAND_DIR}/backend" \
      "${FAIR_STAND_DIR}/backend/.venv/bin/python" -m alembic upgrade head
  )
  reseed_catalog_from_git
  if [[ "${SKIP_SYSTEMD:-0}" != "1" ]]; then
    [[ "${EUID}" -eq 0 ]] || die "systemd requires root"
    sed -e "s#__FAIR_STAND_DIR__#${FAIR_STAND_DIR}#g" \
        -e "s#__DEPLOY_SERVICE_USER__#${DEPLOY_SERVICE_USER}#g" \
        "${FAIR_STAND_DIR}/scripts/server/systemd/fair-stand.service" \
      > /etc/systemd/system/fair-stand.service
    systemctl daemon-reload
    systemctl enable fair-stand.service
    systemctl restart fair-stand.service
  fi
  local health
  health="$(curl -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:${STAND_PORT}/health" || true)"
  [[ "$health" == "200" ]] || die "health ${health}"
  log "API deploy complete (schema + catalog from git); CRM/Core/mail untouched"
}
main "$@"
