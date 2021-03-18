import UI from './modules/UI.js';
import LocalStorageHandler from  './modules/LocalStorageHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    UI.updateRecentSearches();
});

//Show/hide recent searches block on focus/blur
document.querySelector('#search-input').addEventListener('focus', () => {
    UI.toggleRecentSearches();
});

document.querySelector('#search-input').addEventListener('blur', () => {
    UI.toggleRecentSearches();
});

//Set search item
document.querySelector('.search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('#search-input');
    if(searchInput.value){
        LocalStorageHandler.setSearchItem(searchInput.value);
        UI.updateRecentSearches();
        searchInput.value = '';
    }
});
