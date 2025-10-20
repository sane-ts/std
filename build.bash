set -e
rm -rf dist
tsc --noEmit
tsc --emitDeclarationOnly false || true
cat package.json | jq -r '.imports = { "#*.ts": "./dist/*.js" } | .private = false' > dist/package.json
cp README.md dist/README.md
