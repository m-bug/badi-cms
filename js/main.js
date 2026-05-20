async function init() {
  const openingEl = document.getElementById("opening-hours");
  const eventsEl = document.getElementById("events-list");
  const restaurantEl = document.getElementById("restaurant");
  const blogEl = document.getElementById("blog-list");

  try {
    const manifest = await Content.loadYaml("/content/manifest.json");
    const [hours, restaurant] = await Promise.all([
      Content.loadYaml("/data/opening-hours.yml"),
      Content.loadYaml("/data/restaurant.yml"),
    ]);

    Content.renderOpeningHours(hours, openingEl);
    Content.renderRestaurant(restaurant, restaurantEl);

    const eventPaths = Content.pathsFromManifest(manifest.events);
    const blogPaths = Content.pathsFromManifest(manifest.blog);

    const [events, posts] = await Promise.all([
      Content.loadItems(eventPaths, "/content/events"),
      Content.loadItems(blogPaths, "/content/blog"),
    ]);

    eventsEl.innerHTML = events.length
      ? events.map((e) => Content.renderCard(e, "event")).join("")
      : "<p>Noch keine Termine.</p>";

    const published = posts.filter((p) => !p.meta.draft);

    blogEl.innerHTML = published.length
      ? published.map((p) => Content.renderCard(p, "blog")).join("")
      : "<p>Noch keine Blog-Artikel.</p>";
  } catch (err) {
    console.error(err);
    const msg = `<p class="error">Inhalte konnten nicht geladen werden. (${Content.escapeHtml(err.message)})</p>`;
    [openingEl, eventsEl, restaurantEl, blogEl].forEach((el) => {
      if (el.querySelector(".loading")) el.innerHTML = msg;
    });
  }
}

init();
