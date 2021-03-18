import UI from './modules/UI.js';
import LocalStorageHandler from  './modules/LocalStorageHandler.js';
import PunkAPI from  './modules/PunkAPI.js';
import Validator from './modules/Validator.js';

document.addEventListener('DOMContentLoaded', () => {
    UI.updateRecentSearches();
});

//Set search item and search beer
document.querySelector('.search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('#search-input');
    const isInputValid = !!searchInput.value && Validator.validate(searchInput.value);

    if(isInputValid){
        LocalStorageHandler.setSearchItem(searchInput.value);
        UI.updateRecentSearches();

        const fetchedBeer = await PunkAPI.searchBeer(searchInput.value);
        UI.showElement('.founded-beers');
        UI.renderBeers(fetchedBeer);
        searchInput.value = '';
    }
});
