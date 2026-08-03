/* 
   SIMULADOR CONSÓRCIO NACIONAL BAJAJ
   - Dados financeiros: aba TABELAS da planilha (38 linhas, grupos 6000 e 6001)
   - Média do menor lance: aba ATUAL (70,44% grupo 6000 / 62,51% grupo 6001)
   - Ficha técnica: site oficial Bajaj Brasil (bajaj.com.br)
   - O código tenta ler os links publicados; se falharem, usa os dados locais
     (que são idênticos aos da planilha).
*/

/* ---------- LINKS DA PLANILHA (publicados em CSV) ---------- */
const CONFIG = {
  urlTabelas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQWkHKLgnwSr8G5zUNe0D2SrYkC3_z78JRQa82cra_XbBqITndpKriiI3FB1mp3B2SSC93SSxLEPpEe/pub?gid=2089215310&single=true&output=csv",
  urlAtual: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQWkHKLgnwSr8G5zUNe0D2SrYkC3_z78JRQa82cra_XbBqITndpKriiI3FB1mp3B2SSC93SSxLEPpEe/pub?gid=1973077175&single=true&output=csv"
};

/* ---------- MODELOS: nome, pasta, extensao preferida, cores, ficha tecnica ---------- */
const MODELOS = {
  "pulsar-n150": {
    nome: "Pulsar N150",
    pasta: "pulsar-n150",
    cores: ["branca", "vermelha", "preta"],
    ficha: {
      "Cilindrada": "149,68 cc",
      "Potência": "14 CV @ 8.500 RPM",
      "Torque": "1,38 kgf.m @ 6.000 RPM",
      "Tanque": "14 litros",
      "Peso": "145 kg",
      "Freios": "Disco ABS diant. / tambor tras."
    }
  },
  "dominar-ns160": {
    nome: "Dominar NS160",
    pasta: "dominar-ns160",
    cores: ["branca", "cinza", "vermelha", "preta"],
    ficha: {
      "Cilindrada": "160,3 cc",
      "Potência": "17 CV @ 9.000 RPM",
      "Torque": "1,488 kgf.m @ 7.250 RPM",
      "Tanque": "12 litros",
      "Peso": "152 kg",
      "Freios": "Disco ABS duplo canal"
    }
  },
  "dominar-ns200": {
    nome: "Dominar NS200",
    pasta: "dominar-ns200",
    cores: ["branca", "cinza", "preta", "vermelha"],
    ficha: {
      "Cilindrada": "199,5 cc",
      "Potência": "24 CV @ 9.750 RPM",
      "Torque": "1,896 kgf.m @ 8.000 RPM",
      "Tanque": "12 litros",
      "Peso": "158 kg",
      "Freios": "Disco ABS duplo canal"
    }
  },
  "dominar-250": {
    nome: "Dominar 250",
    pasta: "dominar-250",
    cores: ["preta", "vermelha"],
    ficha: {
      "Cilindrada": "248,77 cc",
      "Potência": "27 CV @ 8.400 RPM",
      "Torque": "2,39 kgf.m @ 6.500 RPM",
      "Tanque": "13 litros",
      "Peso": "180 kg",
      "Freios": "Disco ABS duplo canal"
    }
  },
  "dominar-400": {
    nome: "Dominar 400",
    pasta: "dominar-400",
    cores: ["azul", "branca", "preta", "verde", "vermelha"],
    ficha: {
      "Cilindrada": "373,27 cc",
      "Potência": "40 CV @ 8.800 RPM",
      "Torque": "3,569 kgf.m @ 6.500 RPM",
      "Tanque": "13 litros",
      "Peso": "192 kg",
      "Freios": "Disco ABS"
    }
  },
  "dominar-ns400z": {
    nome: "Dominar NS400Z",
    pasta: "dominar-ns400z",
    cores: ["preta", "vermelha", "branca"],
    ficha: {
      "Cilindrada": "373,27 cc",
      "Potência": "40 CV @ 8.500 RPM",
      "Torque": "3,57 kgf.m @ 7.000 RPM",
      "Tanque": "12 litros",
      "Peso": "174 kg",
      "Freios": "Disco ABS + controle de tração"
    }
  }
};

/* ---------- TABELAS (dados locais, identicos a planilha) ----------
   Formato: [pasta, grupo, plano, variacao, codigo, credito, parcela] */
