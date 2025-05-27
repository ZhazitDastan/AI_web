document.addEventListener("DOMContentLoaded", function () {
  const servicesButton = document.getElementById("servicesButton");
  const mobileServicesButton = document.getElementById("mobileServicesButton");
  const desktopSubmenu = document.getElementById("desktopSubmenu");
  const mobileSubmenu = document.getElementById("mobileSubmenu");
  const servicesText = document.getElementById("servicesText");
  const mobileServicesText = document.getElementById("mobileServicesText");
  const currentPageText = document.getElementById("currentPageText");
  const submenuOptions = document.querySelectorAll(".submenu-option");
  const offcanvas = document.getElementById("offcanvasMenu");
  const sidebarLinks = document.querySelectorAll(".sidebar-link");

  let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let timeout;
  let activeLinkText = "Басты бет";

  function normalizePath(path) {
    return path === "/" ? "/index.html" : path;
  }

  function setActiveLink() {
    const currentPath = normalizePath(window.location.pathname);

    document.querySelectorAll(".nav-link, .sidebar-link, .services-button").forEach(link => {
      link.classList.remove("active");
    });

    document.querySelectorAll(".submenu-option").forEach(option => {
      option.classList.remove("active");
    });

    document.querySelectorAll(".nav-link, .sidebar-link").forEach(link => {
      const href = normalizePath(link.getAttribute("href"));
      if (href === currentPath) {
        link.classList.add("active");
        activeLinkText = link.textContent;
      }
    });

    const isWeekPage = currentPath.match(/\/pages\/week\d+\.html/);
    const savedWeek = localStorage.getItem('selectedWeek');

    if (isWeekPage) {
      const weekNumber = currentPath.match(/week(\d+)\.html/)[1];
      const weekText = `${weekNumber}-Апта`;
      servicesText.textContent = weekText;
      mobileServicesText.textContent = weekText;
      servicesButton.classList.add("active");
      mobileServicesButton.classList.add("active");
      localStorage.setItem('selectedWeek', weekText);
      activeLinkText = weekText;

      submenuOptions.forEach(option => {
        if (normalizePath(option.getAttribute("href")) === currentPath) {
          option.classList.add("active");
        }
      });
    } else if (currentPath === "/index.html" || currentPath === "/AI.html") {
      localStorage.removeItem('selectedWeek');
      servicesText.textContent = "Апта";
      mobileServicesText.textContent = "Апта";
      activeLinkText = currentPath === "/index.html" ? "Басты бет" : "ЖИ";
    } else if (savedWeek && !isWeekPage) {
      servicesText.textContent = savedWeek;
      mobileServicesText.textContent = savedWeek;
      activeLinkText = savedWeek;
      servicesButton.classList.add("active");
    } else {
      servicesText.textContent = "Апта";
      mobileServicesText.textContent = "Апта";
    }

    if (window.innerWidth <= 991) {
      currentPageText.textContent = activeLinkText;
    } else {
      currentPageText.textContent = "";
    }
  }

  setActiveLink();
  window.addEventListener("popstate", setActiveLink);
  window.addEventListener("load", setActiveLink);

  window.addEventListener("resize", function () {
    setActiveLink();
    if (window.innerWidth <= 991) {
      currentPageText.textContent = activeLinkText;
    } else {
      currentPageText.textContent = "";
    }
  });

  function isDesktopMode() {
    return window.innerWidth > 991 && !isTouchDevice;
  }

  function setupDesktopEvents() {
    servicesButton.parentElement.addEventListener("mouseenter", function () {
      clearTimeout(timeout);
      desktopSubmenu.classList.add("show");
    });

    servicesButton.parentElement.addEventListener("mouseleave", function () {
      timeout = setTimeout(() => {
        desktopSubmenu.classList.remove("show");
      }, 300);
    });

    servicesButton.addEventListener("click", function (e) {
      e.preventDefault();
      const isShown = desktopSubmenu.classList.contains("show");
      desktopSubmenu.classList.toggle("show", !isShown);
    });

    document.addEventListener("click", function (e) {
      if (!servicesButton.parentElement.contains(e.target) && !desktopSubmenu.contains(e.target)) {
        desktopSubmenu.classList.remove("show");
      }
    });
  }

  function setupMobileEvents() {
    servicesButton.addEventListener("click", function (e) {
      e.preventDefault();
      const isShown = desktopSubmenu.classList.contains("show");
      desktopSubmenu.classList.toggle("show", !isShown);
    });
  }

  if (isDesktopMode()) {
    setupDesktopEvents();
  } else {
    setupMobileEvents();
  }

  window.addEventListener("resize", function () {
    desktopSubmenu.classList.remove("show");
    if (isDesktopMode()) {
      setupDesktopEvents();
    } else {
      setupMobileEvents();
    }
  });

  mobileServicesButton.addEventListener("click", function (e) {
    e.preventDefault();
    const isShown = mobileSubmenu.classList.contains("show");
    mobileSubmenu.classList.toggle("show", !isShown);
    mobileServicesButton.querySelector(".submenu-arrow").classList.toggle("active", !isShown);
    if (!isShown) {
      const buttonRect = mobileServicesButton.getBoundingClientRect();
      mobileSubmenu.style.top = `${buttonRect.top}px`;
      mobileSubmenu.style.left = `${buttonRect.right}px`;
    }
  });

  document.addEventListener("click", function (e) {
    const isSubmenuOption = e.target.classList.contains("submenu-option");
    if (!servicesButton.contains(e.target) && !desktopSubmenu.contains(e.target) && !isSubmenuOption) {
      desktopSubmenu.classList.remove("show");
    }
    if (!mobileServicesButton.contains(e.target) && !mobileSubmenu.contains(e.target) && !isSubmenuOption) {
      mobileSubmenu.classList.remove("show");
      mobileServicesButton.querySelector(".submenu-arrow").classList.remove("active");
    }
  });

  offcanvas.addEventListener("show.bs.offcanvas", function () {
    setActiveLink();
  });

  submenuOptions.forEach(option => {
    option.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const selectedText = this.textContent;
      servicesText.textContent = selectedText;
      mobileServicesText.textContent = selectedText;
      localStorage.setItem('selectedWeek', selectedText);
      currentPageText.textContent = selectedText;
      window.location.href = this.getAttribute("href");
      setActiveLink();
    });
  });

  feather.replace();
});
