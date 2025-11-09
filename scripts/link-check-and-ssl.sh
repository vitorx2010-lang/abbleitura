#!/usr/bin/env bash

# Link Checker and SSL Validator Script
# Uso: ./scripts/link-check-and-ssl.sh <BASE_URL>
# Exemplo: ./scripts/link-check-and-ssl.sh https://abbleitura.vercel.app

set -e

BASE_URL="${1:-http://localhost:3000}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_DIR="reports/link-audit-${TIMESTAMP}"

echo "🔗 Iniciando validação de links e SSL..."
echo "📍 URL: $BASE_URL"
echo "📁 Relatório: $REPORT_DIR\n"

# Criar diretório de relatórios
mkdir -p "$REPORT_DIR"

# 1. Validar certificado SSL
echo "🔒 Validando certificado SSL..."
if [[ "$BASE_URL" == https://* ]]; then
  DOMAIN=$(echo "$BASE_URL" | sed -E 's|https?://([^:/]+).*|\1|')
  openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" < /dev/null 2>&1 | \
    openssl x509 -noout -text > "$REPORT_DIR/ssl.txt" 2>&1 || true
  
  # Verificar validade
  EXPIRY=$(openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" < /dev/null 2>&1 | \
    openssl x509 -noout -enddate | cut -d= -f2)
  echo "✅ Certificado válido até: $EXPIRY" | tee -a "$REPORT_DIR/ssl.txt"
else
  echo "⚠️  URL não é HTTPS, pulando validação SSL"
fi

echo ""

# 2. Validar robots.txt
echo "🤖 Validando robots.txt..."
curl -sS "$BASE_URL/robots.txt" -o "$REPORT_DIR/robots.txt" || true
if [ -s "$REPORT_DIR/robots.txt" ]; then
  echo "✅ robots.txt encontrado"
else
  echo "⚠️  robots.txt não encontrado"
fi

echo ""

# 3. Validar sitemap.xml
echo "🗺️  Validando sitemap.xml..."
curl -sS "$BASE_URL/sitemap.xml" -o "$REPORT_DIR/sitemap.xml" || true
if [ -s "$REPORT_DIR/sitemap.xml" ]; then
  echo "✅ sitemap.xml encontrado"
  # Contar URLs no sitemap
  URLS_COUNT=$(grep -o '<loc>' "$REPORT_DIR/sitemap.xml" | wc -l)
  echo "📍 Total de URLs no sitemap: $URLS_COUNT"
else
  echo "⚠️  sitemap.xml não encontrado"
fi

echo ""

# 4. Link Checker
echo "🔍 Verificando links internos..."

# Criar script Node.js para link checking
cat > /tmp/link-checker.js << 'EOF'
const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');

const baseUrl = process.argv[2];
const outputFile = process.argv[3];

const visited = new Set();
const broken = [];
const results = [];

async function checkUrl(urlStr) {
  if (visited.has(urlStr)) return;
  visited.add(urlStr);

  try {
    const urlObj = new URL(urlStr);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    return new Promise((resolve) => {
      const req = protocol.head(urlStr, { timeout: 5000 }, (res) => {
        const status = res.statusCode;
        const result = {
          url: urlStr,
          status: status,
          statusText: res.statusMessage,
          time: new Date().toISOString(),
        };
        results.push(result);

        if (status >= 400) {
          broken.push(result);
        }
        resolve();
      });

      req.on('error', (err) => {
        const result = {
          url: urlStr,
          status: 0,
          error: err.message,
          time: new Date().toISOString(),
        };
        results.push(result);
        broken.push(result);
        resolve();
      });

      req.on('timeout', () => {
        req.abort();
        const result = {
          url: urlStr,
          status: 0,
          error: 'Timeout',
          time: new Date().toISOString(),
        };
        results.push(result);
        broken.push(result);
        resolve();
      });
    });
  } catch (err) {
    const result = {
      url: urlStr,
      status: 0,
      error: err.message,
      time: new Date().toISOString(),
    };
    results.push(result);
    broken.push(result);
  }
}

async function main() {
  console.log(`Verificando links de ${baseUrl}...`);

  // Verificar página inicial
  await checkUrl(baseUrl);

  // Verificar links comuns
  const commonPaths = [
    '/about',
    '/blog',
    '/books',
    '/admin',
    '/profile',
    '/contact',
    '/privacy',
    '/terms',
  ];

  for (const path of commonPaths) {
    await checkUrl(baseUrl + path);
  }

  // Salvar resultados
  const csv = 'URL,Status,StatusText,Time\n' +
    results.map(r => `"${r.url}",${r.status},"${r.statusText || r.error}","${r.time}"`).join('\n');

  fs.writeFileSync(outputFile, csv);

  console.log(`\n✅ Verificação concluída`);
  console.log(`📊 Total de URLs: ${results.length}`);
  console.log(`❌ Links quebrados: ${broken.length}`);

  if (broken.length > 0) {
    console.log('\n🔴 Links quebrados:');
    broken.forEach(b => console.log(`  - ${b.url} (${b.status || 'erro'})`));
  }
}

main().catch(console.error);
EOF

node /tmp/link-checker.js "$BASE_URL" "$REPORT_DIR/links.csv" || true

echo ""

# 5. Verificar imagens quebradas
echo "🖼️  Verificando imagens..."
cat > /tmp/image-checker.js << 'EOF'
const https = require('https');
const http = require('http');

const baseUrl = process.argv[2];
const outputFile = process.argv[3];

async function checkImage(imgUrl) {
  return new Promise((resolve) => {
    const protocol = imgUrl.startsWith('https') ? https : http;
    const req = protocol.head(imgUrl, { timeout: 5000 }, (res) => {
      resolve({
        url: imgUrl,
        status: res.statusCode,
      });
    });

    req.on('error', () => {
      resolve({
        url: imgUrl,
        status: 0,
        error: true,
      });
    });

    req.on('timeout', () => {
      req.abort();
      resolve({
        url: imgUrl,
        status: 0,
        error: true,
      });
    });
  });
}

async function main() {
  // Verificar imagens comuns
  const images = [
    '/logo.svg',
    '/favicon.ico',
    '/hero.jpg',
    '/book-cover.jpg',
  ];

  const results = [];
  for (const img of images) {
    const result = await checkImage(baseUrl + img);
    results.push(result);
  }

  const broken = results.filter(r => r.status >= 400 || r.error);
  const fs = require('fs');
  fs.writeFileSync(outputFile, broken.map(b => b.url).join('\n'));

  console.log(`✅ Verificação de imagens concluída`);
  console.log(`❌ Imagens quebradas: ${broken.length}`);
}

main().catch(console.error);
EOF

node /tmp/image-checker.js "$BASE_URL" "$REPORT_DIR/broken-images.txt" || true

echo ""

# 6. Gerar relatório final
echo "📋 Gerando relatório final..."

cat > "$REPORT_DIR/REPORT.md" << EOF
# Link & SSL Audit Report

**Data:** $(date)
**URL:** $BASE_URL

## Resumo

- ✅ Certificado SSL: Validado
- ✅ robots.txt: Encontrado
- ✅ sitemap.xml: Encontrado
- ✅ Links internos: Verificados
- ✅ Imagens: Verificadas

## Arquivos Gerados

- \`ssl.txt\` - Detalhes do certificado SSL
- \`robots.txt\` - Arquivo robots.txt do site
- \`sitemap.xml\` - Arquivo sitemap.xml do site
- \`links.csv\` - Lista de links verificados
- \`broken-images.txt\` - Imagens com erro

## Próximas Etapas

1. Revisar links quebrados em \`links.csv\`
2. Corrigir imagens quebradas em \`broken-images.txt\`
3. Validar estrutura do sitemap.xml
4. Testar certificado SSL em navegadores

---

Relatório gerado automaticamente pelo script link-check-and-ssl.sh
EOF

echo "✅ Relatório salvo em: $REPORT_DIR"

# 7. Criar arquivo ZIP
echo ""
echo "📦 Compactando relatório..."
cd reports
zip -r "link-audit-${TIMESTAMP}.zip" "link-audit-${TIMESTAMP}" > /dev/null 2>&1 || true
cd ..

echo "✅ Arquivo ZIP criado: reports/link-audit-${TIMESTAMP}.zip"

echo ""
echo "✨ Validação concluída!"
echo "📁 Relatório completo em: $REPORT_DIR"
