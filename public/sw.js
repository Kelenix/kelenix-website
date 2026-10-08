// Service worker de l'espace d'administration Kelenix.
// Il ne sert qu'aux notifications push : aucune mise en cache, aucune requête interceptée.

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/icons/admin-192.png",
        data: { url: data.url || "/admin" },
      }),
      // Les onglets de l'admin déjà ouverts mettent à jour leurs pastilles « nouveaux ».
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clients) => clients.forEach((client) => client.postMessage({ type: "kelenix-push" }))),
    ])
  );
});

// Clic sur la notification : on réutilise un onglet de l'admin s'il y en a un, sinon on en ouvre un.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || "/admin", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const admin = clients.find((client) => new URL(client.url).pathname.startsWith("/admin"));
      if (!admin) return self.clients.openWindow(url);
      return admin
        .navigate(url)
        .then((client) => (client || admin).focus())
        .catch(() => self.clients.openWindow(url));
    })
  );
});
