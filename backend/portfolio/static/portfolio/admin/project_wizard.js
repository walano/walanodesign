(function () {
  /* ── Tree definition ─────────────────────────────────────────────
     subs  : subcategory choices shown at step 2 (empty = skip step 2)
     multi : sub_types that allow multiple image upload
  ──────────────────────────────────────────────────────────────── */
  const TREE = {
    covers:     { subs: [["single", "Single"], ["album", "Album"]],           multi: ["album"] },
    branding:   { subs: [["logo", "Logo"], ["branding", "Branding"]],         multi: ["branding"] },
    videos:     { subs: [],                                                    multi: [] },
    affiches:   { subs: [["affiche", "Affiche"], ["pack", "Pack"]],           multi: ["pack"] },
    miniatures: { subs: [],                                                    multi: [] },
    bannieres:  { subs: [],                                                    multi: [] },
  };

  /* ── Helpers ─────────────────────────────────────────────────── */
  function isAddPage() {
    return window.location.pathname.endsWith("/add/");
  }

  function getYoutubeFieldset() {
    return document.querySelector(".youtube-fieldset") ||
      [...document.querySelectorAll("fieldset")].find(fs =>
        fs.querySelector("h2, legend")?.textContent?.trim().toLowerCase() === "youtube"
      );
  }

  function getImageInline() {
    return document.getElementById("projectimage_set-group") ||
      document.querySelector(".inline-group");
  }

  function getBulkField() {
    const row = document.querySelector(".field-bulk_images");
    return row || null;
  }

  function hide(el) { if (el) el.style.display = "none"; }
  function show(el) { if (el) el.style.display = ""; }

  /* ── Apply visibility based on sub_type ─────────────────────── */
  function applyVisibility(categoryVal, subTypeVal) {
    const node       = TREE[categoryVal] || { subs: [], multi: [] };
    const isVideo    = subTypeVal === "video";
    const isMulti    = node.multi.includes(subTypeVal);

    const ytFieldset  = getYoutubeFieldset();
    const imageInline = getImageInline();
    const bulkField   = getBulkField();
    const titleRow    = document.querySelector(".field-title");

    // YouTube: only for videos
    if (isVideo) { show(ytFieldset); } else { hide(ytFieldset); }

    // Image inline: hide for videos, always show otherwise
    if (isVideo) { hide(imageInline); } else { show(imageInline); }

    // Bulk images: only for multi-image sub_types
    if (isMulti && !isVideo) { show(bulkField); } else { hide(bulkField); }

    // Title: auto-filled from YouTube for videos — no manual input needed
    if (isVideo) { hide(titleRow); } else { show(titleRow); }
  }

  /* ── Populate sub_type dropdown ──────────────────────────────── */
  function updateSubTypes(categoryVal, forceVal) {
    const subTypeSelect = document.getElementById("id_sub_type");
    if (!subTypeSelect) return;
    const node    = TREE[categoryVal] || { subs: [] };
    const options = node.subs;

    subTypeSelect.innerHTML = "";

    if (options.length === 0) {
      // No subcategory — use the category's single valid sub_type
      const autoMap = { videos: "video", miniatures: "miniature", bannieres: "banniere" };
      const auto    = autoMap[categoryVal] || categoryVal;
      const opt     = document.createElement("option");
      opt.value = auto;
      opt.textContent = auto;
      subTypeSelect.appendChild(opt);
      applyVisibility(categoryVal, auto);
      return;
    }

    options.forEach(([val, label]) => {
      const opt       = document.createElement("option");
      opt.value       = val;
      opt.textContent = label;
      if (forceVal && val === forceVal) opt.selected = true;
      subTypeSelect.appendChild(opt);
    });

    applyVisibility(categoryVal, subTypeSelect.value);
  }

  /* ── Wizard (add page only) ──────────────────────────────────── */
  function buildWizard() {
    const categorySelect = document.getElementById("id_category");
    const subTypeSelect  = document.getElementById("id_sub_type");
    if (!categorySelect) return;

    // Elements to hide until wizard is complete
    const titleRow    = document.querySelector(".field-title");
    const orderRow    = document.querySelector(".field-order");
    const publishedRow= document.querySelector(".field-published");
    const bulkField   = getBulkField();
    const ytFieldset  = getYoutubeFieldset();
    const imageInline = getImageInline();
    const subTypeRow  = subTypeSelect?.closest(".form-row, .field-sub_type, tr") || null;

    // Step indicator injected above the form
    const submitRow = document.querySelector(".submit-row, [data-form-submit]");

    function hideFormBody() {
      hide(titleRow); hide(orderRow); hide(publishedRow);
      hide(bulkField); hide(ytFieldset); hide(imageInline);
      hide(subTypeRow);
      if (submitRow) hide(submitRow);
    }

    function showFormBody(categoryVal, subTypeVal) {
      show(titleRow); show(orderRow); show(publishedRow);
      show(subTypeRow);
      if (submitRow) show(submitRow);
      applyVisibility(categoryVal, subTypeVal);
    }

    // Inject subcategory wizard panel
    const wizardPanel = document.createElement("div");
    wizardPanel.id    = "wl-sub-wizard";
    wizardPanel.style.cssText = "display:none;margin:1rem 0;";

    const subLabel = document.createElement("label");
    subLabel.style.cssText = "display:block;font-weight:600;margin-bottom:0.5rem;";

    const subSelect = document.createElement("select");
    subSelect.style.cssText = "padding:0.4rem 0.8rem;min-width:180px;margin-right:0.75rem;";

    const subBtn = document.createElement("button");
    subBtn.type  = "button";
    subBtn.textContent = "Continuer →";
    subBtn.style.cssText = "padding:0.4rem 1rem;background:#855c9d;color:#fff;border:none;cursor:pointer;";

    wizardPanel.appendChild(subLabel);
    wizardPanel.appendChild(subSelect);
    wizardPanel.appendChild(subBtn);

    // Insert after category row
    const categoryRow = categorySelect.closest(".form-row, .field-category, tr");
    if (categoryRow?.parentNode) {
      categoryRow.parentNode.insertBefore(wizardPanel, categoryRow.nextSibling);
    }

    // Initial state: hide body
    hideFormBody();

    // Step 1 → category selected
    categorySelect.addEventListener("change", function () {
      const cat  = this.value;
      const node = TREE[cat] || { subs: [] };

      wizardPanel.style.display = "none";

      if (!cat) return;

      if (node.subs.length === 0) {
        // No subcategory — go straight to form
        updateSubTypes(cat);
        showFormBody(cat, subTypeSelect?.value || "");
      } else {
        // Show subcategory step
        subLabel.textContent = "Sous-catégorie";
        subSelect.innerHTML  = "";
        node.subs.forEach(([val, label]) => {
          const opt       = document.createElement("option");
          opt.value       = val;
          opt.textContent = label;
          subSelect.appendChild(opt);
        });
        wizardPanel.style.display = "";
        hideFormBody();
      }
    });

    // Step 2 → subcategory confirmed
    subBtn.addEventListener("click", function () {
      const cat    = categorySelect.value;
      const subVal = subSelect.value;
      // Sync the real hidden sub_type select
      updateSubTypes(cat, subVal);
      wizardPanel.style.display = "none";
      showFormBody(cat, subVal);
    });

    // If category already set on load (e.g. validation error re-render)
    if (categorySelect.value) {
      const cat    = categorySelect.value;
      const subVal = subTypeSelect?.value || "";
      updateSubTypes(cat, subVal);
      showFormBody(cat, subVal);
    }
  }

  /* ── Edit page: just sync visibility ────────────────────────── */
  function initEditPage() {
    const categorySelect = document.getElementById("id_category");
    const subTypeSelect  = document.getElementById("id_sub_type");
    if (!categorySelect) return;

    categorySelect.addEventListener("change", function () {
      updateSubTypes(this.value);
    });

    if (subTypeSelect) {
      subTypeSelect.addEventListener("change", function () {
        applyVisibility(categorySelect.value, this.value);
      });
    }

    if (categorySelect.value) updateSubTypes(categorySelect.value, subTypeSelect?.value);
  }

  /* ── Boot ────────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    if (isAddPage()) {
      buildWizard();
    } else {
      initEditPage();
    }
  });
})();
