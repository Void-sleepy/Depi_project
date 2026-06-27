function chatApp() {
  return {
    messages: [],
    sessions: [],
    currentSessionId: null,
    inputText: "",
    isLoading: false,
    sidebarOpen: false,
    apiStatus: "checking",

    init() {
      this.loadSessions();
      this.checkApi();
      setInterval(() => this.checkApi(), ChatConfig.apiCheckIntervalMs);
    },

    get apiStatusLabel() {
      if (this.apiStatus === "online") return "API connected";
      if (this.apiStatus === "degraded") return "API degraded";
      if (this.apiStatus === "offline") return "API offline";
      return "Checking…";
    },

    get groupedSessions() {
      return ChatSessions.groupByDate(this.sessions);
    },

    async checkApi() {
      try {
        const r = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(3000) });
        const d = await r.json();
        this.apiStatus = d.status === "ok" ? "online" : "degraded";
      } catch {
        this.apiStatus = "offline";
      }
    },

    async sendMessage() {
      const q = this.inputText.trim();
      if (!q || this.isLoading) return;
      this.inputText = "";
      this.grow(this.$refs.textarea);
      this.isLoading = true;
      this.addMessage("user", q, []);
      const aid = this.addMessage("assistant", "", []);

      try {
        const res = await fetch(`${API_URL}/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q }),
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        await this.streamIn(aid, data.answer, data.sources, data.latency_ms);
        this.saveSession();
      } catch (e) {
        this.updateMessage(aid, `Error: ${e.message}`, [], null);
      } finally {
        this.isLoading = false;
        this.$nextTick(() => this.scrollBottom());
      }
    },

    async streamIn(id, text, sources, latency) {
      const words = String(text || "").split(" ");
      let out = "";
      for (const w of words) {
        if (!w) continue;
        out += (out ? " " : "") + w;
        this.updateMessage(id, out + " ▋", sources, null);
        await new Promise((r) => setTimeout(r, ChatConfig.streamDelayMs));
      }
      this.updateMessage(id, text, sources, latency);
      this.$nextTick(() => this.enhanceCodeBlocks());
    },

    addMessage(role, content, sources, latency = null) {
      const id = crypto.randomUUID();
      this.messages.push({
        id,
        role,
        content,
        html: ChatMessages.render(content),
        sources: sources || [],
        latency,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      this.$nextTick(() => this.scrollBottom());
      return id;
    },

    updateMessage(id, content, sources, latency) {
      const m = this.messages.find((m) => m.id === id);
      if (!m) return;
      m.content = content;
      m.html = ChatMessages.render(content);
      if (sources?.length) m.sources = sources;
      if (latency !== undefined && latency !== null) m.latency = latency;
    },

    formatSourceName(src) {
      return ChatMessages.formatSourceName(src);
    },

    formatSourceExcerpt(src) {
      return ChatMessages.formatSourceExcerpt(src);
    },

    enhanceCodeBlocks() {
      ChatMessages.enhanceCodeBlocks((btn, text) => ChatMessages.copyToClipboard(btn, text));
    },

    scrollBottom() {
      const el = this.$refs.messages;
      if (el) el.scrollTop = el.scrollHeight;
    },

    newChat() {
      this.messages = [];
      this.currentSessionId = null;
      this.sidebarOpen = false;
    },

    loadSessions() {
      this.sessions = ChatSessions.load();
    },

    saveSession() {
      if (!this.messages.length) return;
      const id = this.currentSessionId || Date.now();
      const session = {
        id,
        title: ChatSessions.buildTitle(this.messages),
        messages: this.messages,
        ts: Date.now(),
      };
      this.currentSessionId = id;
      this.sessions = ChatSessions.upsert(this.sessions, session);
      ChatSessions.persist(this.sessions);
    },

    loadSession(id) {
      const s = this.sessions.find((s) => s.id === id);
      if (!s) return;
      this.messages = s.messages;
      this.currentSessionId = id;
      this.sidebarOpen = false;
      this.$nextTick(() => {
        this.enhanceCodeBlocks();
        this.scrollBottom();
      });
    },

    deleteSession(id) {
      this.sessions = ChatSessions.delete(this.sessions, id);
      ChatSessions.persist(this.sessions);
      if (this.currentSessionId === id) {
        this.messages = [];
        this.currentSessionId = null;
      }
      this.$nextTick(() => {
        if (window.lucide) lucide.createIcons();
      });
    },

    grow(el) {
      if (!el) return;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, ChatConfig.textareaMaxHeightPx) + "px";
    },
  };
}

window.chatApp = chatApp;

document.addEventListener("alpine:init", () => {
  if (window.hljs) hljs.configure({ ignoreUnescapedHTML: true });
});
