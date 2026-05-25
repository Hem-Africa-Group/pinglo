const STORAGE_KEY = "pinglo:production:v2";
const LEGACY_STORAGE_KEY = "plingo:production:v2";
const PINGLO_AWS_API_URL = (window.PINGLO_AWS_API_URL || "").replace(/\/$/, "");
const PINGLO_AWS_USER_ID_KEY = "pinglo:aws:user-id";

let awsSyncTimer = null;

const icons = {
  home: '<svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></svg>',
  feed: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  inbox: '<svg viewBox="0 0 24 24"><path d="M4 4h16v13a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z"/><path d="m4 13 4 4h8l4-4"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.37a1.7 1.7 0 0 0-1 .57V20a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-.57 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-.57-1H4a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 .57-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06A2 2 0 1 1 7.09 4.2l.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-.57V4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 .57 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.37 9c.2.33.39.66.57 1H20a2 2 0 1 1 0 4h-.09c-.18.34-.37.67-.57 1Z"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  userPlus: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>',
  group: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  palette: '<svg viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 1 10-10 4 4 0 0 1-4 4h-1.5a2 2 0 0 0-1.7 3.05c.58.96-.12 2.95-2.8 2.95Z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/></svg>',
  message: '<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  paperclip: '<svg viewBox="0 0 24 24"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66l-9.2 9.19a2 2 0 1 1-2.83-2.83l8.49-8.48"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  comment: '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  chevron: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
  "chevron-down": '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  database: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>',
  globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>',
  help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.4.7-1.1 1.1-1.7 1.6-.7.6-1.2 1.1-1.2 2.4"/><path d="M12 17h.01"/></svg>',
  file: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M8 9h2"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>'
};

const profileGlyphs = {
  chat: icons.message,
  star: '<svg viewBox="0 0 24 24"><path d="m12 2 3 6.2 6.8 1-4.9 4.8 1.2 6.8L12 17.6l-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1Z"/></svg>',
  rocket: '<svg viewBox="0 0 24 24"><path d="M13 3c4.8.4 7.6 3.2 8 8l-5.3 5.3-5-5Z"/><path d="m7 17-3 3 3.8-.8L10 22l3-3"/><path d="M9 12 5 10l-3 3 5 1"/><path d="m12 15 2 5 3-3-2-4"/><circle cx="15.5" cy="8.5" r="1.5"/></svg>',
  code: '<svg viewBox="0 0 24 24"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 4l-4 16"/></svg>',
  music: '<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
  camera: '<svg viewBox="0 0 24 24"><path d="M4 7h4l2-3h4l2 3h4v13H4Z"/><circle cx="12" cy="13" r="4"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z"/><path d="M8 6h8"/></svg>',
  gamepad: '<svg viewBox="0 0 24 24"><path d="M6 12h4M8 10v4"/><path d="M15 13h.01M18 11h.01"/><path d="M8 7h8a6 6 0 0 1 5.8 4.6l.8 3.2a3 3 0 0 1-5 2.9L15.8 16H8.2l-1.8 1.7a3 3 0 0 1-5-2.9l.8-3.2A6 6 0 0 1 8 7Z"/></svg>',
  crown: '<svg viewBox="0 0 24 24"><path d="m3 8 5 4 4-7 4 7 5-4-2 11H5Z"/><path d="M5 19h14"/></svg>',
  brush: '<svg viewBox="0 0 24 24"><path d="m14 4 6 6-9 9H5v-6Z"/><path d="m14 4 2-2 6 6-2 2"/><path d="M5 19c0 2-3 2-3 2s0-3 2-3"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/></svg>',
  compass: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24"><path d="m13 2-9 13h7l-1 7 10-14h-7Z"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M21 13.5A8.5 8.5 0 1 1 10.5 3 7 7 0 0 0 21 13.5Z"/></svg>',
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
};

const profilePalettes = [
  { id: "sky", label: "Sky", colors: ["#1598e7", "#0b5cff"] },
  { id: "violet", label: "Violet", colors: ["#7a3cff", "#ff61d8"] },
  { id: "mint", label: "Mint", colors: ["#0f9f76", "#25c2ef"] },
  { id: "gold", label: "Gold", colors: ["#f59e0b", "#f97316"] },
  { id: "rose", label: "Rose", colors: ["#ef476f", "#7a3cff"] },
  { id: "indigo", label: "Indigo", colors: ["#4338ca", "#1598e7"] }
];

const profileGlyphList = [
  { id: "chat", label: "Chat" },
  { id: "star", label: "Star" },
  { id: "rocket", label: "Rocket" },
  { id: "code", label: "Code" },
  { id: "music", label: "Music" },
  { id: "camera", label: "Camera" },
  { id: "book", label: "Book" },
  { id: "gamepad", label: "Game" },
  { id: "crown", label: "Crown" },
  { id: "brush", label: "Brush" },
  { id: "mic", label: "Mic" },
  { id: "compass", label: "Compass" },
  { id: "bolt", label: "Bolt" },
  { id: "moon", label: "Moon" },
  { id: "sun", label: "Sun" }
];

const PROFILE_ICONS = profileGlyphList.flatMap((glyph, index) => {
  const first = profilePalettes[index % profilePalettes.length];
  const second = profilePalettes[(index + 3) % profilePalettes.length];
  return [
    { id: `${glyph.id}-${first.id}`, label: `${glyph.label} ${first.label}`, glyph: glyph.id, colors: first.colors },
    { id: `${glyph.id}-${second.id}`, label: `${glyph.label} ${second.label}`, glyph: glyph.id, colors: second.colors }
  ];
});

const root = document.getElementById("pageRoot");
const modalRoot = document.getElementById("modalRoot");
const toastRegion = document.getElementById("toastRegion");

let state = loadState();
let activePage = getRouteFromHash() || "home";
let lastRenderedPage = "";
let feedFilter = "all";
let pendingAttachment = null;

document.addEventListener("DOMContentLoaded", async () => {
  state = await loadStateFromAws();
  applySignedInAccountToState();
  hydrateIcons(document);
  applyTheme();
  bindGlobalEvents();
  renderShell();
  renderPage();
});

window.addEventListener("hashchange", () => {
  activePage = getRouteFromHash() || "home";
  renderPage();
});

function getSignedInAccount() {
  try {
    return JSON.parse(localStorage.getItem("pinglo_account") || "null");
  } catch {
    return null;
  }
}

function applySignedInAccountToState() {
  const account = getSignedInAccount();
  if (!account) return;
  state.profile = {
    ...state.profile,
    id: account.id || state.profile.id,
    email: account.email || state.profile.email,
    username: account.username || state.profile.username,
    name: account.name || state.profile.name,
    handle: account.handle || state.profile.handle,
    bio: account.bio || state.profile.bio || "",
    picture: account.picture || state.profile.picture || "",
    initials: account.initials || state.profile.initials,
    status: account.status || state.profile.status,
    iconId: account.picture ? "" : state.profile.iconId
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function defaultState() {
  return {
    profile: {
      id: "me",
      name: "",
      handle: "",
      status: "Online",
      initials: "PG",
      iconId: "chat-sky",
      theme: "purple"
    },
    conversations: [],
    posts: [],
    recentSearches: [],
    preferences: {
      notifications: true,
      messagePreview: true,
      compactMode: false,
      language: "English",
      privacy: "contacts",
      readReceipts: true
    }
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY));
    return mergeState(defaultState(), saved || {});
  } catch {
    return defaultState();
  }
}

