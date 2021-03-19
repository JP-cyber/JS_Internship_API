import Favourites from './Favourites.js';

export default class UI {

    static beerPage = 1;
    static recentSearch = '';

    static renderBeers(beers, resetList = true) {
        const targetList = document.querySelector('.founded-beers ul');

        if(resetList){
            targetList.innerHTML = '';
        }

        const isBeersValid = typeof beers == 'object' && beers.length > 0;

        if(isBeersValid){
            beers.forEach(({imageURL, name, description,price}) => {
            const listItem = document.createElement('li');
            const btnText = Favourites.isFavourite(name) ? 'Remove' : 'Add';
            const btnClass = Favourites.isFavourite(name) ? 'red' : 'green';

            listItem.innerHTML = `
            <img src="${imageURL}">
            <h2>${name}</h2>
            <p>${description}</p>
            <p>Price: ${price}</p>
            <button class="fav-toggle ${btnClass}">${btnText}</button>
            `;
            targetList.append(listItem);
            });
        }
    }

    static updateRecentSearches() {
        const searches = localStorage.getItem('searches');

        const searchesBlock = document.querySelector('.recent-searches');
        searchesBlock.innerHTML = '';

        if(searches){
            JSON.parse(searches).forEach(search => {
            const li = document.createElement('li');
            li.textContent = search;
            searchesBlock.append(li);
            });
        }else{
            searchesBlock.innerHTML = '<li>Your recent search</li>';
        }
    }

    static displayError(text = null) {
        const errorModal = document.querySelector('.error-modal');

        if(text){
            errorModal.textContent = text;
        }else{
            errorModal.textContent = 'There were no properties found for the given location';
        }

        errorModal.classList.remove('hide');
        setTimeout(() => {
            errorModal.classList.add('hide');
        }, 3000);
    }

    static showElement(selector){
        const element = document.querySelector(selector);
        element.classList.remove('hide');
    }

    static hideElement(selector) {
        const element = document.querySelector(selector);
        if(!element.classList.contains('hide')){
            element.classList.add('hide');
        }
    }

}