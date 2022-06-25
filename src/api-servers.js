const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '?key=28240596-84a92ef82f37e30d56878f747';

export function searchImages(name) {
  const parameters = new URLSearchParameters({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  });

  const url = `${BASE_URL}?key=${API_KEY}&q=${name}&${parameters}&page=${currentPage}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
