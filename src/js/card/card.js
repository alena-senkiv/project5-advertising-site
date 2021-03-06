import '../../scss/main.scss';
import { ads } from '../helpers';
import productModalTpl from '../../templates/product-modal.hbs';
import productModalInfoTpl from '../../templates/product-modal-info.hbs';
import productModalImgListTpl from '../../templates/product-modal-img-list.hbs';
import { getUserToken, requestUserById } from '../helpers/index';
import { requestAddToFavorites, requestUserFavorites } from '../helpers';
import getCardRefs from './getCardRefs';
import { openModal } from '../modal-window/index';
import { productModalAddEventListeners } from '../product-modal/product-modal';
import { delFavItem } from '../favorites/remove-favorite';

const cardRefs = getCardRefs();

//Слушатель на  клик по иконке сердце
export function onAddToFavoritesListener() {
  cardRefs.cardListener.addEventListener('click', onAddToFavorites);
}

// Слушатель на клик по иконке модалки
export function onOpenCardModalListener() {
  cardRefs.cardListener.addEventListener('click', onOpenModal);
}

//Сборка слушатиелей из карточки товара
export function getAddListenersInCard() {
  onAddToFavoritesListener();
  onOpenCardModalListener();
}

// Вызов модального окна на карточке товаров
export function onOpenModal(event) {
  if (!event.target.classList.contains('js-modal-icon')) {
    return;
  }
  const productId = getCardId(event);
  const productObj = findProductAds(ads, productId);
  openModal(productModalTpl(productObj));
  productModalAddEventListeners();
}
// Поиск вызванной карточки товаров
function findProductAds(ads, id) {
  return createArrayOfAllProducts(ads).find(item => item._id === id);
}

// Раскрытие вложенностей объекта ads
function createArrayOfAllProducts(ads) {
  return Object.values(ads).flat();
}

// Добавление/удаление товара в/из Избранного
export async function onAddToFavorites(event) {
  if (event.target.classList.contains('icon-favorite-orange')) {
    await removeAddToFavorites(event);
    return;
  }

  if (!event.target.classList.contains('js-favorite-icon')) {
    return;
  }

  const cardId = getCardId(event);
  const userToken = getUserToken();
  if (sendAdsToUserFavorite(userToken, cardId)) {
    clickedToAddToFavorites(event);
    console.log('отправили запрос');
  } else {
    openModalAuth();
  }
}

// Отправка товара авторизованого пользователя
function sendAdsToUserFavorite(userToken, _cardId) {
  if (userToken !== null) {
    requestAddToFavorites({ token: userToken, _id: _cardId }).catch(error =>
      console.log(error),
    );
    return true;
  }
  return false;
}

// Поиск выбранной карточки в объекте настроек
function findCheckedCard(event) {
  const arrayElements = event.path;
  const targetCard = arrayElements.find(el => el.className === 'card');
  return targetCard;
}

// Получение ID карточки на которой произошло целевое событие click
function getCardId(event) {
  const getTargetCard = findCheckedCard(event);
  return getTargetCard.dataset.id;
}

// Замена иконки сердечко при добавлении в избранное
function clickedToAddToFavorites(event) {
  const selector = findCheckedCard(event);
  changeFavoriteStyle(
    selector,
    '.card__favorite-btn--orange',
    '.card__favorite-btn',
    'block',
    'none',
  );
}

// Замена иконки сердечко при удалении из Избранного
export async function removeAddToFavorites(event) {
  const selector = findCheckedCard(event);
  await delFavItem(event);
  changeFavoriteStyle(
    selector,
    '.card__favorite-btn',
    '.card__favorite-btn--orange',
    'block',
    'none',
  );
}

// Проверяем регистрацию юзера при загрузке страницы и вытягиваем id избранных карточек
async function getAuthUserFavId() {
  const userToken = await getUserToken();
  if (userToken !== null) {
    return requestUserFavorites({ token: userToken })
      .then(data => data.favourites)
      .then(array => array.map(el => el._id))
      .catch(error => console.log(error));
  }
  return false;
}
// находим сердечки из избранного и меняем цвет
export async function checkUserFavIcons() {
  const selectors = Array.from(document.querySelectorAll('[data-id]'));
  const userFav = await getAuthUserFavId();

  for (let item of userFav) {
    selectors.map(card => {
      if (card.dataset.id === item) {
        changeFavoriteStyle(
          card,
          '.card__favorite-btn--orange',
          '.card__favorite-btn',
          'block',
          'none',
        );
      }
    });
  }
}

// подмена видимости dom-элемента
function changeFavoriteStyle(
  DOMselector,
  newSelector,
  oldSelector,
  newDisplay,
  oldDisplay,
) {
  const targetIcon = DOMselector.querySelector(newSelector);
  const hiddenIcon = DOMselector.querySelector(oldSelector);
  targetIcon.style.display = newDisplay;
  hiddenIcon.style.display = oldDisplay;
}
