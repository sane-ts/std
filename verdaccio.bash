docker compose down -v
docker compose up -d --wait

mv package.json package.json.bak
cat package.json.bak | jq -r '.version="0.0.1-verdaccio"' > package.json

expect <<'EOF'
  spawn pnpm login --registry http://localhost:4873
  expect "Username:"
  send "test\r"
  expect "Password:"
  send "test\r"
  expect eof
EOF

pnpm publish --registry http://localhost:4873 --no-git-checks --tag verdaccio

mv package.json.bak package.json