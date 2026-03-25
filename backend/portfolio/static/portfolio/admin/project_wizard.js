(function () {
  const SUB_TYPES = {
    covers:     [["single", "Single"], ["album", "Album"]],
    branding:   [["logo", "Logo"], ["branding", "Branding"]],
    affiches:   [["affiche", "Affiche"], ["pack", "Pack"]],
    miniatures: [["miniature", "Miniature"], ["minipack", "Pack de miniatures"]],
    videos:     [["video", "Vidéo"]],
    bannieres:  [["banniere", "Bannière"]],
  };

  function getYoutubeFieldset() {
    // Works with both standard Django admin and django-unfold
    return document.querySelector(".youtube-fieldset") ||
           [...document.querySelectorAll("fieldset")].find(fs =>
             fs.querySelector("h2, legend")?.textContent?.trim().toLowerCase() === "youtube"
           );
  }

  function getImageInline() {
    return document.getElementById("projectimage_set-group") ||
           document.querySelector(".inline-group");
  }

  function updateSubTypes(categoryVal) {
    const subTypeSelect = document.getElementById("id_sub_type");
    if (!subTypeSelect) return;
    const options    = SUB_TYPES[categoryVal] || [];
    const currentVal = subTypeSelect.value;
    subTypeSelect.innerHTML = "";
    options.forEach(([val, label]) => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = label;
      if (val === currentVal) opt.selected = true;
      subTypeSelect.appendChild(opt);
    });
    updateVisibility(subTypeSelect.value);
  }

  function updateVisibility(subTypeVal) {
    const isVideo     = subTypeVal === "video";
    const ytFieldset  = getYoutubeFieldset();
    const imageInline = getImageInline();

    if (ytFieldset)  ytFieldset.style.display  = isVideo ? "" : "none";
    if (imageInline) imageInline.style.display = isVideo ? "none" : "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("id_category");
    const subTypeSelect  = document.getElementById("id_sub_type");
    if (!categorySelect) return;

    categorySelect.addEventListener("change", function () {
      updateSubTypes(this.value);
    });

    if (subTypeSelect) {
      subTypeSelect.addEventListener("change", function () {
        updateVisibility(this.value);
      });
    }

    // Init on page load
    if (categorySelect.value) updateSubTypes(categorySelect.value);
    if (subTypeSelect?.value)  updateVisibility(subTypeSelect.value);
  });
})();
