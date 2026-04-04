(function () {
  "use strict";

  const BLOCK_TYPES = {
    paragraph: {
      label: "Paragraphe",
      color: "#4a9eff",
      fields: [{ key: "text", label: "Texte (**gras**, *violet*)", type: "textarea" }],
    },
    heading: {
      label: "Titre",
      color: "#855c9d",
      fields: [{ key: "text", label: "Titre (affiché en violet uppercase)", type: "input" }],
    },
    image: {
      label: "Image",
      color: "#2ecc71",
      fields: [
        { key: "url",  label: "URL de l'image",        type: "input" },
        { key: "alt",  label: "Description (optionnel)", type: "input" },
      ],
    },
    link: {
      label: "Lien",
      color: "#e67e22",
      fields: [
        { key: "text", label: "Texte affiché", type: "input" },
        { key: "url",  label: "URL",           type: "input" },
      ],
    },
    embed: {
      label: "Embed",
      color: "#e74c3c",
      fields: [
        { key: "url",     label: "URL (Instagram, YouTube…)", type: "input" },
        { key: "caption", label: "Légende (optionnel)",       type: "input" },
      ],
    },
  };

  function initEditor(textarea) {
    let blocks = [];
    try {
      const parsed = JSON.parse(textarea.value || "[]");
      if (Array.isArray(parsed)) blocks = parsed;
    } catch (_) {}

    const wrap = document.createElement("div");
    wrap.className = "be-wrap";
    textarea.parentNode.insertBefore(wrap, textarea);
    textarea.style.display = "none";

    function sync() {
      textarea.value = JSON.stringify(blocks, null, 2);
    }

    function render() {
      wrap.innerHTML = "";

      /* ── Block list ── */
      const list = document.createElement("div");
      list.className = "be-list";

      if (blocks.length === 0) {
        const empty = document.createElement("p");
        empty.className = "be-empty";
        empty.textContent = "Aucun bloc. Ajoutez des éléments ci-dessous.";
        list.appendChild(empty);
      }

      blocks.forEach(function (block, idx) {
        const info = BLOCK_TYPES[block.type] || { label: block.type, color: "#888", fields: [] };
        const card = document.createElement("div");
        card.className = "be-card";

        /* header */
        const hdr = document.createElement("div");
        hdr.className = "be-card-hdr";
        hdr.innerHTML =
          '<span class="be-badge" style="background:' + info.color + '18;color:' + info.color + ';border-color:' + info.color + '40">' + info.label + "</span>" +
          '<div class="be-actions">' +
            '<button type="button" class="be-btn be-up" title="Monter" ' + (idx === 0 ? "disabled" : "") + ">↑</button>" +
            '<button type="button" class="be-btn be-dn" title="Descendre" ' + (idx === blocks.length - 1 ? "disabled" : "") + ">↓</button>" +
            '<button type="button" class="be-btn be-del" title="Supprimer">✕</button>' +
          "</div>";

        hdr.querySelector(".be-up").addEventListener("click", function () {
          if (idx > 0) { var t = blocks[idx - 1]; blocks[idx - 1] = blocks[idx]; blocks[idx] = t; sync(); render(); }
        });
        hdr.querySelector(".be-dn").addEventListener("click", function () {
          if (idx < blocks.length - 1) { var t = blocks[idx + 1]; blocks[idx + 1] = blocks[idx]; blocks[idx] = t; sync(); render(); }
        });
        hdr.querySelector(".be-del").addEventListener("click", function () {
          blocks.splice(idx, 1); sync(); render();
        });
        card.appendChild(hdr);

        /* fields */
        info.fields.forEach(function (field) {
          const row = document.createElement("div");
          row.className = "be-field";

          const lbl = document.createElement("label");
          lbl.className = "be-label";
          lbl.textContent = field.label;
          row.appendChild(lbl);

          if (field.type === "textarea") {
            const ta = document.createElement("textarea");
            ta.className = "be-textarea";
            ta.value = block[field.key] || "";
            ta.rows = 5;
            ta.addEventListener("input", function () { block[field.key] = ta.value; sync(); });
            row.appendChild(ta);
          } else {
            const inp = document.createElement("input");
            inp.type = "text";
            inp.className = "be-input";
            inp.value = block[field.key] || "";
            inp.addEventListener("input", function () { block[field.key] = inp.value; sync(); });
            row.appendChild(inp);
          }

          card.appendChild(row);
        });

        list.appendChild(card);
      });

      wrap.appendChild(list);

      /* ── Add-block toolbar ── */
      const toolbar = document.createElement("div");
      toolbar.className = "be-toolbar";

      Object.keys(BLOCK_TYPES).forEach(function (type) {
        const info = BLOCK_TYPES[type];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "be-add";
        btn.style.borderColor = info.color;
        btn.style.color = info.color;
        btn.textContent = "+ " + info.label;
        btn.addEventListener("click", function () {
          var nb = { type: type };
          info.fields.forEach(function (f) { nb[f.key] = ""; });
          blocks.push(nb);
          sync();
          render();
          wrap.lastElementChild && wrap.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
        toolbar.appendChild(btn);
      });

      wrap.appendChild(toolbar);
    }

    render();
    sync();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".block-editor-json").forEach(initEditor);
  });
})();
