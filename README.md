# 🎮 MC Launcher — Minecraft 1.8.9

Launcher web hospedado no GitHub Pages. Nenhum arquivo salvo no seu PC.

---

## 📋 Passo a Passo Completo

### PASSO 1 — Subir os arquivos no GitHub

1. Crie um repositório chamado `minecraft-launcher` (público)
2. Faça upload dos 4 arquivos: `index.html`, `style.css`, `app.js`, `README.md`
3. No repositório, vá em **Settings → Pages**
4. Em **Source**, selecione `Deploy from a branch`
5. Branch: `main`, pasta: `/ (root)` → clique **Save**
6. Aguarde ~2 minutos e acesse: `https://SEU_USUARIO.github.io/minecraft-launcher`

---

### PASSO 2 — Configurar login Microsoft (opcional)

Para o botão "Entrar com Microsoft" funcionar:

1. Acesse [portal.azure.com](https://portal.azure.com)
2. Busque **"App registrations"** → **New registration**
3. Nome: `MC Launcher`
4. Supported account types: **Personal Microsoft accounts only**
5. Redirect URI: `Web` → `https://SEU_USUARIO.github.io/minecraft-launcher/`
6. Clique **Register**
7. Copie o **Application (client) ID**
8. No `app.js`, linha 8, substitua:
   ```
   const MICROSOFT_CLIENT_ID = "SEU_CLIENT_ID_AQUI";
   ```
   pelo seu ID copiado.

> ⚠️ **Nota:** O login Microsoft completo requer um backend para trocar o authorization code pelo token do Minecraft. Para uso local/pessoal, o launcher já gerencia configurações e exibe a interface completa.

---

### PASSO 3 — Para jogar de verdade

O launcher gerencia configurações. Para iniciar o jogo você precisa:

1. **Java 8** instalado: [adoptium.net](https://adoptium.net)
2. **Minecraft comprado** em [minecraft.net](https://minecraft.net)
3. O launcher oficial da Mojang baixa os arquivos do jogo

---

## 🗂️ Arquivos do projeto

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Estrutura do launcher |
| `style.css` | Visual temático Minecraft |
| `app.js` | Lógica, login e configurações |
| `README.md` | Este guia |

---

## ✅ Funcionalidades

- [x] Tela de login com botão Microsoft
- [x] Configurações de RAM, resolução e Java
- [x] Visual temático Minecraft (creeper, pixel art)
- [x] Partículas animadas
- [x] Sem armazenamento local (GitHub Pages)
- [x] Aba de novidades
