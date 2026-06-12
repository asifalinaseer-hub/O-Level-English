/*
  O Level English Language 1123 Website
  JavaScript for mobile menu, active links, back-to-top button and year update.
*/

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const backToTop = document.getElementById("backToTop");
const year = document.getElementById("year");

/* Mobile menu */
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", function () {
    mainNav.classList.toggle("active");

    if (mainNav.classList.contains("active")) {
      menuToggle.textContent = "✕";
    } else {
      menuToggle.textContent = "☰";
    }
  });
}

/* Close mobile menu after clicking a link */
const navLinks = document.querySelectorAll(".main-nav a");

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    if (mainNav && mainNav.classList.contains("active")) {
      mainNav.classList.remove("active");
      menuToggle.textContent = "☰";
    }
  });
});

/* Current year in footer */
if (year) {
  year.textContent = new Date().getFullYear();
}

/* Back to top button */
window.addEventListener("scroll", function () {
  if (!backToTop) return;

  if (window.scrollY > 500) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

if (backToTop) {
  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* Smooth highlight for active section */
const sections = document.querySelectorAll("section[id]");

function highlightActiveSection() {
  const scrollPosition = window.scrollY + 120;

  sections.forEach(function (section) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(function (link) {
        link.classList.remove("active-link");

        if (link.getAttribute("href") === "#" + sectionId) {
          link.classList.add("active-link");
        }
      });
    }
  });
}

window.addEventListener("scroll", highlightActiveSection);
