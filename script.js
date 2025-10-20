// ===================== Tabs & Panels =====================
const allLinks = document.querySelectorAll(".tabs a");
const allTabs  = document.querySelectorAll(".tab-content");

// ===================== Avatars & fallbacks =====================
const AVATARS = [
  "https://randomuser.me/api/portraits/women/1.jpg",
  "https://randomuser.me/api/portraits/men/2.jpg",
  "https://randomuser.me/api/portraits/women/3.jpg",
  "https://randomuser.me/api/portraits/men/4.jpg",
];
const AVATAR_FALLBACK = "https://placehold.co/40x40?text=U";
const IMG_FALLBACK    = "https://placehold.co/80x80?text=IMG";

// ===================== Data =====================
const tabRecords = [
  { company:{src:"https://picsum.photos/seed/electronics-phone/600/600", name:"Apple iPhone 13"}, role:"iPhone 13 Pro Max", type:"electronics", salary:"$999", location:"New York, United States", applicants:["u1","u2","u3"], applicationsCount:124 },
  { company:{src:"https://picsum.photos/seed/electronics-headphones/600/600", name:"Sony Headphones"}, role:"Sony WH-1000XM4", type:"electronics", salary:"$299", location:"Los Angeles, United States", applicants:["u2","u4","u1"], applicationsCount:83 },
  { company:{src:"https://picsum.photos/seed/electronics-camera/600/600", name:"Canon Camera"}, role:"Canon EOS R10 Mirrorless", type:"electronics", salary:"$1,199", location:"London, United Kingdom", applicants:["u3","u1"], applicationsCount:92 },
  { company:{src:"https://picsum.photos/seed/home-lamp/600/600", name:"Homeify"}, role:"Minimalist Lamp", type:"home", salary:"$49", location:"Los Angeles, United States", applicants:["u4","u1"], applicationsCount:112 },
  { company:{src:"https://picsum.photos/seed/home-chair/600/600", name:"CosyHome"}, role:"Scandinavian Chair", type:"home", salary:"$189", location:"Chicago, United States", applicants:["u2"], applicationsCount:76 },
  { company:{src:"https://picsum.photos/seed/home-plant/600/600", name:"GreenNest"}, role:"Monstera Deliciosa (Large)", type:"home", salary:"$59", location:"Seattle, United States", applicants:["u3","u4"], applicationsCount:61 },
  { company:{src:"https://picsum.photos/seed/fashion-shoes/600/600", name:"Adidas"}, role:"Adidas Ultraboost 22", type:"fashion", salary:"$180", location:"Manchester, United Kingdom", applicants:["u1","u2"], applicationsCount:67 },
  { company:{src:"https://picsum.photos/seed/fashion-jeans/600/600", name:"Levi's"}, role:"Levi's 501 Original Jeans", type:"fashion", salary:"$79", location:"New York, United States", applicants:["u3"], applicationsCount:55 },
];

// ===================== Filters (map existing names) =====================
const filter = {
  all: () => true,
  electronics: (r) => r.type === "electronics",
  home: (r) => r.type === "home",
  fashion: (r) => r.type === "fashion",
  // HTML tab names mapped to categories
  "remote":  (r) => r.type === "electronics",
  "on-site": (r) => r.type === "home",
  "hybrid":  (r) => r.type === "fashion",
};

// ===================== Sanitize helper =====================
const sanitize = (html) =>
  (window.DOMPurify && DOMPurify.sanitize) ? DOMPurify.sanitize(html) : html;

// Inline location icon
const LOCATION_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
          stroke="#555" stroke-width="2" fill="none"/>
    <circle cx="12" cy="10" r="2.5" stroke="#555" stroke-width="2" fill="none"/>
  </svg>`;

// ===================== Bookmarks state & helpers =====================
const bookmarkFab       = document.getElementById("bookmark-fab");
const bookmarkPanel     = document.getElementById("bookmark-panel");
const bookmarkCloseBtn  = document.getElementById("bookmark-close");
const bookmarkListEl    = document.getElementById("bookmark-list");
const bookmarkCheckout  = document.getElementById("bookmark-checkout");
const bookmarkCountEl   = document.getElementById("bookmark-count");

const bookmarks = new Map(); // unique by UID

const makeUID   = (item) => `${item.company.name}__${item.role}`.toLowerCase().replace(/\s+/g, "_");
const shortDesc = (item) => `${item.role} • ${item.location}`;

function addBookmark(item) {
  const uid = makeUID(item);
  if (!bookmarks.has(uid)) {
    bookmarks.set(uid, {
      id: uid,
      title: item.company.name,
      price: item.salary,
      role: item.role,                 // NEW
      location: item.location,         // NEW
      thumb: item.company.src,
    });
  }
  renderBookmarks();
}
function removeBookmark(uid) { bookmarks.delete(uid); renderBookmarks(); }
function isBookmarked(item)  { return bookmarks.has(makeUID(item)); }

function renderBookmarks() {
  const items = [...bookmarks.values()];
  bookmarkCountEl.textContent = String(items.length);

  // Toggle footer Checkout visibility
  const footer = document.getElementById("bookmark-footer");
  footer.style.display = items.length ? "flex" : "none";

  if (!items.length) {
    bookmarkListEl.innerHTML = "";      // CSS empty state will display
    bookmarkPanel.setAttribute("aria-hidden", "true");
    return;
  }

  // Build list (trash icon bottom-left; no per-item checkout)
 bookmarkListEl.innerHTML = items.map(it => sanitize(`
  <div class="bookmark-item" data-id="${it.id}">
    <img class="bookmark-thumb" src="${it.thumb}" alt="${it.title} image"
         onerror="this.onerror=null;this.src='${IMG_FALLBACK}';">

    <div class="bookmark-meta">
      <div class="bookmark-title">${it.title}</div>
      <div class="bookmark-role">${it.role}</div>
      <div class="bookmark-loc">
        ${LOCATION_ICON} ${it.location}
      </div>
      <span class="bookmark-price">${it.price}</span>
    </div>

    <button class="bm-delete" aria-label="Remove saved item" title="Remove" data-id="${it.id}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path><path d="M14 11v6"></path>
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>
  </div>