async function loadStateFromAws() {
  if (!isAwsEnabled()) return loadState();

  try {
    const response = await fetch(`${PINGLO_AWS_API_URL}/state`, {
      headers: {
        "x-user-id": getAwsUserId()
      }
    });

    if (!response.ok) throw new Error(`State load failed: ${response.status}`);
    const payload = await response.json();
    const merged = mergeState(defaultState(), payload.state || loadState());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.warn("AWS state load failed; using local state", error);
    return loadState();
  }
}

function mergeState(base, saved) {
  return {
    ...base,
    ...saved,
    profile: { ...base.profile, ...(saved.profile || {}) },
    preferences: { ...base.preferences, ...(saved.preferences || {}) },
    conversations: Array.isArray(saved.conversations) ? saved.conversations : base.conversations,
    posts: Array.isArray(saved.posts) ? saved.posts : base.posts,
    recentSearches: Array.isArray(saved.recentSearches) ? saved.recentSearches : base.recentSearches
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  queueAwsStateSave();
  renderShell();
}

function queueAwsStateSave() {
  if (!isAwsEnabled()) return;
  clearTimeout(awsSyncTimer);
  awsSyncTimer = setTimeout(syncStateToAws, 350);
}

async function syncStateToAws() {
  if (!isAwsEnabled()) return;

  try {
    const response = await fetch(`${PINGLO_AWS_API_URL}/state`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-user-id": getAwsUserId()
      },
      body: JSON.stringify({ state })
    });

    if (!response.ok) throw new Error(`State save failed: ${response.status}`);
  } catch (error) {
    console.warn("AWS state save failed; local state is still saved", error);
  }
}

function isAwsEnabled() {
  return Boolean(PINGLO_AWS_API_URL);
}

function getAwsUserId() {
  const stored = localStorage.getItem(PINGLO_AWS_USER_ID_KEY);
  const profileId = state?.profile?.id;
  const userId = stored || (profileId && profileId !== "me" ? profileId : makeId("user"));
  localStorage.setItem(PINGLO_AWS_USER_ID_KEY, userId);
  return userId;
}

async function createAwsUpload(file) {
  if (!isAwsEnabled()) {
    return {
      name: file.name,
      size: file.size,
      type: file.type
    };
  }

  const response = await fetch(`${PINGLO_AWS_API_URL}/uploads/presign`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-user-id": getAwsUserId()
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type || "application/octet-stream"
    })
  });

  if (!response.ok) throw new Error(`Upload URL failed: ${response.status}`);
  const upload = await response.json();

  const uploadResponse = await fetch(upload.uploadUrl, {
    method: "PUT",
    headers: {
      "content-type": file.type || "application/octet-stream"
    },
    body: file
  });

  if (!uploadResponse.ok) throw new Error(`Upload failed: ${uploadResponse.status}`);

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    s3Key: upload.key
  };
}

function getRouteFromHash() {
  const route = location.hash.replace("#", "");
  return ["home", "feed", "inbox", "search", "settings"].includes(route) ? route : "";
}

function navigate(route) {
  location.hash = route;
  if (activePage === route) renderPage();
}

function bindGlobalEvents() {
  document.body.addEventListener("click", (event) => {
    const routeTarget = event.target.closest("[data-route]");
    if (routeTarget) {
      event.preventDefault();
      navigate(routeTarget.dataset.route);
      return;
    }

    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;

    const action = actionTarget.dataset.action;
    if (action === "edit-profile") openProfileModal(false);
    if (action === "open-notifications") openNotificationsModal();
    if (action === "quick-compose") openQuickCompose();
  });
}

function renderShell() {
  document.querySelectorAll("[data-profile-name]").forEach((node) => {
    node.textContent = state.profile.name || "Set up profile";
  });
  document.querySelectorAll("[data-profile-status]").forEach((node) => {
    node.textContent = state.profile.name ? state.profile.status : "Offline";
  });
  document.querySelectorAll("[data-profile-avatar]").forEach((node) => {
    paintAvatar(node, state.profile.name || state.profile.initials || "Pinglo", state.profile.iconId);
  });
  document.querySelectorAll("[data-route]").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.route === activePage);
  });
}

function renderPage() {
  const routeChanged = lastRenderedPage !== activePage;
  renderShell();
  const views = {
    home: renderHome,
    feed: renderFeed,
    inbox: renderInbox,
    search: renderSearch,
    settings: renderSettings
  };
  root.innerHTML = views[activePage]();
  hydrateIcons(root);
  bindPageEvents();
  if (routeChanged) window.scrollTo(0, 0);
  lastRenderedPage = activePage;
  root.focus({ preventScroll: true });
}

function renderHome() {
  const conversations = sortedConversations();
  const groups = conversations.filter((conversation) => conversation.type === "group");
  const recent = conversations.slice(0, 4);
  const unread = conversations.reduce((total, conversation) => total + (conversation.unread || 0), 0);

  return `
    <section class="page">
      <div class="dashboard-grid">
        <div class="hero-panel">
          <div class="hero-content">
            <div class="hero-copy">
              <p class="eyebrow">${escapeHtml(getGreeting())}</p>
              <h1>${state.profile.name ? `Welcome back, ${escapeHtml(firstName(state.profile.name))}` : "Welcome to Pinglo"}</h1>
              <p>Stay connected with private chats, group spaces, and a searchable activity feed.</p>
            </div>
            <div class="quick-actions">
              ${quickAction("message", "New Chat", "new-chat")}
              ${quickAction("group", "New Group", "new-group")}
              ${quickAction("feed", "Feed Post", "new-post")}
              ${quickAction("userPlus", "Invite", "invite")}
            </div>
          </div>
        </div>

        <div class="settings-stack">
          <article class="panel">
            <div class="panel-header">
              <div>
                <p class="eyebrow">Overview</p>
                <h2>Workspace</h2>
              </div>
              <span class="status-pill"><span class="status-dot"></span>${state.profile.status}</span>
            </div>
            <div class="panel-body">
              <div class="stat-grid">
                ${statCard(conversations.length, "Chats")}
                ${statCard(groups.length, "Groups")}
                ${statCard(state.posts.length, "Posts")}
              </div>
              ${unread ? `<span class="count-pill">${unread} unread</span>` : `<span class="count-pill">All caught up</span>`}
            </div>
          </article>

          <article class="panel">
            <div class="panel-header">
              <div>
                <p class="eyebrow">Groups</p>
                <h2>Your Spaces</h2>
              </div>
              <button class="ghost-button" type="button" data-action="new-group">Create</button>
            </div>
            <div class="panel-body">
              ${groups.length ? groups.slice(0, 3).map(renderConversationCard).join("") : emptyState("group", "No groups yet", "Create a group to organize a class, team, club, or family chat.")}
            </div>
          </article>
        </div>
      </div>

      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Inbox</p>
            <h2>Recent Chats</h2>
          </div>
          <button class="ghost-button" type="button" data-route="inbox">View all</button>
        </div>
        <div class="panel-body">
          ${recent.length ? recent.map(renderConversationCard).join("") : emptyState("message", "No chats yet", "Start a conversation and it will appear here.")}
        </div>
      </article>
    </section>
  `;
}

