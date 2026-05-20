/**
 * Lädt Markdown- und YAML-Dateien und rendert sie ins DOM.
 */
const Content = {
  async fetchText(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} (${res.status})`);
    return res.text();
  },

  parseFrontMatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
      return { meta: {}, body: raw };
    }
    const meta = jsyaml.load(match[1]) || {};
    return { meta, body: match[2].trim() };
  },

  formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  },

  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  async loadYaml(url) {
    const text = await this.fetchText(url);
    return jsyaml.load(text);
  },

  async loadMarkdown(url) {
    const raw = await this.fetchText(url);
    const { meta, body } = this.parseFrontMatter(raw);
    return {
      meta,
      html: marked.parse(body),
    };
  },

  renderOpeningHours(data, el) {
    const rows = (data.days || [])
      .map(
        (day) =>
          `<tr><th scope="row">${this.escapeHtml(day.label)}</th><td>${this.escapeHtml(day.hours)}</td></tr>`
      )
      .join("");

    const note = data.note
      ? `<p class="note">${this.escapeHtml(data.note)}</p>`
      : "";

    el.innerHTML = `
      <p>${this.escapeHtml(data.season || "")}</p>
      <table class="hours-table">
        <tbody>${rows}</tbody>
      </table>
      ${note}
    `;
  },

  renderRestaurant(data, el) {
    const menuLink = data.menu_pdf
      ? `<a class="btn" href="${this.escapeHtml(data.menu_pdf)}" target="_blank" rel="noopener">Speisekarte (PDF)</a>`
      : "";

    el.innerHTML = `
      <p class="restaurant-title">${this.escapeHtml(data.title || "Restaurant")}</p>
      <p>${this.escapeHtml(data.description || "")}</p>
      ${menuLink}
    `;
  },

  renderCard(item, type) {
    const dateLabel =
      type === "event" ? "Termin" : "Veröffentlicht";
    const date = this.formatDate(item.meta.date);

    return `
      <article class="card">
        <h3>${this.escapeHtml(item.meta.title || "Ohne Titel")}</h3>
        <p class="card-meta">${dateLabel}: ${date}</p>
        ${item.meta.intro ? `<p class="card-intro">${this.escapeHtml(item.meta.intro)}</p>` : ""}
        <div class="card-body">${item.html}</div>
      </article>
    `;
  },

  pathsFromManifest(list) {
    return (list || [])
      .map((item) => (typeof item === "string" ? item : item.path))
      .filter(Boolean);
  },

  async loadItems(paths, baseUrl) {
    const items = await Promise.all(
      paths.map(async (file) => {
        const { meta, html } = await this.loadMarkdown(`${baseUrl}/${file}`);
        return { meta, html, file };
      })
    );

    return items.sort((a, b) => {
      const da = new Date(a.meta.date || 0);
      const db = new Date(b.meta.date || 0);
      return db - da;
    });
  },
};
