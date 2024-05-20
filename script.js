"use strict";

/////////////////////////////////////////
///////// Query Selectors //////////////
///////////////////////////////////////
//
//Modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnOpenModal = document.querySelectorAll(".btn--show-modal");
//Scrolling
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
// tabs
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
//menu fade
const nav = document.querySelector(".nav");
// sticky nav
const header = document.querySelector(".header");
// revealing sections
const sections = document.querySelectorAll(".section");
// Lazy Images
const images = document.querySelectorAll("img[data-src]");
// Slider
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

///////////////////////////////////////
////// Modal window //////////////////
/////////////////////////////////////
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//////////////////////////////////////////////////
////////// Page Navigation //////////////////////
////////////////////////////////////////////////

btnScrollTo.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//////////////////////////////////////
////// Tabbed component /////////////
////////////////////////////////////

tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  if (!clicked) return;
  //removing tabs/content
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach((content) =>
    content.classList.remove("operations__content--active")
  );
  //adding correct content
  clicked.classList.add(`operations__tab--active`);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

/////////////////////////////////
////// Menu fade ///////////////
///////////////////////////////

const hoverEffect = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", hoverEffect.bind(0.5));

nav.addEventListener("mouseout", hoverEffect.bind(1));

/////////////////////////////
///// Stick Nav  ///////////
///////////////////////////

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (entry.isIntersecting === true) nav.classList.remove("sticky");
  else nav.classList.add("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

////////////////////////////////////
//// Revealing sections ///////////
//////////////////////////////////

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.12,
});

sections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//////////////////////////////////////
///////// Lazy Loading //////////////
////////////////////////////////////

const loadImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

images.forEach((image) => imageObserver.observe(image));

/////////////////////////////////
////// Slider Component ////////
///////////////////////////////
const slider = function () {
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  const scroller = function (s) {
    slides.forEach(
      (slide, i) => (slide.style.transform = `translateX(${100 * (i - s)}%)`)
    );
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };
  const initialize = function () {
    createDots();
    scroller(0);
    activateDot(0);
  };

  initialize();

  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    scroller(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    scroller(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    console.log(e);
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
    activateDot(curSlide);
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      scroller(slide);
      activateDot(slide);
    }
  });
};

slider();
