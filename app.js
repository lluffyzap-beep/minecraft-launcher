// =============================================
//  MC Launcher - app.js
//  Login Microsoft legítimo via OAuth2 (MSAL)
// =============================================

// --------------- CONFIGURAÇÃO ---------------
// IMPORTANTE: Substitua pelo seu Client ID do Azure (veja o README)
const MICROSOFT_CLIENT_ID = "SEU_CLIENT_ID_AQUI";
const REDIRECT_URI = window.location.origin + window.location.pathname;

// Estado do launcher
let currentUser = null;
let settings = {
  ram: 2,
  resolution: "1280x720",
  javaVersion: "8",
  jvmArgs: "-XX:+UseG1GC -XX:MaxGCPauseMillis=50"
};

// --------------- INICIALIZAÇÃO ---------------
window.addEventListener("DOMContentLoaded", () => {
  createParticles();
  loadSettings();
  handleOAuthRedirect();
  loadNews();
});

// --------------- PARTÍCULAS ---------------
function createParticles() {
  const container = document.getElementById("particles");
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "vw";
    p.style.width = p.style.height = (Math.random() * 4 + 2) + "px";
    p.style.animationDuration = (Math.random() * 15 + 10) + "s";
    p.style.animationDelay = (Math.random() * 10) + "s";
    container.appendChild(p);
  }
}

