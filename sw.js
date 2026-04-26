// sw.js - Service Worker Proxy
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // إذا كان الطلب من zakidev.shop
    if (url.hostname === 'zakidev.shop') {
        // إعادة توجيه إلى Cloudflare Worker أو Pages
        const proxyUrl = 'https://zakidev.pages.dev' + url.pathname;
        
        event.respondWith(
            fetch(proxyUrl).catch(() => {
                return fetch(event.request); // fallback
            })
        );
    }
});