function quickAction(iconName, label, action) {
  return `
    <button class="quick-action" type="button" data-action="${action}">
      <span data-icon="${iconName}"></span>
      <strong>${label}</strong>
    </button>
  `;
}

function statCard(value, label) {
  return `
    <div class="stat">
      <strong>${value}</strong>
      <span class="muted">${label}</span>
    </div>
  `;
}

function renderFeed() {
  const filteredPosts = state.posts
    .filter((post) => feedFilter === "all" || post.audience === feedFilter)
    .sort((a, b) => b.createdAt - a.createdAt);

  return `
    <section class="page">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Feed</p>
          <h1>Updates</h1>
        </div>
        <div class="row-actions">
          <div class="segmented" role="tablist" aria-label="Feed filters">
            ${feedTab("all", "All")}
            ${feedTab("following", "Following")}
            ${feedTab("groups", "Groups")}
            ${feedTab("popular", "Popular")}
          </div>
          <button class="solid-button" type="button" data-action="new-post"><span data-icon="plus"></span>Post</button>
        </div>
      </div>

      <div class="feed-grid">
        <div class="settings-stack">
          <article class="panel composer-card">
            <div class="composer-inline">
              ${renderAvatar(state.profile.name || "Pinglo", "avatar-small", state.profile.iconId)}
              <button class="input-shell" type="button" data-action="new-post">
                <span data-icon="message"></span>
                <span class="muted">Share an update</span>
              </button>
              <button class="solid-button" type="button" data-action="new-post">Compose</button>
            </div>
          </article>
          ${filteredPosts.length ? filteredPosts.map(renderPostCard).join("") : emptyState("feed", "No posts yet", "Create the first update for your feed.")}
        </div>

        <aside class="panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Activity</p>
              <h2>Pulse</h2>
            </div>
          </div>
          <div class="panel-body">
            ${statCard(state.posts.length, "Total posts")}
            ${statCard(totalLikes(), "Likes")}
            ${statCard(totalComments(), "Comments")}
          </div>
        </aside>
      </div>
    </section>
  `;
}

function feedTab(value, label) {
  return `<button type="button" class="${feedFilter === value ? "is-active" : ""}" data-action="set-feed-filter" data-filter="${value}">${label}</button>`;
}

function renderPostCard(post) {
  const comments = post.comments || [];
  return `
    <article class="post-card" data-post-id="${post.id}">
      <div class="post-head">
        ${renderAvatar(post.authorName, "avatar-small", getAuthorIconId(post.authorId, post.authorIconId))}
        <div class="list-main">
          <strong>${escapeHtml(post.authorName)}</strong>
          <span class="micro">${timeAgo(post.createdAt)} - ${escapeHtml(labelForAudience(post.audience))}</span>
        </div>
      </div>
      <p class="post-content">${escapeHtml(post.content)}</p>
      <div class="post-actions">
        <button class="soft-button" type="button" data-action="toggle-like" data-post-id="${post.id}">
          <span data-icon="heart"></span>${post.likedByMe ? "Liked" : "Like"} - ${post.likes || 0}
        </button>
        <button class="soft-button" type="button" data-action="focus-comment" data-post-id="${post.id}">
          <span data-icon="comment"></span>${comments.length}
        </button>
        <button class="soft-button" type="button" data-action="share-post" data-post-id="${post.id}">
          <span data-icon="share"></span>Share
        </button>
      </div>
      <form class="comment-form" data-post-id="${post.id}">
        <div class="input-shell">
          <input name="comment" autocomplete="off" placeholder="Write a comment" />
        </div>
      </form>
      ${comments.length ? `<div class="settings-stack">${comments.map(renderComment).join("")}</div>` : ""}
    </article>
  `;
}

function renderComment(comment) {
  return `
    <div class="list-card">
      ${renderAvatar(comment.authorName, "avatar-small", getAuthorIconId(comment.authorId, comment.authorIconId))}
      <div class="list-main">
        <strong>${escapeHtml(comment.authorName)}</strong>
        <span class="muted">${escapeHtml(comment.text)}</span>
      </div>
      <span class="micro">${timeAgo(comment.createdAt)}</span>
    </div>
  `;
}

function renderInbox() {
  const conversations = sortedConversations();
  const selected = getSelectedConversation(conversations);

  return `
    <section class="chat-layout">
      <aside class="chat-sidebar">
        <div class="chat-sidebar-header">
          <div class="page-heading">
            <div>
              <p class="eyebrow">Chats</p>
              <h2>Inbox</h2>
            </div>
            <button class="icon-button" type="button" data-action="new-chat" aria-label="New chat"><span data-icon="plus"></span></button>
          </div>
          <label class="input-shell">
            <span data-icon="search"></span>
            <input data-action="filter-chats" placeholder="Search chats" autocomplete="off" />
          </label>
        </div>
        <div class="chat-list" data-chat-list>
          ${conversations.length ? conversations.map((conversation) => renderConversationCard(conversation, selected?.id)).join("") : emptyState("message", "No conversations", "Create a chat or group to begin.")}
        </div>
      </aside>

      <section class="chat-main">
        ${selected ? renderChatWindow(selected) : renderEmptyChat()}
      </section>

      <aside class="chat-info">
        ${selected ? renderChatInfo(selected) : ""}
      </aside>
    </section>
  `;
}

function renderEmptyChat() {
  return `
    <div class="chat-head">
      <div class="chat-title">
        <p class="eyebrow">Inbox</p>
        <h2>Select a conversation</h2>
      </div>
      <button class="solid-button" type="button" data-action="new-chat"><span data-icon="plus"></span>New chat</button>
    </div>
    <div class="message-list">
      ${emptyState("message", "Your inbox is ready", "Start a new chat and messages will appear here.")}
    </div>
  `;
}

function renderChatWindow(conversation) {
  const messages = conversation.messages || [];
  return `
    <header class="chat-head">
      <span class="avatar" style="background:${avatarGradient(conversation.name)}">${conversationAvatar(conversation)}</span>
      <div class="chat-title">
        <h2 class="truncate">${escapeHtml(conversation.name)}</h2>
        <span class="muted">${conversation.type === "group" ? `${conversation.members.length} members` : "Direct chat"}</span>
      </div>
      <button class="icon-button" type="button" data-action="chat-details" aria-label="Chat details"><span data-icon="menu"></span></button>
    </header>

    <div class="message-list" data-message-list>
      ${messages.length ? messages.map((message) => renderMessage(message)).join("") : emptyState("message", "No messages yet", "Send the first ping in this conversation.")}
    </div>

    <form class="message-form" data-conversation-id="${conversation.id}">
      <button class="soft-button" type="button" data-action="new-chat"><span data-icon="plus"></span></button>
      <label class="soft-button" data-action="attach-file">
        <span data-icon="paperclip"></span>
        <input name="attachment" type="file" />
      </label>
      <div class="input-shell">
        <input name="message" autocomplete="off" placeholder="Type a message" />
      </div>
      <button class="solid-button" type="submit" aria-label="Send message"><span data-icon="send"></span></button>
      <div class="attachment-preview" data-attachment-preview></div>
    </form>
  `;
}

