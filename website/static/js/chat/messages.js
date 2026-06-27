window.ChatMessages = {
  render(text) {
    if (!text) return "";
    return marked.parse(text);
  },

  formatSourceName(src) {
    if (typeof src === "string") return src;
    return src.filename || src.name || "source";
  },

  formatSourceExcerpt(src) {
    if (typeof src === "string") return "";
    return src.excerpt || src.snippet || "";
  },

  enhanceCodeBlocks(onCopy) {
    document.querySelectorAll(".bubble-content pre").forEach((pre) => {
      if (pre.closest(".code-block")) return;

      const code = pre.querySelector("code");
      const langMatch = code?.className.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : "code";

      const wrapper = document.createElement("div");
      wrapper.className = "code-block";

      const header = document.createElement("div");
      header.className = "code-block-header";

      const langLabel = document.createElement("span");
      langLabel.className = "code-lang";
      langLabel.textContent = lang;

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "copy-btn";
      copyBtn.innerHTML = '<i data-lucide="copy"></i>';
      copyBtn.addEventListener("click", () => onCopy(copyBtn, code?.textContent || ""));

      header.appendChild(langLabel);
      header.appendChild(copyBtn);
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      if (code && window.hljs) hljs.highlightElement(code);
    });

    if (window.lucide) lucide.createIcons();
  },

  async copyToClipboard(btn, text) {
    try {
      await navigator.clipboard.writeText(text);
      btn.innerHTML = '<i data-lucide="check"></i>';
      if (window.lucide) lucide.createIcons();
      setTimeout(() => {
        btn.innerHTML = '<i data-lucide="copy"></i>';
        if (window.lucide) lucide.createIcons();
      }, 2000);
    } catch {
      /* clipboard unavailable */
    }
  },
};
