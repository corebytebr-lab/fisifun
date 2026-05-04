// FisiFun service worker — offline-first para app shell estático.
const VERSION = "fisifun-v3";
const CORE = ["/", "/trilha/", "/formulas/", "/flashcards/", "/notas/", "/plano/", "/calc/", "/duvida/", "/conquistas/", "/perfil/", "/configuracoes/", "/estatisticas/", "/treino/", "/revisao/", "/prova/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(CORE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET") return;
  // Nunca cachear chamadas pra Google/Gemini
  if (url.hostname.includes("googleapis.com")) return;
  // Nunca cachear /api/ — sempre rede direto (dados sempre frescos)
  if (url.pathname.startsWith("/api/")) return;
  // Nunca cachear chunks/HMR do Next dev/turbopack
  if (url.pathname.startsWith("/_next/")) return;

  // Navegações → network first, fallback pro cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((r) => {
          const copy = r.clone();
          caches.open(VERSION).then((c) => c.put(request, copy)).catch(() => {});
          return r;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Assets estáticos → cache first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((r) => {
          if (r.status === 200) {
            const copy = r.clone();
            caches.open(VERSION).then((c) => c.put(request, copy)).catch(() => {});
          }
          return r;
        });
      })
    );
  }
});