function renderMessage(message) {
  const mine = message.authorId === state.profile.id;
  const attachment = message.attachment
    ? `<span class="count-pill"><span data-icon="paperclip"></span>${escapeHtml(message.attachment.name)}</span>`
    : "";
  return `
    <div class="message-row ${mine ? "mine" : ""}">
      ${renderAvatar(message.authorName, "avatar-small", getAuthorIconId(message.authorId, message.authorIconId))}
      <div class="message-bubble">
        ${!mine ? `<strong>${escapeHtml(message.authorName)}</strong>` : ""}
        <span>${escapeHtml(message.text)}</span>
        ${attachment}
        <span class="message-time">${formatTime(message.createdAt)} - ${message.status || "sent"}</span>
      </div>
    </div>
  `;
}

function renderChatInfo(conversation) {
  return `
    <div class="chat-info-header">
      <span class="avatar avatar-large" style="background:${avatarGradient(conversation.name)}">${conversationAvatar(conversation)}</span>
      <div>
        <h2>${escapeHtml(conversation.name)}</h2>
        <p class="muted">${escapeHtml(conversation.description || "Connected in Pinglo")}</p>
      </div>
    </div>
    <div class="chat-info-body">
      <label class="option-row">
        <span><span data-icon="bell"></span> Notifications</span>
        ${switchMarkup("conversation-muted", !conversation.muted, conversation.id)}
      </label>
      <button class="option-row" type="button" data-action="rename-chat" data-conversation-id="${conversation.id}">
        <span><span data-icon="settings"></span> Chat details</span>
        <span data-icon="chevron"></span>
      </button>
      <div class="option-row">
        <span><span data-icon="group"></span> Members</span>
        <span class="count-pill">${conversation.members.length}</span>
      </div>
      <div class="option-row">
        <span><span data-icon="file"></span> Files</span>
        <span class="count-pill">${fileCount(conversation)}</span>
      </div>
      <button class="danger-button" type="button" data-action="delete-chat" data-conversation-id="${conversation.id}">Delete chat</button>
    </div>
  `;
}

