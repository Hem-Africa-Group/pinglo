import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// REPLACE THIS WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- AUTH LOGIC ---
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            window.location.href = 'index.html'; // Redirect to home
        } catch (err) { alert(err.message); }
    });
}

// --- FIRESTORE LOGIC (Main Feed) ---
const feedEl = document.getElementById('feed');
const postBtn = document.getElementById('postBtn');
const postInput = document.getElementById('postInput');

if (feedEl) {
    // Listen for real-time updates from "posts" collection
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, (snapshot) => {
        feedEl.innerHTML = ''; // Clear local feed
        snapshot.forEach((doc) => {
            const data = doc.data();
            renderPostCard(data);
        });
    });
}

if (postBtn) {
    postBtn.addEventListener('click', async () => {
        const text = postInput.value.trim();
        if (!text) return;

        try {
            await addDoc(collection(db, "posts"), {
                user: auth.currentUser?.email || "Anonymous",
                text: text,
                likes: 0,
                createdAt: serverTimestamp()
            });
            postInput.value = '';
        } catch (err) { console.error("Error adding post: ", err); }
    });
}

function renderPostCard(p) {
    const postHTML = `
        <article class="post">
            <div class="post-top">
                <div class="post-user">
                    <div class="avatar" style="width:46px;height:46px;border-radius:16px;">${p.user[0].toUpperCase()}</div>
                    <div class="user-meta">
                        <strong>${p.user}</strong>
                        <span>Just now</span>
                    </div>
                </div>
            </div>
            <p>${p.text}</p>
            <div class="post-actions">
                <div class="action">♡ <span>${p.likes || 0}</span></div>
                <div class="action">💬 0</div>
                <div class="action">⇪ Share</div>
            </div>
        </article>`;
    feedEl.insertAdjacentHTML('beforeend', postHTML);
}