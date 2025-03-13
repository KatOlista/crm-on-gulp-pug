export const mobileNav = () => {
  const navBtn = document.querySelector('.mobile-nav-btn');
  const nav = document.querySelector('.mobile-nav');
  const menuIcon = document.querySelector('.nav-icon');

  const toggleNavMenuHandler = () => {
    nav.classList.toggle('mobile-nav--open');
    menuIcon.classList.toggle('nav-icon--active');
    document.body.classList.toggle('no-scroll');
  }

  navBtn.addEventListener('click', toggleNavMenuHandler);
};