function renderSearch() {
  const query = new URLSearchParams(location.search).get("q") || "";
  const results = query ? searchEverything(query) : [];

  return `
    <section class="page">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Search</p>
          <h1>Find Anything</h1>
        </div>
      </div>

      <div class="search-grid">
        <div class="settings-stack">
          <article class="panel">
            <div class="panel-body">
              <label class="input-shell">
                <span data-icon="search"></span>
                <input data-action="global-search" value="${escapeAttribute(query)}" placeholder="Search people, groups, or messages" autocomplete="off" />
              </label>
            </div>
          </article>
          <div class="search-results" data-search-results>
            ${query ? renderSearchResults(results, query) : emptyState("search", "Search your Pinglo", "Messages, groups, posts, and people you create are searchable here.")}
          </div>
        </div>

        <aside class="panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Recent</p>
              <h2>Searches</h2>
            </div>
            ${state.recentSearches.length ? `<button class="ghost-button" type="button" data-action="clear-searches">Clear</button>` : ""}
          </div>
          <div class="panel-body">
            <div class="tag-row">
              ${state.recentSearches.length ? state.recentSearches.map((term) => `<button class="chip" type="button" data-action="use-search" data-term="${escapeAttribute(term)}">${escapeHtml(term)}</button>`).join("") : `<span class="muted">No recent searches</span>`}
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderSearchResults(results, query) {
  if (!results.length) return emptyState("search", "No matches", "Try another name, group, post, or message.");
  rememberSearch(query);
  return results
    .map((result) => `
      <article class="result-card">
        <div class="result-head">
          <span class="avatar avatar-small" style="background:${avatarGradient(result.title)}">${getInitials(result.title)}</span>
          <div class="list-main">
            <strong>${escapeHtml(result.title)}</strong>
            <span class="micro">${escapeHtml(result.type)}</span>
          </div>
          <button class="soft-button" type="button" data-action="${result.action}" data-id="${result.id}">${result.button}</button>
        </div>
        <p class="muted">${escapeHtml(result.preview)}</p>
      </article>
    `)
    .join("");
}

function renderSettings() {
  return `
    <section class="page">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Settings</p>
          <h1>Control Center</h1>
        </div>
      </div>

      <div class="setting-grid">
        <div class="settings-stack">
          <article class="panel">
            <button class="settings-profile option-row" type="button" data-action="edit-profile">
              ${renderAvatar(state.profile.name || "Pinglo", "avatar-large", state.profile.iconId)}
              <span class="list-main">
                <strong>${escapeHtml(state.profile.name || "Set up profile")}</strong>
                <span class="muted">${escapeHtml(state.profile.handle || "Add your handle")}</span>
              </span>
              <span data-icon="chevron"></span>
            </button>
          </article>

          <article class="panel">
            <div class="panel-header">
              <div>
                <p class="eyebrow">Account</p>
                <h2>Access</h2>
              </div>
            </div>
            <div class="panel-body">
              <button class="option-row" type="button" data-action="edit-profile"><span><span data-icon="userPlus"></span> Account Information</span><span data-icon="chevron"></span></button>
              <button class="option-row" type="button" data-action="privacy-modal"><span><span data-icon="shield"></span> Privacy & Security</span><span data-icon="chevron"></span></button>
              <label class="option-row"><span><span data-icon="bell"></span> Notifications</span>${switchMarkup("notifications", state.preferences.notifications)}</label>
              <div class="option-row"><span><span data-icon="palette"></span> Theme</span><span class="muted">${themeName()}</span></div>
            </div>
          </article>

          <article class="panel">
            <div class="panel-header">
              <div>
                <p class="eyebrow">Theme</p>
                <h2>Appearance</h2>
              </div>
            </div>
            <div class="panel-body">
              <div class="color-row" role="radiogroup" aria-label="Theme colors">
                ${themeSwatch("purple", "#7a3cff")}
                ${themeSwatch("blue", "#2563eb")}
                ${themeSwatch("green", "#0f9f76")}
                ${themeSwatch("light", "#ffffff")}
              </div>
            </div>
          </article>
        </div>

        <div class="settings-stack">
          <article class="panel">
            <div class="panel-header">
              <div>
                <p class="eyebrow">Preferences</p>
                <h2>Chat</h2>
              </div>
            </div>
            <div class="panel-body">
              <label class="option-row"><span><span data-icon="message"></span> Message previews</span>${switchMarkup("messagePreview", state.preferences.messagePreview)}</label>
              <label class="option-row"><span><span data-icon="feed"></span> Compact layout</span>${switchMarkup("compactMode", state.preferences.compactMode)}</label>
              <label class="option-row"><span><span data-icon="shield"></span> Read receipts</span>${switchMarkup("readReceipts", state.preferences.readReceipts)}</label>
              <button class="option-row" type="button" data-action="language-modal"><span><span data-icon="globe"></span> Language</span><span class="muted">${escapeHtml(state.preferences.language)}</span></button>
            </div>
          </article>

          <article class="panel">
            <div class="panel-header">
              <div>
                <p class="eyebrow">Storage</p>
                <h2>Data</h2>
              </div>
            </div>
            <div class="panel-body">
              <button class="option-row" type="button" data-action="export-data"><span><span data-icon="database"></span> Export Data</span><span data-icon="chevron"></span></button>
              <button class="option-row" type="button" data-action="import-data"><span><span data-icon="file"></span> Import Data</span><span data-icon="chevron"></span></button>
              <button class="danger-button" type="button" data-action="clear-data">Clear local data</button>
              <input class="hidden" type="file" accept="application/json" data-import-input />
            </div>
          </article>

          <article class="panel">
            <div class="panel-body">
              <button class="option-row" type="button" data-action="about-modal"><span><span data-icon="help"></span> About Pinglo</span><span data-icon="chevron"></span></button>
              <button class="option-row" type="button" data-action="support-modal"><span><span data-icon="help"></span> Help & Support</span><span data-icon="chevron"></span></button>
              <button class="option-row" type="button" data-action="log-out"><span><span data-icon="lock"></span> Log Out</span><span data-icon="chevron"></span></button>
            </div>
          </article>
        </div>
      </div>
    </section>
  `;
}

function themeSwatch(theme, color) {
  return `<button class="swatch ${state.profile.theme === theme ? "is-active" : ""}" type="button" data-action="set-theme" data-theme-value="${theme}" style="--swatch:${color}" aria-label="${theme} theme"></button>`;
}

function bindPageEvents() {
  root.querySelectorAll("[data-action]").forEach((node) => {
    node.addEventListener("click", handleAction);
  });

  root.querySelectorAll(".message-form").forEach((form) => {
    form.addEventListener("submit", handleMessageSubmit);
    const fileInput = form.querySelector('input[type="file"]');
    fileInput?.addEventListener("change", handleAttachmentChange);
  });

  root.querySelectorAll(".comment-form").forEach((form) => {
    form.addEventListener("submit", handleCommentSubmit);
  });

  root.querySelectorAll("[data-action='global-search']").forEach((input) => {
    input.addEventListener("input", debounce((event) => {
      const query = event.target.value.trim();
      const url = new URL(location.href);
      if (query) url.searchParams.set("q", query);
      else url.searchParams.delete("q");
      history.replaceState(null, "", url);
      renderPage();
    }, 250));
  });

  root.querySelectorAll("[data-action='filter-chats']").forEach((input) => {
    input.addEventListener("input", (event) => filterChatList(event.target.value));
  });

  root.querySelectorAll(".switch input").forEach((input) => {
    input.addEventListener("change", handleSwitchChange);
  });

  root.querySelector("[data-import-input]")?.addEventListener("change", importData);

  const messageList = root.querySelector("[data-message-list]");
  if (messageList) messageList.scrollTop = messageList.scrollHeight;
}

function handleAction(event) {
  const target = event.currentTarget;
  const action = target.dataset.action;

  if (action === "new-chat") openConversationModal("direct");
  if (action === "new-group") openConversationModal("group");
  if (action === "new-post") openPostModal();
  if (action === "invite") copyInviteLink();
  if (action === "set-feed-filter") {
    feedFilter = target.dataset.filter;
    renderPage();
  }
  if (action === "toggle-like") toggleLike(target.dataset.postId);
  if (action === "focus-comment") focusComment(target.dataset.postId);
  if (action === "share-post") sharePost(target.dataset.postId);
  if (action === "open-conversation") openConversation(target.dataset.conversationId);
  if (action === "chat-details") openConversationInfo();
  if (action === "rename-chat") openConversationModal("edit", target.dataset.conversationId);
  if (action === "delete-chat") deleteConversation(target.dataset.conversationId);
  if (action === "set-theme") setTheme(target.dataset.themeValue);
  if (action === "privacy-modal") openSimpleModal("Privacy & Security", privacyContent());
  if (action === "language-modal") openLanguageModal();
  if (action === "about-modal") openSimpleModal("About Pinglo", "Pinglo keeps this frontend clean and local-first. Connect it to your preferred backend when you are ready for real-time multi-user delivery.");
  if (action === "support-modal") openSimpleModal("Help & Support", "For production support, connect this form to your help desk or email routing service.");
  if (action === "export-data") exportData();
  if (action === "import-data") root.querySelector("[data-import-input]")?.click();
  if (action === "clear-data") clearData();
  if (action === "log-out") logOut();
  if (action === "clear-searches") {
    state.recentSearches = [];
    saveState();
    renderPage();
  }
  if (action === "use-search") {
    const url = new URL(location.href);
    url.searchParams.set("q", target.dataset.term);
    history.replaceState(null, "", url);
    renderPage();
  }
  if (action === "open-result") {
    const conversation = state.conversations.find((item) => item.id === target.dataset.id);
    if (conversation) {
      state.activeConversationId = conversation.id;
      saveState();
      navigate("inbox");
    }
  }
}

function openQuickCompose() {
  if (activePage === "feed") openPostModal();
  else openConversationModal("direct");
}

function openProfileModal(required) {
  openModal(`
    <div class="modal-head">
      <div>
        <p class="eyebrow">Profile</p>
        <h2>${required ? "Set up Pinglo" : "Account Information"}</h2>
      </div>
      ${required ? "" : closeButton()}
    </div>
    <form class="form-grid" data-form="profile">
      <label class="field">
        <span>Display name</span>
        <input name="name" value="${escapeAttribute(state.profile.name)}" required minlength="2" maxlength="48" autocomplete="name" />
      </label>
      <label class="field">
        <span>Handle</span>
        <input name="handle" value="${escapeAttribute(state.profile.handle)}" placeholder="@yourname" maxlength="32" autocomplete="username" />
      </label>
      <label class="field">
        <span>Status</span>
        <select name="status">
          ${["Online", "Focus", "Away", "Offline"].map((status) => `<option ${state.profile.status === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
      </label>
      <div class="field">
        <span>Profile icon</span>
        <div class="profile-icon-preview">
          ${renderAvatar(state.profile.name || "Pinglo", "avatar-large", state.profile.iconId)}
          <span class="muted">Choose one of ${PROFILE_ICONS.length} icons</span>
        </div>
        <input type="hidden" name="iconId" value="${escapeAttribute(state.profile.iconId || "chat-sky")}" />
        <div class="profile-icon-grid" role="radiogroup" aria-label="Profile icons">
          ${renderProfileIconPicker(state.profile.iconId)}
        </div>
      </div>
      <div class="form-actions">
        ${required ? "" : `<button class="ghost-button" type="button" data-modal-close>Cancel</button>`}
        <button class="solid-button" type="submit">Save profile</button>
      </div>
    </form>
  `);

  modalRoot.querySelector("[data-form='profile']").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = clean(data.get("name"));
    state.profile.name = name;
    state.profile.handle = cleanHandle(data.get("handle"), name);
    state.profile.status = data.get("status");
    state.profile.initials = getInitials(name);
    state.profile.iconId = data.get("iconId") || "chat-sky";
    saveState();
    closeModal();
    renderPage();
    toast("Profile saved");
  });

  const profileNameInput = modalRoot.querySelector('input[name="name"]');
  const iconInput = modalRoot.querySelector('input[name="iconId"]');
  const previewAvatar = modalRoot.querySelector(".profile-icon-preview .avatar");

  profileNameInput?.addEventListener("input", () => {
    paintAvatar(previewAvatar, profileNameInput.value || "Pinglo", iconInput.value);
  });

  modalRoot.querySelectorAll("[data-profile-icon-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const iconId = button.dataset.profileIconChoice;
      iconInput.value = iconId;
      modalRoot.querySelectorAll("[data-profile-icon-choice]").forEach((choice) => {
        choice.classList.toggle("is-selected", choice === button);
        choice.setAttribute("aria-checked", choice === button ? "true" : "false");
      });
      paintAvatar(previewAvatar, profileNameInput.value || "Pinglo", iconId);
    });
  });
}