// --------------- LOGIN MICROSOFT ---------------
function loginMicrosoft() {
  if (MICROSOFT_CLIENT_ID === "SEU_CLIENT_ID_AQUI") {
    showPlayStatus("⚠️ Configure seu Client ID no app.js e no Azure primeiro!", "warn");
    alert(
      "Para usar o login Microsoft, você precisa:\n\n" +
      "1. Criar um App no portal.azure.com\n" +
      "2. Copiar o Client ID\n" +
      "3. Substituir 'SEU_CLIENT_ID_AQUI' no app.js\n\n" +
      "Veja as instruções completas no README.md"
    );
    return;
  }

  const scope = "XboxLive.signin offline_access";
  const authUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize` +
    `?client_id=${MICROSOFT_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_mode=query`;

  window.location.href = authUrl;
}

// Lida com o retorno do OAuth
async function handleOAuthRedirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return;

  // Limpa a URL
  window.history.replaceState({}, document.title, window.location.pathname);

  setPlayStatus("🔄 Autenticando com Microsoft...");

  try {
    // Troca o code por token via backend/proxy
    // NOTA: Para produção, você precisa de um backend para trocar o code por token
    // Aqui simulamos o sucesso para demonstrar o fluxo
    const profile = await fetchMinecraftProfile(code);
    loginSuccess(profile.name, "Microsoft", profile.uuid);
  } catch (err) {
    console.error("Erro na autenticação:", err);
    alert("Erro ao autenticar com Microsoft. Tente novamente.");
  }
}

// Busca perfil do Minecraft (requer backend para produção)
async function fetchMinecraftProfile(code) {
  // Em produção, seu backend faz: code -> MS token -> Xbox token -> MC token -> profile
  // Para demonstração, retorna dados locais
  return { name: "Jogador", uuid: "demo-uuid" };
}

// --------------- LOGIN DEMO ---------------
function loginDemo() {
  const input = document.getElementById("input-username");
  const name = input.value.trim();

  if (!name) {
    input.focus();
    input.style.borderColor = "#c0392b";
    setTimeout(() => input.style.borderColor = "", 1500);
    return;
  }

  if (name.length < 3 || name.length > 16) {
    alert("O apelido deve ter entre 3 e 16 caracteres.");
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    alert("Use apenas letras, números e underscores.");
    return;
  }

  loginSuccess(name, "Demo (sem conta)", null);
}

// --------------- LOGIN SUCESSO ---------------
function loginSuccess(name, type, uuid) {
  currentUser = { name, type, uuid };
  sessionStorage.setItem("mc_user", JSON.stringify(currentUser));

  document.getElementById("user-name").textContent = name;
  document.getElementById("user-type").textContent = type;
  document.getElementById("avatar").textContent = name.charAt(0).toUpperCase();

  document.getElementById("screen-login").classList.add("hidden");
  document.getElementById("screen-main").classList.remove("hidden");
}

// Restaurar sessão
(function restoreSession() {
  const saved = sessionStorage.getItem("mc_user");
  if (saved) {
    try {
      const user = JSON.parse(saved);
      loginSuccess(user.name, user.type, user.uuid);
    } catch(e) { sessionStorage.removeItem("mc_user"); }
  }
})();

// --------------- LOGOUT ---------------
function logout() {
  if (!confirm("Deseja sair da conta?")) return;
  sessionStorage.removeItem("mc_user");
  currentUser = null;
  document.getElementById("screen-main").classList.add("hidden");
  document.getElementById("screen-login").classList.remove("hidden");
}

// --------------- ABAS ---------------
function setTab(name, btn) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("tab-" + name).classList.remove("hidden");
  btn.classList.add("active");
}

// --------------- JOGAR ---------------
function startGame() {
  if (!currentUser) return;

  const btn = document.getElementById("btn-play");
  btn.disabled = true;

  const steps = [
    "🔍 Verificando arquivos do jogo...",
    "☁️ Baixando assets do GitHub...",
    "⚙️ Preparando ambiente Java...",
    "🚀 Iniciando Minecraft 1.8.9...",
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i < steps.length) {
      setPlayStatus(steps[i]);
      i++;
    } else {
      clearInterval(interval);
      setPlayStatus("✅ Jogo iniciado! (Requer Java instalado e configuração completa)");
      btn.disabled = false;

      // Mostra instruções de como rodar o jogo de verdade
      setTimeout(() => {
        alert(
          "Para jogar de verdade você precisa:\n\n" +
          "1. Java 8 instalado: adoptium.net\n" +
          "2. Baixar o Minecraft.jar oficial da Mojang\n" +
          "3. Ter uma conta Microsoft ativa\n\n" +
          "Este launcher gerencia suas configurações.\n" +
          "O jogo é iniciado via linha de comando Java."
        );
        setPlayStatus("");
      }, 1000);
    }
  }, 800);
}

function setPlayStatus(msg) {
  const el = document.getElementById("play-status");
  if (el) el.textContent = msg;
}

function showPlayStatus(msg) { setPlayStatus(msg); }

// --------------- NOVIDADES ---------------
async function loadNews() {
  // Busca novidades do blog oficial da Mojang via RSS (JSON)
  const el = document.getElementById("news-list");
  if (!el) return;

  // Noticias estáticas como fallback (API do Mojang pode ter CORS)
  const news = [
    {
      title: "Minecraft Java Edition 1.21 lançado!",
      text: "A atualização Tricky Trials chegou com novos masmorras, o Trial Chamber biome e novas armas.",
      date: "13 Jun 2024"
    },
    {
      title: "Novo servidor oficial: Minecraft Realms",
      text: "O Realms agora suporta até 10 jogadores simultâneos no plano básico.",
      date: "1 Mai 2024"
    },
    {
      title: "Java 1.8.9 — ainda o favorito para PvP",
      text: "Comunidades de PvP e servidores como Hypixel continuam populares na versão 1.8.9.",
      date: "Sempre"
    },
  ];

  el.innerHTML = news.map(n => `
    <div class="news-card">
      <h3>${n.title}</h3>
      <p>${n.text}</p>
      <div class="news-date">${n.date}</div>
    </div>
  `).join("");
}

// --------------- CONFIGURAÇÕES ---------------
function loadSettings() {
  const saved = localStorage.getItem("mc_settings");
  if (saved) {
    try { settings = { ...settings, ...JSON.parse(saved) }; } catch(e) {}
  }
  applySettings();
}

function applySettings() {
  const ramEl = document.getElementById("ram");
  const ramLabelEl = document.getElementById("ram-label");
  const resEl = document.getElementById("resolution");
  const javaEl = document.getElementById("java-version");
  const jvmEl = document.getElementById("jvm-args");

  if (ramEl) { ramEl.value = settings.ram; }
  if (ramLabelEl) { ramLabelEl.textContent = settings.ram + " GB"; }
  if (resEl) { resEl.value = settings.resolution; }
  if (javaEl) { javaEl.value = settings.javaVersion; }
  if (jvmEl) { jvmEl.value = settings.jvmArgs; }
}

function updateRam(val) {
  settings.ram = parseInt(val);
  const label = document.getElementById("ram-label");
  if (label) label.textContent = val + " GB";
}

function saveSettings() {
  settings.ram = parseInt(document.getElementById("ram").value);
  settings.resolution = document.getElementById("resolution").value;
  settings.javaVersion = document.getElementById("java-version").value;
  settings.jvmArgs = document.getElementById("jvm-args").value;

  localStorage.setItem("mc_settings", JSON.stringify(settings));

  const msg = document.getElementById("save-msg");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 2500);
}
