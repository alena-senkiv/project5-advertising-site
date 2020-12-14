import { openModal, closeModal } from '../modal-window/index';
import { requestUserLogout } from '../helpers/API/index';
import { showRegisterBtn } from '../header/header';
import logoutModalTpl from '../../templates/logoutModalTpl.hbs';
import { getUserToken } from '../helpers/index';
import { updatePage } from '../router';

//Часть Элоны (слушатель на кнопке выхода)
const logoutMainBtnRef = document.querySelector('[data-logout-button]');
logoutMainBtnRef.addEventListener('click', onMainLogoutBtnClick);

//Функция вызова модалки для выхода

export function onMainLogoutBtnClick() {
  openModal(logoutModalTpl());
  const modalWrapperRef = document.querySelector('.modal-wrapper');
  modalWrapperRef.parentElement.classList.add('logout-window');
  const logoutModalBtnRef = document.querySelector('.modal-logout');
  logoutModalBtnRef.addEventListener('click', onModalLogoutBtnClick);

  const closeModalBtnRef = document.querySelector('.modal-cancel');
  closeModalBtnRef.addEventListener('click', closeModal, { once: true });
}

//Функция логаута + очистка токенов пользователя при нажатии на кнопку "ВИЙТИ"

export function onModalLogoutBtnClick() {
  requestUserLogout({ token: getUserToken() });
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('sid');
  showRegisterBtn();
  closeModal();
  updatePage('/');
}

// Здесь нужно добавить импорт ф-ции которая рендерит мои товары
import { renderMyFav } from '../favorites/favorites';

export function renderMyAccPage() {
  // вызов ф-ции которая рендерит мои товары
  renderMyFav();
}