function openNotificationsModal() {
  openSimpleModal(
    "Notifications",
    state.preferences.notifications
      ? "Notifications are enabled for this device."
      : "Notifications are turned off. Enable them in Settings when you want alerts."
  );
}

function openConversationModal(mode, conversationId) {
  const isGroup = mode === "group";
  const isEdit = mode === "edit";
  const conversation = state.conversations.find((item) => item.id === conversationId) || {};
  openModal(`
    <div class="modal-head">
      <div>
        <p class="eyebrow">${isEdit ? "Chat" : isGroup ? "Group" : "Chat"}</p>
        <h2>${isEdit ? "Chat details" : isGroup ? "Create group" : "Start chat"}</h2>
      </div>
      ${closeButton()}
    </div>
    <form class="form-grid" data-form="conversation">
      <label class="field">
        <span>Name</span>
        <input name="name" value="${escapeAttribute(conversation.name || "")}" required maxlength="64" placeholder="${isGroup ? "Group name" : "Person or chat name"}" />
      </label>
      <label class="field">
        <span>${isGroup ? "Members" : "Participants"}</span>
        <input name="members" value="${escapeAttribute((conversation.members || []).filter((member) => member.id !== state.profile.id).map((member) => member.name).join(", "))}" placeholder="Names separated by commas" />
      </label>
      <label class="field">
        <span>Description</span>
        <textarea name="description" maxlength="180" placeholder="Optional">${escapeHtml(conversation.description || "")}</textarea>
      </label>
      <div class="form-actions">
        <button class="ghost-button" type="button" data-modal-close>Cancel</button>
        <button class="solid-button" type="submit">${isEdit ? "Save changes" : "Create"}</button>
      </div>
    </form>
  `);

  modalRoot.querySelector("[data-form='conversation']").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = clean(data.get("name"));
    const members = parseMembers(data.get("members"));
    const description = clean(data.get("description"));

    if (isEdit) {
      const index = state.conversations.findIndex((item) => item.id === conversationId);
      state.conversations[index] = {
        ...state.conversations[index],
        name,
        members: withCurrentUser(members),
        description,
        updatedAt: Date.now()
      };
      state.activeConversationId = conversationId;
    } else {
      const newConversation = {
        id: makeId("chat"),
        type: isGroup ? "group" : "direct",
        name,
        description,
        members: withCurrentUser(members),
        messages: [],
        muted: false,
        unread: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      state.conversations.unshift(newConversation);
      state.activeConversationId = newConversation.id;
    }

    saveState();
    closeModal();
    activePage = "inbox";
    location.hash = "inbox";
    renderPage();
    toast(isEdit ? "Chat updated" : "Chat created");
  });
}

function openPostModal() {
  openModal(`
    <div class="modal-head">
      <div>
        <p class="eyebrow">Feed</p>
        <h2>Create post</h2>
      </div>
      ${closeButton()}
    </div>
    <form class="form-grid" data-form="post">
      <label class="field">
        <span>Audience</span>
        <select name="audience">
          <option value="following">Following</option>
          <option value="groups">Groups</option>
          <option value="popular">Public</option>
        </select>
      </label>
      <label class="field">
        <span>Update</span>
        <textarea name="content" required maxlength="600" placeholder="Write your update"></textarea>
      </label>
      <div class="form-actions">
        <button class="ghost-button" type="button" data-modal-close>Cancel</button>
        <button class="solid-button" type="submit">Publish</button>
      </div>
    </form>
  `);

  modalRoot.querySelector("[data-form='post']").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    state.posts.unshift({
      id: makeId("post"),
      authorId: state.profile.id,
      authorName: state.profile.name || "Pinglo User",
      authorIconId: state.profile.iconId,
      audience: data.get("audience"),
      content: clean(data.get("content")),
      likes: 0,
      likedByMe: false,
      comments: [],
      createdAt: Date.now()
    });
    saveState();
    closeModal();
    activePage = "feed";
    location.hash = "feed";
    renderPage();
    toast("Post published");
  });
}

function openLanguageModal() {
  openModal(`
    <div class="modal-head">
      <div>
        <p class="eyebrow">Preferences</p>
        <h2>Language</h2>
      </div>
      ${closeButton()}
    </div>
    <form class="form-grid" data-form="language">
      <label class="field">
        <span>Language</span>
        <select name="language">
          ${["English", "Spanish", "French", "Portuguese", "Arabic"].map((language) => `<option ${state.preferences.language === language ? "selected" : ""}>${language}</option>`).join("")}
        </select>
      </label>
      <div class="form-actions">
        <button class="ghost-button" type="button" data-modal-close>Cancel</button>
        <button class="solid-button" type="submit">Save</button>
      </div>
    </form>
  `);
  modalRoot.querySelector("[data-form='language']").addEventListener("submit", (event) => {
    event.preventDefault();
    state.preferences.language = new FormData(event.currentTarget).get("language");
    saveState();
    closeModal();
    renderPage();
  });
}

function privacyContent() {
  return `Current privacy: ${state.preferences.privacy}. Read receipts are ${state.preferences.readReceipts ? "on" : "off"}. Use the Settings switches to adjust your chat privacy preferences.`;
}

function openSimpleModal(title, content) {
  openModal(`
    <div class="modal-head">
      <div>
        <p class="eyebrow">Pinglo</p>
        <h2>${escapeHtml(title)}</h2>
      </div>
      ${closeButton()}
    </div>
    <p class="muted">${escapeHtml(content)}</p>
    <div class="form-actions">
      <button class="solid-button" type="button" data-modal-close>Done</button>
    </div>
  `);
}

