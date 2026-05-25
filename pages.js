// pages.js
import { AppConfig } from './config.js';

export const Templates = {
    feed: `
        <div class="feed-container">
            <div class="post">User Content...</div>
            <div class="ad-slot">Sponsored by HEM Africa</div>
        </div>
    `,
    settings: `
        <div class="settings-panel">
            <label>Data Saver Mode <input type="checkbox" id="dataSaver"></label>
            <button onclick="logout()">Logout</button>
        </div>
    `
};