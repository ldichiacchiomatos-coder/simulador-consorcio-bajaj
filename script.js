/* ============================================================
   SIMULADOR CONSÓRCIO NACIONAL BAJAJ — script.js
   Contrato de imagens: {modelo}-{cor}.{extensao}
   Mapa confirmado em 03/08/2026
   ============================================================ */

/* ---------- 1. IMAGENS DAS MOTOS (mapa definitivo) ---------- */
const MODELOS = {
  'pulsar-n150':  { cores: ['branca', 'preta', 'vermelha'],          ext: 'webp' },
  'dominar-250':  { cores: ['preta', 'vermelha'],                    ext: 'png'  },
  'dominar-400':  { cores: ['azul', 'branca', 'vermelha', 'preta', 'verde'], ext: 'png' },
  'dominar-ns160':{ cores: ['branca', 'cinza', 'preta', 'vermelha'], ext: 'png'  },
  'dominar-ns200':{ cores: ['branca', 'cinza', 'preta', 'vermelha'], ext: 'png'  },
  'dominar-ns400z':{cores: ['branca', 'preta', 'vermelha'],          ext: 'webp' }
};

/* Cores exibidas no seletor (nome -> cor HEX da bolinha) */
const COR_HEX = {
  'branca':   '#FFFFFF',
  'preta':    '#1A1A1A',
  'vermelha': '#D32F2F',
  'azul':     '#1565C0',
  'cinza':    '#757575',
  'verde':    '#2E7D32'
};

/* ---------- 2. CAMINHO DA IMAGEM ---------- */
function caminhoImagem(modelo, cor) {
  const info = MODELOS[modelo];
  if (!info) return 'img/moto-placeholder.png';
  return 'img/motos/' + modelo + '-' + cor + '.' + info.ext;
}

/* ---------- 3. RENDERIZAR SELETOR DE CORES ---------- */
function renderizarCores(modelo) {
  const info = MODELOS[modelo];
  const container = document.getElementById('seletor-cores');
  container.innerHTML = '';
  info.cores.forEach(cor => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cor-btn';
    btn.dataset.cor = cor;
    btn.title = cor;
    btn.style.background = COR_HEX[cor] || '#ccc';
    btn.addEventListener('click', function () {
      selecionarCor(modelo, cor);
    });
    container.appendChild(btn);
  });
}

/* ---------- 4. TROCAR IMAGEM ---------- */
function selecionarCor(modelo, cor) {
  document.getElementById('moto-image').src = caminhoImagem(modelo, cor);
  // marca a bolinha ativa
  document.querySelectorAll('.cor-btn').forEach(b =>
    b.classList.toggle('ativo', b.dataset.cor === cor));
}

/* ---------- 5. TROCAR MODELO ---------- */
function selecionarModelo(modelo) {
  renderizarCores(modelo);
  const primeiraCor = MODELOS[modelo].cores[0];
  selecionarCor(modelo, primeiraCor);
}