function openModal(markup) {
  modalRoot.innerHTML = `<div class="modal-backdrop" data-modal-close></div><section class="modal-card" role="dialog" aria-modal="true">${markup}</section>`;
  modalRoot.classList.add("is-open");
  hydrateIcons(modalRoot);
  modalRoot.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", closeModal));
  modalRoot.querySelector("input, textarea, select, button")?.focus();
}

function closeButton() {
  return `<button class="icon-button" type="button" data-modal-close aria-label="Close"><span data-icon="x"></span></button>`;
}

function closeModal() {
  modalRoot.classList.remove("is-open");
  modalRoot.innerHTML = "";
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const input = form.elements.message;
  const text = clean(input.value);
  if (!text && !pendingAttachment) return;

  const conversation = state.conversations.find((item) => item.id === form.dataset.conversationId);
  if (!conversation) return;

  conversation.messages.push({
    id: makeId("msg"),
    authorId: state.profile.id,
    authorName: state.profile.name || "Pinglo User",
    authorIconId: state.profile.iconId,
    text: text || pendingAttachment?.name || "Attachment",
    attachment: pendingAttachment,
    status: state.preferences.readReceipts ? "delivered" : "sent",
    createdAt: Date.now()
  });
  conversation.updatedAt = Date.now();
  pendingAttachment = null;
  saveState();
  renderPage();
}

async function handleAttachmentChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  pendingAttachment = {
    name: file.name,
    size: file.size,
    type: file.type
  };
  const preview = root.querySelector("[data-attachment-preview]");
  if (preview) {
    preview.classList.add("is-visible");
    preview.innerHTML = `<span data-icon="paperclip"></span><span>${escapeHtml(file.name)}</span><button class="ghost-button" type="button" data-action="clear-attachment">Remove</button>`;
    hydrateIcons(preview);
    preview.querySelector("[data-action='clear-attachment']").addEventListener("click", () => {
      pendingAttachment = null;
      preview.classList.remove("is-visible");
      preview.innerHTML = "";
    });
  }

  try {
    const uploadedAttachment = await createAwsUpload(file);
    if (pendingAttachment?.name === file.name && pendingAttachment?.size === file.size) {
      pendingAttachment = uploadedAttachment;
    }
  } catch (error) {
    console.warn("Attachment upload failed; keeping local metadata only", error);
    toast("Attachment upload failed");
  }
}

function handleCommentSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const text = clean(new FormData(form).get("comment"));
  if (!text) return;
  const post = state.posts.find((item) => item.id === form.dataset.postId);
  if (!post) return;
  post.comments = post.comments || [];
  post.comments.push({
    id: makeId("comment"),
    authorId: state.profile.id,
    authorName: state.profile.name || "Pinglo User",
    authorIconId: state.profile.iconId,
    text,
    createdAt: Date.now()
  });
  saveState();
  renderPage();
}

function handleSwitchChange(event) {
  const name = event.target.dataset.switch;
  if (name === "conversation-muted") {
    const conversation = state.conversations.find((item) => item.id === event.target.dataset.id);
    if (conversation) conversation.muted = !event.target.checked;
  } else {
    state.preferences[name] = event.target.checked;
  }
  saveState();
  renderPage();
}

function switchMarkup(name, checked, id = "") {
  return `<span class="switch"><input type="checkbox" data-switch="${name}" data-id="${id}" ${checked ? "checked" : ""} /><span class="slider"></span></span>`;
}

function openConversation(id) {
  state.activeConversationId = id;
  const conversation = state.conversations.find((item) => item.id === id);
  if (conversation) conversation.unread = 0;
  saveState();
  renderPage();
}

function openConversationInfo() {
  const conversation = state.conversations.find((item) => item.id === state.activeConversationId);
  if (conversation) openSimpleModal(conversation.name, `${conversation.members.length} members. ${conversation.description || "No description yet."}`);
}

function deleteConversation(id) {
  if (!confirm("Delete this chat from local storage?")) return;
  state.conversations = state.conversations.filter((conversation) => conversation.id !== id);
  if (state.activeConversationId === id) state.activeConversationId = null;
  saveState();
  renderPage();
  toast("Chat deleted");
}

function toggleLike(postId) {
  const post = state.posts.find((item) => item.id === postId);
  if (!post) return;
  post.likedByMe = !post.likedByMe;
  post.likes = Math.max(0, (post.likes || 0) + (post.likedByMe ? 1 : -1));
  saveState();
  renderPage();
}

function focusComment(postId) {
  root.querySelector(`.comment-form[data-post-id="${CSS.escape(postId)}"] input`)?.focus();
}

function sharePost(postId) {
  const post = state.posts.find((item) => item.id === postId);
  if (!post) return;
  copyText(post.content);
  toast("Post copied");
}

function copyInviteLink() {
  copyText(location.origin + location.pathname + "#inbox");
  toast("Invite link copied");
}

function setTheme(theme) {
  state.profile.theme = theme;
  saveState();
  applyTheme();
  renderPage();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.profile.theme || "purple";
}

function themeName() {
  return {
    purple: "Pinglo Purple",
    blue: "Orbit Blue",
    green: "Signal Green",
    light: "Lunar Light"
  }[state.profile.theme || "purple"];
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pinglo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = mergeState(defaultState(), JSON.parse(reader.result));
      saveState();
      applyTheme();
      renderPage();
      toast("Data imported");
    } catch {
      toast("Import failed");
    }
  };
  reader.readAsText(file);
}

function clearData() {
  if (!confirm("Clear Pinglo data stored in this browser?")) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("pinglo_access_token");
  localStorage.removeItem("pinglo_account");
  state = defaultState();
  queueAwsStateSave();
  window.location.href = "./index.html";
}

function logOut() {
  if (!confirm("Log out of this browser profile?")) return;
  localStorage.removeItem("pinglo_access_token");
  localStorage.removeItem("pinglo_id_token");
  localStorage.removeItem("pinglo_refresh_token");
  window.location.href = "./index.html";
}

