// Service Worker для Lead2Build CRM PWA
// Версия для кеширования
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `lead2build-crm-${CACHE_VERSION}`;

// Ресурсы для кеширования
const STATIC_CACHE_URLS = [
  '/mobile',
  '/mobile/leads',
  '/mobile/tasks',
  '/mobile/voting',
  '/favicon.ico',
  '/next.svg',
  '/vercel.svg',
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...', CACHE_NAME);
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_CACHE_URLS);
    }).catch((error) => {
      console.error('[SW] Cache installation failed:', error);
    })
  );
  
  // Активировать немедленно
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...', CACHE_NAME);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('lead2build-crm-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  
  // Взять контроль над всеми клиентами
  return self.clients.claim();
});

// Fetch стратегия: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Игнорируем Chrome extensions и другие протоколы
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Игнорируем запросы к API (они всегда должны идти в сеть)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Если API недоступно, возвращаем ошибку
        return new Response(
          JSON.stringify({ error: 'Нет подключения к серверу' }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  }
  
  // Для остальных ресурсов: Network First, fallback to Cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Если получили ответ, кешируем его
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Если сеть недоступна, пробуем взять из кеша
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', request.url);
            return cachedResponse;
          }
          
          // Если нет в кеше и это HTML страница, показываем оффлайн страницу
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/mobile');
          }
          
          // Для остальных ресурсов возвращаем ошибку
          return new Response('Offline - ресурс недоступен', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Background Sync (опционально, для будущего)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Здесь можно добавить логику синхронизации данных
      Promise.resolve()
    );
  }
});

console.log('[SW] Service Worker loaded');

