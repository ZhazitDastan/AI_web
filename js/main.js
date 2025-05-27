document.addEventListener("DOMContentLoaded", () => {
  // Кешируем DOM-элементы
  const servicesButton = document.getElementById("servicesButton");
  const mobileServicesButton = document.getElementById("mobileServicesButton");
  const desktopSubmenu = document.getElementById("desktopSubmenu");
  const mobileSubmenu = document.getElementById("mobileSubmenu");
  const servicesText = document.getElementById("servicesText");
  const mobileServicesText = document.getElementById("mobileServicesText");
  const currentPageText = document.getElementById("currentPageText");
  const submenuOptions = Array.from(document.querySelectorAll(".submenu-option"));
  const offcanvas = document.getElementById("offcanvasMenu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link, .sidebar-link, .services-button"));
  const sidebarLinks = Array.from(document.querySelectorAll(".sidebar-link"));

  let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let activeLinkText = "Басты бет";
  let resizeTimeout;

  function normalizePath(path) {
    return path === "/" ? "/index.html" : path;
  }

  // Главная функция установки активного состояния и текста
  function setActiveLink() {
    const currentPath = normalizePath(window.location.pathname);

    // Сбрасываем активные классы у всех ссылок и опций
    navLinks.forEach(link => link.classList.remove("active"));
    submenuOptions.forEach(option => option.classList.remove("active"));

    // Ищем и помечаем активные ссылки
    navLinks.forEach(link => {
      const href = normalizePath(link.getAttribute("href"));
      if (href === currentPath) {
        link.classList.add("active");
        activeLinkText = link.textContent.trim();
      }
    });

    // Обработка страниц с неделями (week)
    const isWeekPage = /\/pages\/week\d+\.html/.test(currentPath);
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
      servicesButton.classList.remove("active");
      mobileServicesButton.classList.remove("active");
    } else if (savedWeek && !isWeekPage) {
      servicesText.textContent = savedWeek;
      mobileServicesText.textContent = savedWeek;
      activeLinkText = savedWeek;
      servicesButton.classList.add("active");
      mobileServicesButton.classList.add("active");
    } else {
      servicesText.textContent = "Апта";
      mobileServicesText.textContent = "Апта";
      servicesButton.classList.remove("active");
      mobileServicesButton.classList.remove("active");
    }

    // Показ текста текущей страницы на мобиле
    if (window.innerWidth <= 991) {
      currentPageText.textContent = activeLinkText;
    } else {
      currentPageText.textContent = "";
    }
  }

  // Обработчики меню для десктопа
  function setupDesktopEvents() {
    // Используем делегирование и кешируем обработчики, чтобы не добавлять их несколько раз
    if (setupDesktopEvents.inited) return;
    setupDesktopEvents.inited = true;

    const parent = servicesButton.parentElement;

    let timeoutId;

    parent.addEventListener("mouseenter", () => {
      clearTimeout(timeoutId);
      desktopSubmenu.classList.add("show");
    });

    parent.addEventListener("mouseleave", () => {
      timeoutId = setTimeout(() => {
        desktopSubmenu.classList.remove("show");
      }, 300);
    });

    servicesButton.addEventListener("click", (e) => {
      e.preventDefault();
      desktopSubmenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!parent.contains(e.target) && !desktopSubmenu.contains(e.target)) {
        desktopSubmenu.classList.remove("show");
      }
    });
  }

  // Обработчики для мобильного меню
  function setupMobileEvents() {
    if (setupMobileEvents.inited) return;
    setupMobileEvents.inited = true;

    servicesButton.addEventListener("click", (e) => {
      e.preventDefault();
      desktopSubmenu.classList.toggle("show");
    });
  }

  // Инициализация меню в зависимости от ширины и устройства
  function initMenu() {
    desktopSubmenu.classList.remove("show");

    if (window.innerWidth > 991 && !isTouchDevice) {
      setupDesktopEvents();
    } else {
      setupMobileEvents();
    }
  }

  // Обработчик открытия мобильного подменю
  mobileServicesButton.addEventListener("click", (e) => {
    e.preventDefault();
    const isShown = mobileSubmenu.classList.contains("show");
    mobileSubmenu.classList.toggle("show", !isShown);
    mobileServicesButton.querySelector(".submenu-arrow").classList.toggle("active", !isShown);

    if (!isShown) {
      const rect = mobileServicesButton.getBoundingClientRect();
      mobileSubmenu.style.top = `${rect.bottom}px`;
      mobileSubmenu.style.left = `${rect.left}px`;
    }
  });

  // Клик вне подменю для закрытия
  document.addEventListener("click", (e) => {
    const isSubmenuOption = e.target.classList.contains("submenu-option");

    if (!servicesButton.contains(e.target) && !desktopSubmenu.contains(e.target) && !isSubmenuOption) {
      desktopSubmenu.classList.remove("show");
    }

    if (!mobileServicesButton.contains(e.target) && !mobileSubmenu.contains(e.target) && !isSubmenuOption) {
      mobileSubmenu.classList.remove("show");
      mobileServicesButton.querySelector(".submenu-arrow").classList.remove("active");
    }
  });

  // Обработка клика по опциям подменю
  submenuOptions.forEach(option => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const selectedText = option.textContent.trim();
      servicesText.textContent = selectedText;
      mobileServicesText.textContent = selectedText;
      localStorage.setItem('selectedWeek', selectedText);
      currentPageText.textContent = selectedText;

      // Используем location.assign, чтобы не создавать новую запись в истории, если нужно заменить
      window.location.href = option.getAttribute("href");
    });
  });

  // Обработка popstate для перехода назад и вперед
  window.addEventListener("popstate", () => {
    setActiveLink();
  });

  // Обработка загрузки страницы
  window.addEventListener("load", () => {
    setActiveLink();
    initMenu();
  });

  // Оптимизация resize — запускаем setActiveLink и initMenu с дебаунсом
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setActiveLink();
      initMenu();
    }, 150);
  });

  // При открытии offcanvas — обновляем активные ссылки
  offcanvas.addEventListener("show.bs.offcanvas", () => {
    setActiveLink();
  });

  // Инициализация при загрузке DOM
  setActiveLink();
  initMenu();

  // Инициализация feather icons, если подключен feather
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});
