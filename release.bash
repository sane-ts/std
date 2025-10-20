set -e
pnpm build
pnpm bumpp
cat package.json | jq -r '.imports = { "#*.ts": "./dist/*.js" }' > dist/package.json
cd dist
pnpm publish --access public
