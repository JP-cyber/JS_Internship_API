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

        await PunkAPI.searchBeer(searchInput.value)
        .then((fetchedBeer) => {
            UI.showElement('.founded-beers');
            UI.renderBeers(fetchedBeer);
        })
        .catch(() => {
            UI.displayError();
            UI.hideElement('.founded-beers');
        });
        
        UI.beerPage = 1;
        searchInput.value = '';
    }
});

//Display/hide up-arrow
document.addEventListener('wheel', () => {
    if(window.pageYOffset >= 100){
        UI.showElement('.arrow');
    }else{
        UI.hideElement('.arrow');
    }
});

document.querySelector('.arrow a').addEventListener('click', () => {
    UI.hideElement('.arrow');
});

//Load more items
document.querySelector('.load-more').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const recentSearch = document.querySelector('.recent-searches li').textContent;
    const pageToFetch = ++UI.beerPage;
    
    await PunkAPI.searchBeer(recentSearch, pageToFetch)
    .then((beer) => {
        UI.renderBeers(beer, false);
    })
    .catch(() => {
        const errorText = 'Warning: there are no more items to load';
        UI.displayError(errorText);
    });
    
});