// Estuda Buarque v2 · casca (Cirurgia 9b): o mínimo para o celular aceitar instalar como app.
// Guarda só os arquivos da casca (para ela abrir mesmo com a internet fraca); o app de verdade vem sempre do Google.
const CACHE = 'casca-eb-1';
const ARQUIVOS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
    .then(() => self.clients.claim()));
});

// Primeiro a internet (para pegar a casca nova se você trocar algo no GitHub); sem internet, a cópia guardada.
self.addEventListener('fetch', (e) => {
  const pedido = e.request;
  if (pedido.method !== 'GET' || new URL(pedido.url).origin !== self.location.origin) return;
  e.respondWith(fetch(pedido).then((resp) => {
    if (resp.ok) { const copia = resp.clone(); caches.open(CACHE).then((c) => c.put(pedido, copia)); }
    return resp;
  }).catch(() => caches.match(pedido)));
});
