/**
 * WORKWISE B2B HUB — App Logic
 * Phase 1: Card selection, module switching, greeting, Workwise chat
 */

/* ── Time-aware Greeting ────────────────────────────────────────── */
function initGreeting() {
    const hour = new Date().getHours();
    const nameEl = document.getElementById('greetingName');
    const emojiEl = document.getElementById('greetingEmoji');
    const labelEl = document.getElementById('greetingTimeLabel');

    let greeting, emoji;
    if (hour >= 5 && hour < 12) { greeting = 'Good morning'; emoji = '☀️'; }
    else if (hour >= 12 && hour < 17) { greeting = 'Good afternoon'; emoji = '🌤️'; }
    else if (hour >= 17 && hour < 21) { greeting = 'Good evening'; emoji = '🌇'; }
    else { greeting = 'Working late'; emoji = '🌙'; }

    if (nameEl) nameEl.textContent = `${greeting}, Sarah.`;
    if (emojiEl) emojiEl.textContent = emoji;
    if (labelEl) labelEl.textContent = greeting;
}

/* ── Module Switching ───────────────────────────────────────────── */
let activeModule = null;

const cards = document.querySelectorAll('.hub-card');
const panels = document.querySelectorAll('.module-panel');
const greetingEl = document.getElementById('greetingState');
const quickChips = document.querySelectorAll('.quick-chip');

function activateModule(moduleKey) {
    // Deactivate all cards
    cards.forEach(c => c.classList.remove('active'));

    // Hide all panels + greeting
    panels.forEach(p => { p.hidden = true; });
    if (greetingEl) greetingEl.style.display = 'none';

    // Activate matching card
    const targetCard = document.querySelector(`.hub-card[data-module="${moduleKey}"]`);
    if (targetCard) targetCard.classList.add('active');

    // Show matching panel
    const targetPanel = document.getElementById(`${moduleKey}-panel`);
    if (targetPanel) {
        targetPanel.hidden = false;
        // Re-trigger animation
        targetPanel.style.animation = 'none';
        targetPanel.offsetHeight; // reflow
        targetPanel.style.animation = '';
    }

    activeModule = moduleKey;
}

function deactivateAll() {
    cards.forEach(c => c.classList.remove('active'));
    panels.forEach(p => { p.hidden = true; });
    if (greetingEl) greetingEl.style.display = '';
    activeModule = null;
}

// Card click handlers
cards.forEach(card => {
    const key = card.dataset.module;

    card.addEventListener('click', () => {
        if (activeModule === key) {
            deactivateAll(); // clicking active card toggles off
        } else {
            activateModule(key);
        }
    });

    // Keyboard accessibility
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});

// Quick chip handlers (in greeting)
quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const target = chip.dataset.target;
        if (target) activateModule(target);
    });
});

/* ── Workwise Chat Widget ───────────────────────────────────────── */
const workwiseWidget = document.getElementById('workwiseWidget');
const workwiseFab = document.getElementById('workwiseFab');
const workwiseTrigger = document.getElementById('workwiseTrigger'); // pill in search
const workwiseClose = document.getElementById('workwiseClose');
const wwInput = document.querySelector('.ww-input');
const wwSend = document.querySelector('.ww-send');
const wwBody = document.querySelector('.ww-body');

let chatOpen = false;

function openChat() {
    chatOpen = true;
    workwiseWidget.classList.add('open');
    workwiseFab.classList.add('hidden');
    setTimeout(() => wwInput?.focus(), 250);
}

function closeChat() {
    chatOpen = false;
    workwiseWidget.classList.remove('open');
    workwiseFab.classList.remove('hidden');
}

workwiseFab?.addEventListener('click', openChat);
workwiseTrigger?.addEventListener('click', openChat);
workwiseClose?.addEventListener('click', closeChat);

// Chat send logic (demo mode)
function sendMessage() {
    const text = wwInput.value.trim();
    if (!text) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'ww-msg ww-msg--user';
    userMsg.innerHTML = `<p style="background:var(--brand-500);color:#fff;border-radius:12px 12px 4px 12px;padding:10px 14px;font-size:13.5px;line-height:1.55;text-align:right;margin-left:auto;max-width:85%">${escapeHtml(text)}</p>`;
    wwBody.appendChild(userMsg);
    wwInput.value = '';
    wwBody.scrollTop = wwBody.scrollHeight;

    // Simulate AI response
    setTimeout(() => {
        const replies = [
            "I can help with that! Let me pull up the relevant information for you.",
            "Great question, Sarah. Here's what I found based on your recent data…",
            "On it! I'll check your performance metrics and get back to you with a summary.",
            "Sure — I can handle that task for you. Want me to start the workflow now?",
            "I've analysed your team's recent activity. Would you like a detailed breakdown?"
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        const botMsg = document.createElement('div');
        botMsg.className = 'ww-msg ww-msg--bot';
        botMsg.innerHTML = `<p>${reply}</p>`;
        wwBody.appendChild(botMsg);
        wwBody.scrollTop = wwBody.scrollHeight;
    }, 800);
}

wwSend?.addEventListener('click', sendMessage);
wwInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
});

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
}

/* ── Search bar behavior ─────────────────────────────────────────── */
const globalSearch = document.getElementById('globalSearch');

globalSearch?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const query = globalSearch.value.trim().toLowerCase();
        if (!query) return;

        // Keyword routing
        if (query.includes('task') || query.includes('todo') || query.includes('to do') || query.includes('onboard')) {
            activateModule('todos');
        } else if (query.includes('perform') || query.includes('kpi') || query.includes('skill') || query.includes('score') || query.includes('grow')) {
            activateModule('coach');
        } else if (query.includes('insight') || query.includes('ai') || query.includes('signal') || query.includes('trend')) {
            activateModule('insights');
        } else {
            // Open Workwise chat
            openChat();
            setTimeout(() => {
                if (wwInput) wwInput.value = globalSearch.value;
                globalSearch.value = '';
            }, 200);
        }
    }
});

/* ── Announcements (stub) ───────────────────────────────────────── */
document.getElementById('announcementsBtn')?.addEventListener('click', () => {
    // TODO: Announcements drawer
    console.log('Announcements panel — coming soon');
});

/* ── Profile (stub) ─────────────────────────────────────────────── */
document.getElementById('profileBtn')?.addEventListener('click', () => {
    // TODO: Profile dropdown
    console.log('Profile menu — coming soon');
});

/* ── Init ───────────────────────────────────────────────────────── */
initGreeting();
