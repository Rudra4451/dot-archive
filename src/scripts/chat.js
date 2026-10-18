/**
 * ARCHIVE OF UNFINISHED GAMES // DOT.EXE
 * Character AI Chat Subsystem: Rule-Based Terminal Dialogue Widget
 * - Short, punchy, nostalgic dialogue ending in "beep"
 * - Instant suggestions via clickable chip buttons
 * - Keyboard accessible: ESC to dismiss, auto-focus, smooth scroll
 */

export class CharacterAIChatManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.widgetEl = document.getElementById("dot-chat-widget");
    this.toggleBtn = document.getElementById("chat-toggle-btn");
    this.windowEl = document.getElementById("chat-window-panel");
    this.closeBtn = document.getElementById("chat-close-btn");
    this.clearBtn = document.getElementById("chat-clear-btn");
    this.logEl = document.getElementById("chat-log-box");
    this.form = document.getElementById("chat-input-form");
    this.input = document.getElementById("chat-user-input");
    this.chips = document.querySelectorAll(".chat-chip-btn");

    this.isOpen = false;
    this.isReplying = false;
  }

  init() {
    if (!this.widgetEl || !this.toggleBtn || !this.windowEl) return;

    this.toggleBtn.addEventListener("click", () => this.toggleChat());
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.closeChat());
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => this.clearChat());
    }

    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleUserSend();
      });
    }

    // Suggested prompt option chips
    if (this.chips) {
      this.chips.forEach((chip) => {
        chip.addEventListener("click", () => {
          if (this.audioEngine) this.audioEngine.playWhisperWindChime();
          const prompt = chip.getAttribute("data-prompt") || chip.textContent.trim();
          this.processMessage(prompt);
        });
      });
    }

    // ESC key closes chat
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    this.widgetEl.classList.add("is-open");
    this.windowEl.removeAttribute("hidden");
    this.toggleBtn.setAttribute("aria-expanded", "true");

    if (this.audioEngine) {
      this.audioEngine.playWhisperWindChime();
    }

    setTimeout(() => {
      if (this.input) this.input.focus();
    }, 150);

    this.scrollToBottom();
  }

  closeChat() {
    this.isOpen = false;
    this.widgetEl.classList.remove("is-open");
    this.windowEl.setAttribute("hidden", "");
    this.toggleBtn.setAttribute("aria-expanded", "false");
    this.toggleBtn.focus();
  }

  clearChat() {
    if (!this.logEl) return;
    this.logEl.innerHTML = `
      <div class="chat-bubble dot-bubble">
        <span class="bubble-sender">DOT:</span>
        <span class="bubble-text">Beep! Hello. Welcome to the archive. Did you get lost?</span>
      </div>
    `;
    if (this.audioEngine) {
      this.audioEngine.playChime(440, "triangle", 0.04);
    }
    if (this.input) this.input.focus();
  }

  handleUserSend() {
    if (!this.input) return;
    const text = this.input.value.trim();
    if (!text) return;
    this.input.value = "";
    this.processMessage(text);
  }

  processMessage(text) {
    if (this.isReplying || !text.trim()) return;
    this.isReplying = true;

    // Render user speech bubble
    this.appendBubble("YOU", text, "user-bubble");
    this.scrollToBottom();

    // Sound effect for sent message
    if (this.audioEngine) {
      this.audioEngine.playChime(523, "sine", 0.05);
    }

    // Render typing indicator
    const typingBubble = document.createElement("div");
    typingBubble.className = "chat-bubble dot-bubble typing-bubble";
    typingBubble.id = "chat-typing-indicator";
    typingBubble.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    this.logEl.appendChild(typingBubble);
    this.scrollToBottom();

    // Determine rule-based response
    const reply = this.getDotResponse(text);

    // Dot responds with authentic 280ms retro processing latency
    setTimeout(() => {
      const indicator = document.getElementById("chat-typing-indicator");
      if (indicator) indicator.remove();

      this.appendBubble("DOT", reply, "dot-bubble");
      this.scrollToBottom();
      this.isReplying = false;

      if (this.audioEngine) {
        this.audioEngine.playDotBeep();
      }
    }, 280);
  }

  getDotResponse(userText) {
    const clean = userText.toLowerCase().replace(/[.,!?;:'"()]/g, " ").trim();
    const tokens = clean.split(/\s+/).filter(Boolean);

    // 1. Exact Prompt Matches
    const helloTriggers = ["hello", "hi", "hey", "howdy", "greetings"];
    if (tokens.some((t) => helloTriggers.includes(t)) || clean === "hi" || clean === "hello") {
      return "Hello! Are you a player? Or a sprite?";
    }

    const fixTriggers = ["game", "sprite", "broken", "fix", "patch"];
    if (tokens.some((t) => fixTriggers.includes(t))) {
      return "I fix the broken ones. I have a lot of them. Do you have a broken sprite?";
    }

    const byeTriggers = ["bye", "exit", "quit", "goodbye", "cya", "leave"];
    if (tokens.some((t) => byeTriggers.includes(t))) {
      return "Oh. Okay. I'll leave the nightlight on for you.";
    }

    // 2. Rich Topic Options
    if (clean.includes("moth") || clean.includes("moon") || clean.includes("1997")) {
      return "I was pixel 14,000 on the moon in Moth & Moon (1997). When the game was deleted, I kept the crescent intact. Beep!";
    }

    if (clean.includes("shop") || clean.includes("store") || clean.includes("where") || clean.includes("workshop")) {
      return "My Sprite Repair Shop is just down the page! Scroll down to Workshops to help me put the pixels back.";
    }

    if (clean.includes("chipped") || clean.includes("corner") || clean.includes("sneeze") || clean.includes("quirk")) {
      return "I sneezed in 1997 and lost my top-right corner. It makes me a little glitchy, but I say 'beep' instead of 'sorry'! Beep.";
    }

    if (clean.includes("music") || clean.includes("song") || clean.includes("jukebox") || clean.includes("sound")) {
      return "I rescued those chiptunes from deleted game files. Turn on the sound switch and give them a listen!";
    }

    if (clean.includes("who are you") || clean === "who" || clean.includes("dot")) {
      return "I'm Dot! A very small 8-bit pixel with a very specific job: fixing what got left behind.";
    }

    if (clean.includes("help") || clean.includes("option") || clean.includes("topic")) {
      return "You can tap any topic chip above, or ask me about sprites, my shop, or say hello! Beep.";
    }

    // Fallback
    return "Beep? I don't know that word. My memory is only 8-bit. Try saying 'game' or 'hello'.";
  }

  appendBubble(sender, text, extraClass) {
    if (!this.logEl) return;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${extraClass}`;

    const senderSpan = document.createElement("span");
    senderSpan.className = "bubble-sender";
    senderSpan.textContent = `${sender}: `;

    const textSpan = document.createElement("span");
    textSpan.className = "bubble-text";
    textSpan.textContent = text;

    bubble.appendChild(senderSpan);
    bubble.appendChild(textSpan);
    this.logEl.appendChild(bubble);
  }

  scrollToBottom() {
    if (this.logEl) {
      this.logEl.scrollTop = this.logEl.scrollHeight;
    }
  }
}
