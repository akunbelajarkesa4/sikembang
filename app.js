(function () {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".bottom-nav a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function (error) {
        console.error("Service worker registration failed:", error);
      });
    });
  }

  window.SIKEMBANG_APP = {
    parseDate(dateValue) {
      if (!dateValue) {
        return null;
      }

      const normalizedValue =
        typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
          ? dateValue + "T00:00:00"
          : dateValue;
      const date = new Date(normalizedValue);

      return Number.isNaN(date.getTime()) ? null : date;
    },

    formatDate(dateValue, options) {
      if (!dateValue) {
        return "-";
      }

      const date = this.parseDate(dateValue);
      if (!date) {
        return "-";
      }

      return date.toLocaleDateString(
        "id-ID",
        options || {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    },

    formatDateTime(dateValue) {
      if (!dateValue) {
        return "-";
      }

      const date = this.parseDate(dateValue);
      if (!date) {
        return "-";
      }

      return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    setMessage(element, message, variant) {
      if (!element) {
        return;
      }

      element.textContent = message;
      element.dataset.variant = variant || "success";
      element.classList.add("is-visible");
    },

    clearMessage(element) {
      if (!element) {
        return;
      }

      element.textContent = "";
      element.classList.remove("is-visible");
      element.dataset.variant = "";
    },

    getStatusLabel(status) {
      if (status === "stunting") {
        return "Stunting";
      }

      if (status === "risk") {
        return "Risiko";
      }

      return "Normal";
    },
  };
})();
