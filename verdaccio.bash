set -e
docker compose down -v
docker compose up -d --wait

pnpm build
cat package.json | jq -r '.version="0.0.1-verdaccio" | .imports = { "#*.ts": "./src/*.js" }' > dist/package.json

expect <<'EOF'
  spawn pnpm login --registry http://localhost:4873
  expect "Username:"
  send "test\r"
  expect "Password:"
  send "test\r"
  expect eof
EOF

cd dist
pnpm publish --registry http://localhost:4873 --no-git-checks --tag verdaccio
