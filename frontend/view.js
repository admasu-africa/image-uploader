const scrollToTopButton = document.getElementById('scrollToTop');

window.onscroll = function() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollToTopButton.style.display = "block"; 
  } else {
    scrollToTopButton.style.display = "none"; 
  }
};


scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });  
});



const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resetButton = document.getElementById('resetButton'); 
const messageContainer = document.getElementById('message'); 
let currentPage = 1;
const limit = 5;
let isLoading = false;
let searchQuery = '';


async function fetchItems(page, limit, searchQuery = '') {
  const response = await fetch(`http://localhost:3000/items?page=${page}&limit=${limit}&title=${searchQuery}`);
  const result = await response.json();

  console.log(result); 


  // console.log(result)
  if (result.data.length === 0) {
    showMessage(searchQuery ? 'No results found for your search.' : 'No data available.');
  } else {
    clearMessage(); 
  }

  return result;
}


function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = item.title;

  const description = document.createElement('p');
  description.textContent = item.description;

  const imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';


  item.images.slice(0, 5).forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    imageContainer.appendChild(img);
  });

  const seeMoreButton = document.createElement('button');
  if (item.images.length > 5) {
    seeMoreButton.textContent = 'See More';
    seeMoreButton.className = 'see-more';
    seeMoreButton.classList.add('show'); 
    seeMoreButton.addEventListener('click', () => {
      if (seeMoreButton.textContent === 'See More') {
        item.images.slice(5).forEach(url => {
          const img = document.createElement('img');
          img.src = url;
          imageContainer.appendChild(img);
        });
        seeMoreButton.textContent = 'See Less';
      } else {
        imageContainer.innerHTML = ''; 
        item.images.slice(0, 5).forEach(url => {
          const img = document.createElement('img');
          img.src = url;
          imageContainer.appendChild(img);
        });
        seeMoreButton.textContent = 'See More';
      }
    });
  }

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(imageContainer);
  if (item.images.length > 5) card.appendChild(seeMoreButton);

  return card;
}


async function loadItems() {
  if (isLoading) return;
  isLoading = true;

  const { data, total } = await fetchItems(currentPage, limit, searchQuery);


  data.forEach(item => {
    const card = createCard(item);
    gallery.appendChild(card);
  });

  currentPage++;
  isLoading = false;


  if ((currentPage - 1) * limit >= total) {
    window.removeEventListener('scroll', handleScroll);
  }
}


function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
    loadItems();
  }
}


function showMessage(msg) {
  messageContainer.textContent = msg;
  messageContainer.style.display = 'block';
}


function clearMessage() {
  messageContainer.textContent = '';
  messageContainer.style.display = 'none';
}


searchButton.addEventListener('click', () => {
  searchQuery = searchInput.value.trim();
  currentPage = 1; 
  gallery.innerHTML = ''; 
  window.addEventListener('scroll', handleScroll);
  loadItems(); 
});


resetButton.addEventListener('click', () => {
  searchQuery = ''; 
  searchInput.value = ''; 
  currentPage = 1; 
  gallery.innerHTML = ''; 
  window.addEventListener('scroll', handleScroll);
  loadItems(); 
});


window.addEventListener('scroll', handleScroll);
loadItems();
