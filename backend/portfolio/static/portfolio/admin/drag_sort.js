(function () {
  function getCookie(name) {
    const v = `; ${document.cookie}`;
    const p = v.split(`; ${name}=`);
    if (p.length === 2) return p.pop().split(";").shift();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("result_list");
    if (!table) return;
    if (typeof Sortable === "undefined") { console.warn("SortableJS not loaded"); return; }

    // Unfold renders one <tbody> per row — sort <tbody> elements inside the <table>
    new Sortable(table, {
      draggable: "tbody",
      handle: ".wl-drag-handle",
      animation: 150,
      onEnd: function () {
        const ids = [...table.querySelectorAll("tbody")]
          .map(function (tb) {
            const cb = tb.querySelector("input.action-select");
            return cb ? cb.value : null;
          })
          .filter(Boolean);

        if (!ids.length) return;

        fetch(window.location.pathname.replace(/\/?$/, "/") + "reorder/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({ ids: ids }),
        });
      },
    });
  });
})();