`)).join("");

}

// Panel open/close
bookmarkFab.addEventListener("click", () => {
  const open = bookmarkPanel.getAttribute("aria-hidden") === "false";
  bookmarkPanel.setAttribute("aria-hidden", open ? "true" : "false");
});
bookmarkCloseBtn.addEventListener("click", () => {
  bookmarkPanel.setAttribute("aria-hidden", "true");
});

// Saved list: delete item
bookmarkListEl.addEventListener("click", (e) => {
  const delBtn = e.target.closest(".bm-delete");
  if (delBtn) {
    removeBookmark(delBtn.dataset.id);
  }
});

// Checkout all (single main button)
bookmarkCheckout.addEventListener("click", () => {
  if (!bookmarks.size) return;
  const list = [...bookmarks.values()].map(i => `${i.title} (${i.price})`).join("\n• ");
  alert(`Checkout items:\n• ${list}`);
});

// ===================== Render cards =====================
function generateTabItems(linkEl, tabContentEl) {
  if (!linkEl || !tabContentEl) return;
  const filterName = (linkEl.getAttribute("name") || "all").trim();
  const filterFn = filter[filterName] || filter.all;

  const cards = tabRecords.filter(filterFn).map((item) => {
    const bookmarked = isBookmarked(item);
    const btnLabel   = bookmarked ? "Saved" : "Save item";
    const btnClass   = bookmarked ? "is-bookmarked" : "";

    return sanitize(`
      <div class="job">
        <div class="job__main">
          <div class="job__company">
            <img src="${item.company.src}"
                 class="job__avatar job__avatar--${item.company.name.replace(/\s+/g, "-").toLowerCase()}"
                 alt="${item.company.name} image" width="64" height="64" loading="lazy"
                 onerror="this.onerror=null;this.src='${IMG_FALLBACK}';">
          </div>
          <div class="job__description">
            <div class="job__name">
              <div class="job__role">
                ${item.role} <span class="job__type">(${item.type})</span>
              </div>
              <button type="button" class="job__bookmark ${btnClass}"
                      aria-label="${btnLabel}" title="${btnLabel}"
                      data-uid="${makeUID(item)}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" stroke="#333531"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
                </svg>
                <span class="visually-hidden">${btnLabel}</span>
              </button>
            </div>
            <div class="job__company">${item.company.name}</div>
            <div class="job__location">
              ${LOCATION_ICON}
              ${item.location}
            </div>
          </div>
        </div>
        <div class="job__bottom">
          <div class="job__applicants">
            ${
              item.applicants.map((_, i) => {
                const src = AVATARS[i % AVATARS.length];
                return `<img src="${src}" alt="user" class="job__applicant" width="28" height="28"
                            onerror="this.onerror=null;this.src='${AVATAR_FALLBACK}';">`;
              }).join("")
            }
            +${item.applicationsCount} interested
          </div>
          <div class="job__salary">${item.salary}</div>
        </div>
      </div>
    `);
  });

  tabContentEl.innerHTML = cards.join("");
}

// ===================== Tabs click handling =====================
allLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    allLinks.forEach(l => l.classList.toggle("active", l === link));

    allTabs.forEach((panel) => {
      const isActive = panel.id === `${link.id}-content`;
      panel.classList.toggle("tab-content--active", isActive);
      if (isActive) generateTabItems(link, panel);
    });

    const newHash = `#${link.id}`;
    if (window.location.hash !== newHash) history.replaceState(null, "", newHash);
  });
});

// ===================== Bookmark buttons in cards (delegated) =====================
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".job__bookmark");
  if (!btn) return;

  const uid = btn.dataset.uid;
  const item = tabRecords.find(r => makeUID(r) === uid);
  if (!item) return;

  if (bookmarks.has(uid)) {
    bookmarks.delete(uid);
    btn.classList.remove("is-bookmarked");
  } else {
    addBookmark(item);
    btn.classList.add("is-bookmarked");
    bookmarkPanel.setAttribute("aria-hidden", "false"); // open on save
  }
  renderBookmarks();
});

// ===================== Initial load =====================
(function init() {
  let activeLink = allLinks[0] || null;
  if (window.location.hash) {
    const candidate = document.querySelector(`.tabs a${window.location.hash}`);
    if (candidate) activeLink = candidate;
  }
  if (!activeLink) return;

  activeLink.classList.add("active");
  const activePanel = document.getElementById(`${activeLink.id}-content`);
  if (activePanel) {
    activePanel.classList.add("tab-content--active");
    generateTabItems(activeLink, activePanel);
  }
  renderBookmarks();
})();
