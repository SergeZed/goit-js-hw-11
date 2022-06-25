import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '?key=28240596-84a92ef82f37e30d56878f747';

const form = document.querySelector('.search-form');
const input = document.querySelector('input[name="searchQuery"]');
const container = document.querySelector('.gallery');
const loadMoreButt = document.querySelector('.load-more');
let totalImages = 0;
let currentPage = 0;
let searchQuery = '';
let gallery = new SimpleLightbox('.gallery a', { captionDelay: 250 });

form.addEventListener('submit', onSearch);
loadMoreButt.addEventListener('click', onLoadMore);

/// Async ///

async function onSearch(e) {
  try {
    e.preventDefault();
    container.innerHTML = '';
    loadMoreButt.classList.add('hidden');
    currentPage = 1;
    totalImages = 0;
    searchQuery = input.value;
    if (searchQuery === '') {
      empty();
      return;
    }

    const imageSet = await fetchImages(searchQuery);
    await renderPage(imageSet);
    await myQuery(imageSet);
  } catch {
    error => console.log(error);
  }
}

async function onLoadMore() {
  try {
    currentPage += 1;
    const imageSet = await fetchImages(searchQuery);
    await renderPage(imageSet);
  } catch {
    error => console.log(error);
  }
}

function renderPage(data) {
  totalImages += data.hits.length;
  if (data.total === 0) {
    notFound();
  } else if (data.total <= totalImages) {
    makeMarkup(data);
    setTimeout(endOfQuery, 3000);
    loadMoreButt.classList.add('hidden');
  } else {
    loadMoreButt.classList.remove('hidden');
    makeMarkup(data);
  }
}

/// Markup

function makeMarkup(data) {
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a class="photo-card" href="${largeImageURL}">
        <img class="image-item" src="${webformatURL}" alt="${tags}" data-source="${largeImageURL}"loading="lazy" />
          <div class="info">
              <p class="info-item">
                <b>Likes:</b> ${likes}
             </p>
              <p class="info-item">
                <b>Views:</b> ${views}
              </p>
              <p class="info-item">
                <b>Comments:</b> ${comments}
              </p>
              <p class="info-item">
                <b>Downloads:</b> ${downloads}
              </p>
    </div>
    </a>`;
      }
    )
    .join('');
  container.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

/// Fetch ///

async function fetchImages(query) {
  try {
    const params = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    });
    const url = `${BASE_URL}${API_KEY}&q=${query}&${params}&page=${currentPage}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

/// Notify ////

function notFound() {
  Notify.failure('Nothing found, try better', {
    timeout: 3000,
    fontSize: '30px',
    borderRadius: '30px',
    width: '380px',
  });
}

function myQuery(data) {
  if (data.totalHits > 0) {
    Notify.info(`We found ${data.totalHits} images`, {
      timeout: 3000,
      fontSize: '30px',
      borderRadius: '30px',
      width: '380px',
    });
  }
}
function endOfQuery() {
  Notify.info('No more results', {
    timeout: 3000,
    fontSize: '30px',
    borderRadius: '30px',
    backgroundColor: 'rgba(255,255,0,1)',
    width: '300px',
  });
}

function empty() {
  Notify.info('Type something here →', {
    timeout: 3000,
    fontSize: '30px',
    borderRadius: '30px',
    // backgroundColor: '#FFFF00',
    // textColor: '#FFFF00',
    position: 'left-top',
    width: '380px',
  });
}
