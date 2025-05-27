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

  // Функция для установки активного элемента
  function setActiveLink() {
    const currentPath = window.location.pathname;

    // Сбрасываем все активные классы
    document.querySelectorAll(".nav-link, .sidebar-link, .services-button").forEach(link => link.classList.remove("active"));
    document.querySelectorAll(".submenu-option").forEach(option => option.classList.remove("active"));

    // Устанавливаем активный элемент на основе текущего пути
    document.querySelectorAll(".nav-link, .sidebar-link").forEach(link => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
        activeLinkText = link.textContent;
      }
    });

    // Проверяем, является ли страница неделей
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

      // Устанавливаем активный стиль для соответствующего пункта в подменю
      submenuOptions.forEach(option => {
        if (option.getAttribute("href") === currentPath) {
          option.classList.add("active");
        }
      });
    } else if (currentPath === "/index.html" || currentPath === "/AI.html") { // Добавляем условие для AI.html
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

    // Обновляем текст в хедере на мобильных
    if (window.innerWidth <= 991) {
      currentPageText.textContent = activeLinkText;
    } else {
      currentPageText.textContent = "";
    }
  }

  // Вызываем при загрузке страницы и при изменении истории (назад/вперёд)
  setActiveLink();
  window.addEventListener("popstate", setActiveLink);
  window.addEventListener("load", setActiveLink);

  // Обновление при изменении размера экрана
  window.addEventListener("resize", function () {
    setActiveLink();
    if (window.innerWidth <= 991) {
      currentPageText.textContent = activeLinkText;
    } else {
      currentPageText.textContent = "";
    }
  });

  // Функция для определения режима (десктоп или мобильный)
  function isDesktopMode() {
    return window.innerWidth > 991 && !isTouchDevice;
  }

  // Логика для десктопа (наведение или клик)
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
      if (!isShown) {
        desktopSubmenu.classList.add("show");
      } else {
        desktopSubmenu.classList.remove("show");
      }
    });

    document.addEventListener("click", function (e) {
      if (!servicesButton.parentElement.contains(e.target) && !desktopSubmenu.contains(e.target)) {
        desktopSubmenu.classList.remove("show");
      }
    });
  }

  // Логика для мобильного (клик)
  function setupMobileEvents() {
    servicesButton.addEventListener("click", function (e) {
      e.preventDefault();
      const isShown = desktopSubmenu.classList.contains("show");
      if (!isShown) {
        desktopSubmenu.classList.add("show");
      } else {
        desktopSubmenu.classList.remove("show");
      }
    });
  }

  // Инициализация событий в зависимости от режима
  if (isDesktopMode()) {
    setupDesktopEvents();
  } else {
    setupMobileEvents();
  }

  // Обновление событий при изменении размера окна
  window.addEventListener("resize", function () {
    desktopSubmenu.classList.remove("show"); 
    if (isDesktopMode()) {
      setupDesktopEvents();
    } else {
      setupMobileEvents();
    }
  });

  // Логика для offcanvas (мобильное меню)
  mobileServicesButton.addEventListener("click", function (e) {
    e.preventDefault();
    const isShown = mobileSubmenu.classList.contains("show");
    if (!isShown) {
      mobileSubmenu.classList.add("show");
      mobileServicesButton.querySelector(".submenu-arrow").classList.add("active");
      const buttonRect = mobileServicesButton.getBoundingClientRect();
      mobileSubmenu.style.top = `${buttonRect.top}px`;
      mobileSubmenu.style.left = `${buttonRect.right}px`;
    } else {
      mobileSubmenu.classList.remove("show");
      mobileServicesButton.querySelector(".submenu-arrow").classList.remove("active");
    }
  });

  // Закрытие при клике вне (для всех устройств), но исключаем закрытие при клике на submenu-option
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

  // Обновление активных стилей при открытии offcanvas
  offcanvas.addEventListener("show.bs.offcanvas", function () {
    setActiveLink();
  });

  // Выбор недели
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

  // Инициализация Feather Icons
  feather.replace();
});