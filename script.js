import UI from './modules/UI.js';
import LocalStorageHandler from  './modules/LocalStorageHandler.js';
import PunkAPI from  './modules/PunkAPI.js';
import Validator from './modules/Validator.js';
import Favourites from './modules/Favourites.js';

document.addEventListener('DOMContentLoaded', () => {
    UI.updateRecentSearches();
    Favourites.refresh();
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
        const validItem = Validator.replaceSpecialChars(item);
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

    if(searchQuery){
        await PunkAPI.searchBeer(searchQuery)
        .then(beer => {
            UI.renderBeers(beer);
        });
    }
    
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

//Display single item from list
document.querySelector('.founded-beers ul').addEventListener('click', async (e) => {
    if(!e.target.matches('button')){
        const listItem = e.target.closest('li');
        const itemName = listItem.querySelector('h2').textContent;
        const validItemName = Validator.replaceSpecialChars(itemName);
        const beer = await PunkAPI.searchBeer(validItemName, 1, true);
        UI.displaySingleBeer(beer);
    }
});

//Display single item from favourites
document.querySelector('.fav-items').addEventListener('click', async (e) => {
    if(!e.target.matches('button')){
        const listItem = e.target.closest('li');
        const itemName = listItem.querySelector('h2').textContent;
        const validItemName = Validator.replaceSpecialChars(itemName);
        const beer = await PunkAPI.searchBeer(validItemName, 1, true);
        UI.displaySingleBeer(beer);
    }
});

//Hide single item
document.addEventListener('keydown', async (e) => {
    const singleItemModal = document.querySelector('.single-item-modal');
    const isEventAppropriate = e.key === 'Escape' && !singleItemModal.classList.contains('hide');

    if(isEventAppropriate){
        //Rerender main list
        const searchQuery = UI.recentSearch;
        const beerPage = UI.beerPage;
        
        if(beerPage > 1 && searchQuery){
            for(let i = 1; i <= beerPage; i++){
                const beerObj = await PunkAPI.searchBeer(searchQuery, i);
                const resetList = i > 1 ? false : true;
                UI.renderBeers(beerObj, resetList);
            }
        }else if(beerPage <= 1 && searchQuery){
            await PunkAPI.searchBeer(searchQuery, beerPage)
            .then(beer => {
                UI.renderBeers(beer);
            })
            .catch(() => {});
            
        }
        
        //Rerender favourites list
        const favItems = Favourites.getItems();
        const iteratedItems = [];

        for(let item of favItems){
            const validItem = Validator.replaceSpecialChars(item);
            const beer = await PunkAPI.searchBeer(validItem);
            iteratedItems.push(...beer);
        }
        UI.renderBeers(iteratedItems, true, '.fav-items');
        //Remove not favorite
        const listItemsBtns = document.querySelectorAll('.fav-items li button');
        listItemsBtns.forEach(item => {
            if( item.classList.contains('green') ){
                item.parentElement.remove();
            }
        });
        UI.hideElement('.single-item-modal');

        //Hide favourites if it's empty
        const favModal = document.querySelector('.fav-modal li');

        if(!favModal){
            UI.hideElement('.fav-modal');
        }
    }
});