function filterChatList(value) {
  const term = value.toLowerCase().trim();
  const list = root.querySelector("[data-chat-list]");
  if (!list) return;
  const conversations = sortedConversations().filter((conversation) => {
    const haystack = [
      conversation.name,
      conversation.description,
      ...conversation.members.map((member) => member.name),
      ...(conversation.messages || []).map((message) => message.text)
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
  list.innerHTML = conversations.length
    ? conversations.map((conversation) => renderConversationCard(conversation, state.activeConversationId)).join("")
    : emptyState("search", "No chats found", "Try another search.");
  hydrateIcons(list);
  list.querySelectorAll("[data-action]").forEach((node) => node.addEventListener("click", handleAction));
}

function searchEverything(query) {
  const term = query.toLowerCase();
  const results = [];
  state.conversations.forEach((conversation) => {
    const memberNames = conversation.members.map((member) => member.name).join(", ");
    if ([conversation.name, conversation.description, memberNames].join(" ").toLowerCase().includes(term)) {
      results.push({
        id: conversation.id,
        type: conversation.type === "group" ? "Group" : "Conversation",
        title: conversation.name,
        preview: conversation.description || memberNames || "Chat",
        action: "open-result",
        button: "Open"
      });
    }
    (conversation.messages || []).forEach((message) => {
      if (message.text.toLowerCase().includes(term)) {
        results.push({
          id: conversation.id,
          type: "Message",
          title: conversation.name,
          preview: message.text,
          action: "open-result",
          button: "Open"
        });
      }
    });
  });
  state.posts.forEach((post) => {
    if (post.content.toLowerCase().includes(term)) {
      results.push({
        id: post.id,
        type: "Post",
        title: post.authorName,
        preview: post.content,
        action: "noop",
        button: "Found"
      });
    }
  });
  return results.slice(0, 20);
}

function rememberSearch(query) {
  const value = query.trim();
  if (value.length < 2) return;
  state.recentSearches = [value, ...state.recentSearches.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 8);
  saveState();
}

function sortedConversations() {
  return [...state.conversations].sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
}

function getSelectedConversation(conversations = state.conversations) {
  return conversations.find((item) => item.id === state.activeConversationId) || conversations[0] || null;
}

function renderConversationCard(conversation, selectedId = state.activeConversationId) {
  const last = [...(conversation.messages || [])].pop();
  const preview = last ? last.text : conversation.description || "No messages yet";
  return `
    <button class="list-card ${conversation.id === selectedId ? "is-active" : ""}" type="button" data-action="open-conversation" data-conversation-id="${conversation.id}">
      <span class="avatar avatar-small" style="background:${avatarGradient(conversation.name)}">${conversationAvatar(conversation)}</span>
      <span class="list-main">
        <strong class="truncate">${escapeHtml(conversation.name)}</strong>
        <span class="muted truncate">${escapeHtml(preview)}</span>
      </span>
      <span class="list-meta">
        <span>${last ? formatTime(last.createdAt) : formatDate(conversation.createdAt)}</span>
        ${conversation.unread ? `<span class="count-pill">${conversation.unread}</span>` : `<span data-icon="chevron"></span>`}
      </span>
    </button>
  `;
}

function emptyState(iconName, title, copy) {
  return `
    <div class="empty-state">
      <span class="empty-icon" data-icon="${iconName}"></span>
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(copy)}</p>
      </div>
    </div>
  `;
}

function hydrateIcons(scope) {
  scope.querySelectorAll("[data-icon]").forEach((node) => {
    const name = node.dataset.icon;
    node.classList.add("icon");
    node.innerHTML = icons[name] || icons.message;
  });
}

function getProfileIcon(iconId) {
  return PROFILE_ICONS.find((icon) => icon.id === iconId) || PROFILE_ICONS[0];
}

function getAuthorIconId(authorId, fallbackIconId) {
  return authorId === state.profile.id ? state.profile.iconId : fallbackIconId;
}

function avatarBackground(name, iconId) {
  const icon = getProfileIcon(iconId);
  if (state?.profile?.picture && name === state.profile.name) return `center / cover no-repeat url("${state.profile.picture}")`;
  if (iconId && icon) return `linear-gradient(145deg, ${icon.colors[0]}, ${icon.colors[1]})`;
  return avatarGradient(name);
}

function avatarInner(name, iconId) {
  const icon = getProfileIcon(iconId);
  if (state?.profile?.picture && name === state.profile.name) return "";
  if (iconId && icon) {
    return `<span class="profile-glyph" aria-hidden="true">${profileGlyphs[icon.glyph] || profileGlyphs.chat}</span>`;
  }
  return escapeHtml(getInitials(name));
}

function renderAvatar(name, sizeClass = "", iconId = "") {
  const hasIcon = Boolean(iconId && getProfileIcon(iconId));
  return `<span class="avatar ${sizeClass} ${hasIcon ? "has-profile-icon" : ""}" style="background:${avatarBackground(name, iconId)}" title="${escapeAttribute(name)}">${avatarInner(name, iconId)}</span>`;
}

function paintAvatar(node, name, iconId) {
  node.innerHTML = avatarInner(name, iconId);
  node.style.background = avatarBackground(name, iconId);
  node.classList.toggle("has-profile-icon", Boolean(iconId && getProfileIcon(iconId)));
  node.setAttribute("title", name);
  if (state?.profile?.picture && name === state.profile.name) node.style.color = "transparent";
}

function renderProfileIconPicker(selectedIconId) {
  const selected = selectedIconId || "chat-sky";
  return PROFILE_ICONS.map((icon) => {
    const isSelected = icon.id === selected;
    return `
      <button
        class="profile-icon-choice ${isSelected ? "is-selected" : ""}"
        type="button"
        data-profile-icon-choice="${icon.id}"
        role="radio"
        aria-checked="${isSelected ? "true" : "false"}"
        aria-label="${escapeAttribute(icon.label)}"
        title="${escapeAttribute(icon.label)}"
        style="background:${avatarBackground(icon.label, icon.id)}"
      >
        <span class="profile-glyph" aria-hidden="true">${profileGlyphs[icon.glyph] || profileGlyphs.chat}</span>
      </button>
    `;
  }).join("");
}

function parseMembers(value) {
  return String(value || "")
    .split(",")
    .map((name) => clean(name))
    .filter(Boolean)
    .map((name) => ({
      id: makeId("member"),
      name,
      handle: cleanHandle("", name)
    }));
}

function withCurrentUser(members) {
  return [
    {
      id: state.profile.id,
      name: state.profile.name || "Pinglo User",
      handle: state.profile.handle || "@you",
      iconId: state.profile.iconId
    },
    ...members
  ];
}

function fileCount(conversation) {
  return (conversation.messages || []).filter((message) => message.attachment).length;
}

function conversationAvatar(conversation) {
  if (conversation.type === "group") return getInitials(conversation.name).slice(0, 2);
  return getInitials(conversation.name);
}

function totalLikes() {
  return state.posts.reduce((total, post) => total + (post.likes || 0), 0);
}

function totalComments() {
  return state.posts.reduce((total, post) => total + (post.comments || []).length, 0);
}

function labelForAudience(value) {
  return {
    following: "Following",
    groups: "Groups",
    popular: "Public"
  }[value] || "Feed";
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function firstName(name) {
  return String(name).trim().split(/\s+/)[0] || name;
}

function getInitials(value) {
  return String(value || "PG")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "PG";
}

function avatarGradient(seed) {
  const palette = [
    ["#7a3cff", "#19d4ff"],
    ["#ff61d8", "#7a3cff"],
    ["#2563eb", "#13c7dd"],
    ["#0f9f76", "#25c2ef"],
    ["#f97316", "#7a3cff"]
  ];
  const index = Math.abs(hashCode(seed)) % palette.length;
  return `linear-gradient(145deg, ${palette[index][0]}, ${palette[index][1]})`;
}

function hashCode(value) {
  return String(value).split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function cleanHandle(value, fallbackName = "") {
  const handle = clean(value);
  if (handle) return handle.startsWith("@") ? handle : `@${handle.replace(/^@+/, "")}`;
  const fallback = clean(fallbackName).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return fallback ? `@${fallback}` : "";
}

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(timestamp));
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(timestamp));
}

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return formatDate(timestamp);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function debounce(fn, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  toastRegion.append(node);
  setTimeout(() => node.remove(), 2600);
}





