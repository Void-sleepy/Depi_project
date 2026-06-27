window.ChatSessions = {
  load() {
    try {
      return JSON.parse(localStorage.getItem(ChatConfig.sessionsKey) || "[]");
    } catch {
      return [];
    }
  },

  persist(sessions) {
    localStorage.setItem(ChatConfig.sessionsKey, JSON.stringify(sessions));
  },

  buildTitle(messages) {
    const firstUser = messages.find((m) => m.role === "user");
    if (!firstUser) return "New chat";
    const text = firstUser.content;
    return text.slice(0, 40) + (text.length > 40 ? "…" : "");
  },

  upsert(sessions, session) {
    const list = [...sessions];
    const index = list.findIndex((s) => s.id === session.id);
    if (index >= 0) list[index] = session;
    else list.unshift(session);
    return list.slice(0, ChatConfig.maxSessions);
  },

  delete(sessions, id) {
    return sessions.filter((s) => s.id !== id);
  },

  groupByDate(sessions) {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const groups = { Today: [], Yesterday: [], Older: [] };
    for (const s of sessions) {
      const d = new Date(s.ts).toDateString();
      if (d === today) groups.Today.push(s);
      else if (d === yesterday) groups.Yesterday.push(s);
      else groups.Older.push(s);
    }
    return groups;
  },
};