const TABELAS_RAW = [
  ["dominar-ns160", 6001, "44x Normal", "", "BAJ12", 19500, 543.62],
  ["dominar-ns200", 6001, "44x Normal", "", "BAJ14", 22500, 627.27],
  ["dominar-250", 6001, "44x Normal", "", "BAJ07", 23400, 652.33],
  ["pulsar-n150", 6001, "44x Normal", "+LE", "BAJ17", 23571.43, 657.13],
  ["dominar-400", 6001, "44x Normal", "", "BAJ03", 26990, 752.43],
  ["dominar-ns400z", 6001, "44x Normal", "", "BAJ18", 26990, 752.43],
  ["dominar-ns160", 6001, "44x Normal", "+LE", "BAJ13", 27857.14, 776.60],
  ["dominar-ns200", 6001, "44x Normal", "+LE", "BAJ15", 32142.86, 896.08],
  ["dominar-400", 6001, "44x Normal", "120%", "BAJ09", 32388, 902.90],
  ["dominar-ns160", 6001, "44x 70%", "", "BAJ12", 19500, 410.64],
  ["dominar-ns200", 6001, "44x 70%", "", "BAJ14", 22500, 473.81],
  ["dominar-250", 6001, "44x 70%", "", "BAJ07", 23400, 492.77],
  ["pulsar-n150", 6001, "44x 70%", "+LE", "BAJ17", 23571.43, 496.40],
  ["dominar-400", 6001, "44x 70%", "", "BAJ03", 26990, 568.37],
  ["dominar-ns400z", 6001, "44x 70%", "", "BAJ18", 26990, 568.37],
  ["dominar-ns160", 6001, "44x 70%", "+LE", "BAJ13", 27857.14, 586.64],
  ["dominar-ns200", 6001, "44x 70%", "+LE", "BAJ15", 32142.86, 676.90],
  ["dominar-400", 6001, "44x 70%", "120%", "BAJ09", 32388, 682.04],
  ["dominar-ns160", 6000, "68x Normal", "", "BAJ12", 19500, 360.49],
  ["dominar-ns200", 6000, "68x Normal", "", "BAJ14", 22500, 416.00],
  ["dominar-250", 6000, "68x Normal", "", "BAJ07", 23400, 432.58],
  ["pulsar-n150", 6000, "68x Normal", "+LE", "BAJ17", 23571.43, 435.79],
  ["dominar-400", 6000, "68x Normal", "", "BAJ03", 26990, 498.93],
  ["dominar-ns400z", 6000, "68x Normal", "", "BAJ18", 26990, 498.93],
  ["dominar-ns160", 6000, "68x Normal", "+LE", "BAJ13", 27857.14, 515.03],
  ["dominar-ns200", 6000, "68x Normal", "+LE", "BAJ15", 32142.86, 594.19],
  ["dominar-400", 6000, "68x Normal", "120%", "BAJ09", 32388, 598.78],
  ["dominar-250", 6000, "68x Normal", "+LE", "BAJ08", 33428.57, 618.00],
  ["dominar-ns160", 6000, "68x 70%", "", "BAJ12", 19500, 274.48],
  ["dominar-ns200", 6000, "68x 70%", "", "BAJ14", 22500, 316.72],
  ["dominar-250", 6000, "68x 70%", "", "BAJ07", 23400, 329.36],
  ["pulsar-n150", 6000, "68x 70%", "+LE", "BAJ17", 23571.43, 331.77],
  ["dominar-400", 6000, "68x 70%", "", "BAJ03", 26990, 379.87],
  ["dominar-ns400z", 6000, "68x 70%", "", "BAJ18", 26990, 379.87],
  ["dominar-ns160", 6000, "68x 70%", "+LE", "BAJ13", 27857.14, 392.08],
  ["dominar-ns200", 6000, "68x 70%", "+LE", "BAJ15", 32142.86, 452.42],
  ["dominar-400", 6000, "68x 70%", "120%", "BAJ09", 32388, 455.88],
  ["dominar-250", 6000, "68x 70%", "+LE", "BAJ08", 33428.57, 470.50]
];

/* ---------- GRUPOS E MÉDIAS ---------- */
const GRUPOS_INFO = {
  6000: { parcelas: 68, taxaAdm: "18%", vencimento: "10" },
  6001: { parcelas: 44, taxaAdm: "17%", vencimento: "10" }
};
const MEDIAS = { 6000: 70.44, 6001: 62.51 };
let proximaAssembleia = "14/08/2026";
let fundoReserva = "2%";

