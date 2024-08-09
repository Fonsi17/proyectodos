// Variables globales
let currentPage = 1;
const perPage = 10;
let currentSearch = '';
const PEXELS_API_KEY = 'Ok7oWwjrTQIMLaWV5ep39VkcTx1o7f2B4C7fOGHBUl67bthaDGnE4qKL'; // Reemplaza esto con tu API key real de Pexels
let localImages = []; // Array para almacenar las imágenes locales

// Elementos del DOM
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const photoGallery = document.getElementById('photoGallery');
const loadMoreBtn = document.getElementById('loadMore');
const fileInput = document.getElementById('fileInput');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', loadMorePhotos);
fileInput.addEventListener('change', handleFileUpload);

// Función para manejar la búsqueda
async function handleSearch(e) {
    e.preventDefault();
    currentSearch = searchInput.value;
    console.log("Buscando:", currentSearch);
    currentPage = 1;
    photoGallery.innerHTML = '';
    renderLocalImages(); // Renderizar primero las imágenes locales
    await fetchPhotos();
}

// Función para cargar más fotos
async function loadMorePhotos() {
    currentPage++;
    await fetchPhotos();
}

// Función para obtener fotos de la API de Pexels
async function fetchPhotos() {
    try {
        const url = currentSearch
            ? `https://api.pexels.com/v1/search?query=${currentSearch}&page=${currentPage}&per_page=${perPage}`
            : `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
        
        console.log("URL de la API:", url);

        const response = await fetch(url, {
            headers: {
                Authorization: PEXELS_API_KEY
            }
        });
        const data = await response.json();
        console.log("Datos recibidos:", data);
        renderPhotos(data.photos);
    } catch (error) {
        console.error('Error fetching photos:', error);
    }
}

// Función para renderizar las fotos en la galería
function renderPhotos(photos) {
    photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.src.medium;
        img.alt = photo.photographer;
        photoGallery.appendChild(img);
    });
}

// Función para manejar la carga de archivos locales
function handleFileUpload(e) {
    const files = e.target.files;
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imgData = {
                    src: event.target.result,
                    alt: file.name
                };
                localImages.push(imgData);
                renderLocalImage(imgData);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Función para renderizar una imagen local
function renderLocalImage(imgData) {
    const img = document.createElement('img');
    img.src = imgData.src;
    img.alt = imgData.alt;
    photoGallery.insertBefore(img, photoGallery.firstChild);
}

// Función para renderizar todas las imágenes locales
function renderLocalImages() {
    localImages.forEach(renderLocalImage);
}

// Cargar fotos iniciales
renderLocalImages();
fetchPhotos();