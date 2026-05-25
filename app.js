const PINGLO_AWS_API_URL = (window.PINGLO_AWS_API_URL || "").replace(/\/$/, "");
const STORAGE_KEY = "pinglo:production:v2";

document.addEventListener("DOMContentLoaded", () => {
  const feedEl = document.getElementById("feed");
  const postBtn = document.getElementById("postBtn");
  const postInput = document.getElementById("postInput");

  if (feedEl) renderLegacyFeed(feedEl);
  if (postBtn && postInput) {
    postBtn.addEventListener("click", async () => {
      const text = postInput.value.trim();
      if (!text) return;
      const state = loadState();
      const profile = getAccount();
      state.posts = state.posts || [];
      state.posts.unshift({
        id: makeId("post"),
        authorId: profile.id,
        authorName: profile.name || profile.handle || "Pinglo User",
        authorIconId: profile.iconId || "",
        audience: "popular",
        content: text,
        likes: 0,
        comments: [],
        createdAt: Date.now()
      });
      saveState(state);
      await syncState(state);
      postInput.value = "";
      renderLegacyFeed(feedEl);
    });
  }
});

function getAccount() {
  try {
    return JSON.parse(localStorage.getItem("pinglo_account") || "null") || { id: "me", name: "Pinglo User" };
  } catch {
    return { id: "me", name: "Pinglo User" };
  }
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || { posts: [] };
  } catch {
    return { posts: [] };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function syncState(state) {
  if (!PINGLO_AWS_API_URL) return;
  await fetch(`${PINGLO_AWS_API_URL}/state`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "x-user-id": getAccount().id || "me"
    },
    body: JSON.stringify({ state })
  }).catch((error) => console.warn("Pinglo AWS sync failed", error));
}

function renderLegacyFeed(feedEl) {
  const posts = (loadState().posts || []).sort((a, b) => b.createdAt - a.createdAt);
  feedEl.innerHTML = posts.length
    ? posts.map((post) => `
      <article class="post">
        <div class="post-top">
          <div class="post-user">
            <div class="avatar" style="width:46px;height:46px;border-radius:16px;">${escapeHtml(getInitials(post.authorName))}</div>
            <div class="user-meta">
              <strong>${escapeHtml(post.authorName)}</strong>
              <span>${new Date(post.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <p>${escapeHtml(post.content)}</p>
      </article>
    `).join("")
    : "<p>No posts yet.</p>";
}

function getInitials(value) {
  return String(value || "PG").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "PG";
}

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