/* ---------- CORES VISUAIS ---------- */
const CORES_VISUAIS = {
  branca: "#F5F5F5", cinza: "#9CA3AF", preta: "#1F2937",
  vermelha: "#DC2626", azul: "#2563EB", verde: "#16A34A"
};

/* ---------- ESTADO ---------- */
let tabelas = TABELAS_RAW.slice();
let modeloSelecionado = null;
let corSelecionada = null;
let planoSelecionado = null;

const $ = (id) => document.getElementById(id);

/* ---------- HELPERS ---------- */
function formatarDinheiro(v) {
  const n = typeof v === "number" ? v : parseFloat(v);
  if (isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function montarFichaHTML(ficha) {
  return Object.entries(ficha)
    .map(([k, v]) => `<div class="ficha__linha"><span class="ficha__label">${k}</span><span class="ficha__valor">${v}</span></div>`)
    .join("");
}

/* Imagem com fallback de extensao (png -> webp -> placeholder) */
function carregarImagem(el, pasta, cor) {
  const exts = ["png", "webp"];
  let i = 0;
  const tentar = function () {
    if (i >= exts.length) {
      el.src = "assets/logos/logo-bajaj-horizontal.png";
      return;
    }
    el.src = "assets/" + pasta + "/" + cor + "." + exts[i++];
  };
  el.onerror = tentar;
  tentar();
}

function encontrarOferta(modelo, grupo, plano) {
  const base = tabelas.find(t => t[0] === modelo && t[1] === grupo && t[2] === plano && t[3] === "");
  if (base) return base;
  return tabelas.find(t => t[0] === modelo && t[1] === grupo && t[2] === plano);
}

/* ---------- PARSER CSV ---------- */
function parseCSV(texto) {
  const linhas = [];
  let linha = [];
  let campo = "";
  let dentroQuotes = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (dentroQuotes) {
      if (c === '"') {
        if (texto[i + 1] === '"') { campo += '"'; i++; }
        else { dentroQuotes = false; }
      } else { campo += c; }
    } else {
      if (c === '"') { dentroQuotes = true; }
      else if (c === ",") { linha.push(campo); campo = ""; }
      else if (c === "\n") { linha.push(campo); linhas.push(linha); linha = []; campo = ""; }
      else { campo += c; }
    }
  }
  if (campo !== "" || linha.length > 0) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

function limparNumero(s) {
  return parseFloat(String(s).replace(/[R$\s.]/g, "").replace(",", "."));
}

function normalizarNome(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
}

/* ---------- CARREGAR DADOS DA PLANILHA ---------- */
async function carregarDadosPlanilha() {
  try {
    const resp = await fetch(CONFIG.urlAtual);
    if (!resp.ok) throw new Error("falha");
    const dados = {};
    parseCSV(await resp.text()).forEach(l => {
      const [k, v] = l;
      if (k && v && k !== "Chave") dados[k.trim()] = v.trim();
    });
    if (dados.media_menor_lance_6000) MEDIAS[6000] = limparNumero(dados.media_menor_lance_6000);
    if (dados.media_menor_lance_6001) MEDIAS[6001] = limparNumero(dados.media_menor_lance_6001);
    if (dados.proxima_assembleia) proximaAssembleia = dados.proxima_assembleia;
    if (dados.fundo_reserva) fundoReserva = dados.fundo_reserva;
  } catch (e) { /* usa dados locais */ }

  try {
    const resp = await fetch(CONFIG.urlTabelas);
    if (!resp.ok) throw new Error("falha");
    const linhas = parseCSV(await resp.text());
    const novas = [];
    const mapaModelo = {
      "dominarns160": "dominar-ns160",
      "dominarns200": "dominar-ns200",
      "dominar250": "dominar-250",
      "pulsarn150le": "pulsar-n150",
      "pulsarn150": "pulsar-n150",
      "dominar400": "dominar-400",
      "ns400z": "dominar-ns400z",
      "dominar250le": "dominar-250"
    };
    for (let i = 1; i < linhas.length; i++) {
      const [nome, codigo, grupo, plano, credito, parcela] = linhas[i];
      if (!nome || !codigo || !grupo) continue;
      const chave = normalizarNome(nome.replace(/\+ ?le/gi, "").replace(/120%/g, ""));
      const modelo = mapaModelo[chave] || Object.keys(MODELOS).find(k =>
        chave.includes(normalizarNome(MODELOS[k].nome)) ||
        normalizarNome(MODELOS[k].nome).includes(chave)
      );
      if (!modelo) continue;
      const variacao = /\+ ?le/i.test(nome) ? "+LE" : nome.includes("120%") ? "120%" : "";
      novas.push([modelo, parseInt(grupo, 10), plano.trim(), variacao, codigo.trim(), limparNumero(credito), limparNumero(parcela)]);
    }
    if (novas.length >= 38) tabelas = novas;
  } catch (e) { /* usa tabelas locais */ }
}

/* ---------- RENDER: MODELOS ---------- */
function renderModelos() {
  const container = $("listaModelos");
  container.innerHTML = Object.entries(MODELOS).map(([id, m]) => `
    <div class="modelo-card" data-modelo="${id}">
      <p class="modelo-card__nome">${m.nome}</p>
      <p class="modelo-card__cores">${m.cores.join(" · ")}</p>
    </div>
  `).join("");

  container.querySelectorAll(".modelo-card").forEach((card) => {
    card.addEventListener("click", () => {
      container.querySelectorAll(".modelo-card").forEach(c => c.classList.remove("selecionado"));
      card.classList.add("selecionado");
      modeloSelecionado = card.dataset.modelo;
      corSelecionada = null;
      planoSelecionado = null;
      $("btnAvancarModelo").disabled = false;
    });
  });
}

/* ---------- RENDER: CORES ---------- */
function renderCores() {
  if (!modeloSelecionado) return;
  const m = MODELOS[modeloSelecionado];
  $("subtituloModelo").textContent = m.nome;
  const container = $("listaCores");
  container.innerHTML = m.cores.map((cor) => {
    const hex = CORES_VISUAIS[cor] || "#CCCCCC";
    const estilo = cor === "branca"
      ? `background: linear-gradient(135deg, ${hex} 60%, #d1d5db);`
      : `background: ${hex};`;
    return `
      <div class="cor-swatch" data-cor="${cor}">
        <span class="cor-swatch__bola" style="${estilo}"></span>
        <span class="cor-swatch__nome">${cor}</span>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".cor-swatch").forEach((sw) => {
    sw.addEventListener("click", () => {
      container.querySelectorAll(".cor-swatch").forEach(s => s.classList.remove("selecionado"));
      sw.classList.add("selecionado");
      corSelecionada = sw.dataset.cor;
      $("btnAvancarCor").disabled = false;
    });
  });
}

/* ---------- RENDER: VISUALIZACAO ---------- */
function renderVisualizacao() {
  const m = MODELOS[modeloSelecionado];
  carregarImagem($("imgMoto"), m.pasta, corSelecionada);
  $("imgMoto").alt = m.nome + " " + corSelecionada;
  $("fichaTecnica").innerHTML = "<h3>Ficha técnica — " + m.nome + "</h3>" + montarFichaHTML(m.ficha);
}

/* ---------- RENDER: PLANOS ---------- */
function renderPlanos() {
  const combos = [
    { grupo: 6001, plano: "44x Normal" },
    { grupo: 6001, plano: "44x 70%" },
    { grupo: 6000, plano: "68x Normal" },
    { grupo: 6000, plano: "68x 70%" }
  ];
  const container = $("listaPlanos");
  container.innerHTML = combos.map(c => {
    const info = GRUPOS_INFO[c.grupo];
    const oferta = encontrarOferta(modeloSelecionado, c.grupo, c.plano);
    if (!oferta) return "";
    const rotulo = oferta[3] ? " (" + oferta[3] + ")" : "";
    return `
      <div class="plano-card" data-grupo="${c.grupo}" data-plano="${c.plano}">
        <p class="plano-card__titulo">Grupo ${c.grupo} · ${c.plano}${rotulo}</p>
        <div class="plano-card__linha"><span>Parcelas</span><strong>${info.parcelas}x</strong></div>
        <div class="plano-card__linha"><span>Taxa de administração</span><strong>${info.taxaAdm}</strong></div>
        <div class="plano-card__linha"><span>Vencimento</span><strong>dia ${info.vencimento}</strong></div>
        <div class="plano-card__parcela">Parcela: ${formatarDinheiro(oferta[6])}</div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".plano-card").forEach((card) => {
    card.addEventListener("click", () => {
      container.querySelectorAll(".plano-card").forEach(c => c.classList.remove("selecionado"));
      card.classList.add("selecionado");
      planoSelecionado = { grupo: parseInt(card.dataset.grupo, 10), plano: card.dataset.plano };
      $("btnAvancarGrupo").disabled = false;
    });
  });
}

/* ---------- RENDER: MEDIA ---------- */
function renderMedia() {
  const grupo = planoSelecionado.grupo;
  const media = MEDIAS[grupo];
  const info = GRUPOS_INFO[grupo];
  $("cardMedia").innerHTML = `
    <div class="media-card">
      <p class="media-card__label">Média do menor lance contemplado · Grupo ${grupo}</p>
      <p class="media-card__valor">${media.toLocaleString("pt-BR")}%</p>
      <p class="media-card__info">Taxa de administração ${info.taxaAdm} · Fundo de reserva ${fundoReserva} · Próxima assembleia ${proximaAssembleia}</p>
    </div>
  `;
}

/* ---------- RENDER: RESUMO ---------- */
function renderResumo() {
  const m = MODELOS[modeloSelecionado];
  const info = GRUPOS_INFO[planoSelecionado.grupo];
  const oferta = encontrarOferta(modeloSelecionado, planoSelecionado.grupo, planoSelecionado.plano);
  const cor = corSelecionada.charAt(0).toUpperCase() + corSelecionada.slice(1);
  const nomeCliente = $("nomeCliente").value.trim() || "—";
  const variacao = oferta[3] ? " (" + oferta[3] + ")" : "";

  const linhas = [
    ["Modelo", m.nome + variacao],
    ["Cor", cor],
    ["Cliente", nomeCliente],
    ["Grupo", String(planoSelecionado.grupo)],
    ["Plano", planoSelecionado.plano],
    ["Parcelas", info.parcelas + "x"],
    ["Taxa de administração", info.taxaAdm],
    ["Valor do crédito", formatarDinheiro(oferta[5])],
    ["Parcela atual", formatarDinheiro(oferta[6])],
    ["Média do menor lance contemplado", MEDIAS[planoSelecionado.grupo].toLocaleString("pt-BR") + "%"],
    ["Próxima assembleia", proximaAssembleia]
  ];

  $("cardResumo").innerHTML = linhas
    .map(([k, v]) => `<div class="resumo__linha"><span class="resumo__label">${k}</span><span class="resumo__valor">${v}</span></div>`)
    .join("");
}

/* ---------- NAVEGACAO ---------- */
function irParaEtapa(n) {
  document.querySelectorAll(".card[data-etapa], .card").forEach((card) => {
    if (card.id && card.id.indexOf("etapa-") === 0) {
      card.hidden = parseInt(card.id.replace("etapa-", ""), 10) !== n;
    }
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const ETAPA_ATUAL = () => {
  const cards = ["etapa-modelo","etapa-cor","etapa-visualizacao","etapa-grupo","etapa-media","etapa-dados","etapa-resumo"];
  for (let i = 0; i < cards.length; i++) {
    if (!$("" + cards[i]).hidden) return i + 1;
  }
  return 1;
};

function bindNavegacao() {
  $("btnAvancarModelo").addEventListener("click", () => { renderCores(); irParaEtapa(2); });
  $("btnAvancarCor").addEventListener("click", () => { renderVisualizacao(); irParaEtapa(3); });
  $("btnAvancarVisualizacao").addEventListener("click", () => { renderPlanos(); irParaEtapa(4); });
  $("btnAvancarGrupo").addEventListener("click", () => { renderMedia(); irParaEtapa(5); });
  $("btnAvancarMedia").addEventListener("click", () => { irParaEtapa(6); });
  $("btnAvancarDados").addEventListener("click", () => {
    if (!$("nomeCliente").value.trim()) {
      alert("Preencha o nome do cliente para continuar.");
      return;
    }
    renderResumo();
    irParaEtapa(7);
  });
  document.querySelectorAll("[data-voltar]").forEach((btn) => {
    btn.addEventListener("click", () => irParaEtapa(parseInt(btn.dataset.voltar, 10)));
  });
}

/* ---------- CARTA (PDF) ---------- */
function montarCarta() {
  const m = MODELOS[modeloSelecionado];
  const info = GRUPOS_INFO[planoSelecionado.grupo];
  const oferta = encontrarOferta(modeloSelecionado, planoSelecionado.grupo, planoSelecionado.plano);
  const cor = corSelecionada.charAt(0).toUpperCase() + corSelecionada.slice(1);
  const nomeCliente = $("nomeCliente").value.trim() || "—";
  const nomeVendedor = $("nomeVendedor").value.trim() || "—";
  const whats = $("whatsVendedor").value.trim() || "—";
  const hoje = new Date().toLocaleDateString("pt-BR");
  const variacao = oferta[3] ? " (" + oferta[3] + ")" : "";

  /* usa a mesma imagem ja resolvida na tela */
  const imgMoto = $("imgMoto");
  const srcFinal = imgMoto.currentSrc || imgMoto.src;
  $("cartaImgMoto").src = srcFinal;
  $("cartaImgMoto").alt = m.nome + " " + cor;
  $("cartaModelo").textContent = m.nome + variacao;
  $("cartaCor").textContent = "Cor: " + cor;
  $("cartaFicha").innerHTML = "<div class=\"ficha\">" + montarFichaHTML(m.ficha) + "</div>";

  $("cartaProposta").innerHTML = `
    <h3>Detalhes da proposta</h3>
    <div class="ficha__linha"><span class="ficha__label">Cliente</span><span class="ficha__valor">${nomeCliente}</span></div>
    <div class="ficha__linha"><span class="ficha__label">Vendedor</span><span class="ficha__valor">${nomeVendedor}</span></div>
    <div class="ficha__linha"><span class="ficha__label">WhatsApp</span><span class="ficha__valor">${whats}</span></div>
    <div class="ficha__linha"><span class="ficha__label">Grupo</span><span class="ficha__valor">${planoSelecionado.grupo}</span></div>
    <div class="ficha__linha"><span class="ficha__label">Plano</span><span class="ficha__valor">${planoSelecionado.plano}</span></div>
    <div class="ficha__linha"><span class="ficha__label">Número de parcelas</span><span class="ficha__valor">${info.parcelas}x</span></div>
    <div class="ficha__linha"><span class="ficha__label">Taxa de administração</span><span class="ficha__valor">${info.taxaAdm}</span></div>
    <div class="ficha__linha"><span class="ficha__label">Fundo de reserva</span><span class="ficha__valor">${fundoReserva}</span></div>
    <div class="ficha__linha"><span class="ficha__label">Vencimento da parcela</span><span class="ficha__valor">dia ${info.vencimento}</span></div>
    <div class="ficha__linha"><span class="ficha__label">Valor do crédito</span><span class="ficha__valor">${formatarDinheiro(oferta[5])}</span></div>
    <div class="ficha__linha"><span class="ficha__label">Valor da parcela</span><span class="ficha__valor">${formatarDinheiro(oferta[6])}</span></div>
    <div class="ficha__linha"><span class="ficha__label">Média do menor lance contemplado</span><span class="ficha__valor">${MEDIAS[planoSelecionado.grupo].toLocaleString("pt-BR")}%</span></div>
    <div class="ficha__linha"><span class="ficha__label">Próxima assembleia</span><span class="ficha__valor">${proximaAssembleia}</span></div>
  `;

  $("cartaRodape").innerHTML = `
    <p>Proposta gerada em ${hoje}</p>
    <p>Consórcio Nacional Bajaj · administrado por Âncora Consórcios</p>
  `;
}

/* ---------- GERAR PDF ---------- */
async function gerarPDF() {
  montarCarta();
  const carta = $("carta");
  carta.hidden = false;

  try {
    if (typeof html2canvas === "undefined" || typeof window.jspdf === "undefined") {
      throw new Error("Bibliotecas de PDF não carregaram");
    }
    const canvas = await html2canvas(carta, { scale: 2, useCORS: true, backgroundColor: "#FFFFFF" });
    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const pageWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    let altura = 0;
    let primeira = true;
    while (altura < imgHeight) {
      if (!primeira) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, primeira ? 0 : -altura, pageWidth, imgHeight);
      altura += pageHeight;
      primeira = false;
    }
    pdf.save("Proposta-Consorcio-Bajaj-" + ($("nomeCliente").value.trim() || "Cliente") + ".pdf");
  } catch (e) {
    window.print();
  } finally {
    carta.hidden = true;
  }
}

/* ---------- INIT ---------- */
function init() {
  renderModelos();
  bindNavegacao();
  $("btnGerarPDF").addEventListener("click", gerarPDF);
  carregarDadosPlanilha();
}
document.addEventListener("DOMContentLoaded", init);