import UI from './modules/UI.js';
import LocalStorageHandler from  './modules/LocalStorageHandler.js';
import PunkAPI from  './modules/PunkAPI.js';
import Validator from './modules/Validator.js';
import Favourites from './modules/Favourites.js';

document.addEventListener('DOMContentLoaded', () => {
    UI.updateRecentSearches();
});

//Set search item and search beer
document.querySelector('.search-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchInput = document.querySelector('#search-input');
    const isInputValid = !!searchInput.value && Validator.validate(searchInput.value);

    if(isInputValid){
        await PunkAPI.searchBeer(searchInput.value)
        .then((fetchedBeer) => {
            LocalStorageHandler.setSearchItem(searchInput.value);
            UI.updateRecentSearches();

            UI.showElement('.founded-beers');
            UI.renderBeers(fetchedBeer);
        })
        .catch(() => {
            UI.displayError();
            UI.hideElement('.founded-beers');
        });
        UI.beerPage = 1;
        UI.recentSearch = searchInput.value;
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
    
    const recentSearch = UI.recentSearch;
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

//Recall recent searches
document.querySelector('.recent-searches').addEventListener('click', async (e) => {
    const recentSearch = UI.recentSearch = e.target.textContent;
    const searchInput = document.querySelector('#search-input');
    searchInput.value = recentSearch;

    await PunkAPI.searchBeer(recentSearch)
    .then((beer) => {
        UI.beerPage = 1;
        UI.showElement('.founded-beers');
        UI.renderBeers(beer);
    })
    .catch(() => {
        const errorText = 'Warning: unvalid search query';
        UI.displayError(errorText);
    });
});

//Add to favourites
document.querySelector('.founded-beers').addEventListener('click', (e) => {
    const item = e.target;

    if(item.classList.contains('fav-toggle')){
        Favourites.toggleItem(item);
        UI.toggleBtn(item);
    }
});

//Display favourites
document.querySelector('.fav-btn').addEventListener('click', async () => {
    const favItems = Favourites.getItems();
    const iteratedItems = [];
    for(let item of favItems){
        const validItem = item.replace(/[& ]/g, "");
        const beer = await PunkAPI.searchBeer(validItem);
        iteratedItems.push(...beer);
    }
    UI.renderBeers(iteratedItems, true, '.fav-items');

    //Remove not favourite items from list
    const listItemsBtns = document.querySelectorAll('.fav-items li button');
    listItemsBtns.forEach(item => {
        if( item.classList.contains('green') ){
            item.parentElement.remove();
        }
    });
    UI.showElement('.fav-modal');
});

//Hide favourites and rerender items
document.querySelector('.fav-modal').addEventListener('click', async (e) => {
if( e.target.classList.contains('fav-modal') ){
    const searchQuery = UI.recentSearch;
    const beerObj = await PunkAPI.searchBeer(searchQuery);
    UI.renderBeers(beerObj);
    UI.hideElement('.fav-modal');
}
});

//Remove items from favourites modal
document.querySelector('.fav-items').addEventListener('click', (e) => {
    const item = e.target;

    if( item.classList.contains('fav-toggle') ){ 
        Favourites.toggleItem(item);
        UI.toggleBtn(item);
    }
});