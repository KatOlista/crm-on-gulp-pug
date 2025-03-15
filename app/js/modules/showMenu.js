export const showMenu = () => {
  const headerBtn = document.querySelector('.header__button');

  const toggleMenu = (e) => {
    e.stopPropagation();

    const burgerMenuBtn = document.querySelector('.svg-burger-menu-dims.header__icon');
    const closeMenuBtn = document.querySelector('.svg-close-dims.header__icon');
    const menu = document.querySelector('#menu');

    if (menu?.classList.contains('menu-active')) {
      menu?.classList.remove('menu-active');
      closeMenuBtn?.classList.remove('header__show');
      burgerMenuBtn?.classList.add('header__show');

      document.body.classList.remove('noscroll');
    } else {
      document.body.classList.add('noscroll');

      setTimeout(() => {
        document.querySelector('#menu')?.classList.add('menu-active');
        burgerMenuBtn?.classList.remove('header__show');
        closeMenuBtn?.classList.add('header__show');
      }, 101);
    }
  };

  headerBtn.addEventListener('click', toggleMenu);
}
