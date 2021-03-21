import Favourites from './Favourites.js';

export default class UI {

    static beerPage = 1;
    static recentSearch = '';

    static renderBeers(beers, resetList = true, targetSelector = '.founded-beers ul') {
        const targetList = document.querySelector(targetSelector);

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

    static renderBeer(beerObj) {
        const targetModal = document.querySelector('.single-item-content');
        const btnText = Favourites.isFavourite(beerObj.name) ? 'Remove' : 'Add';
        const btnClass = Favourites.isFavourite(beerObj.name) ? 'red' : 'green';
        targetModal.innerHTML = `
        <h2>${beerObj.name}</h2>
        <h3>${beerObj.tagline}</h3>
        <img src="${beerObj.imageURL}">
        <p>${beerObj.description}</p>
        <pre>
            ABV: ${beerObj.abv}
            EBC: ${beerObj.ebc}
            IBU: ${beerObj.ibu}
            PH: ${beerObj.ph}
            SRM: ${beerObj.srm}
            Price: ${beerObj.price}
        </pre>
        <p>Brewers Tips: ${beerObj.brewersTips}</p>
        <button class="fav-toggle ${btnClass}">${btnText}</button>
        <h5>${beerObj.firstBrewed} Contributed By: ${beerObj.contributed}</h5>
        `;
    }

    static displaySingleBeer(beer) {
        UI.renderBeer(beer);
        UI.showElement('.single-item-modal');

        const modalBtn = document.querySelector('.single-item-content button');
        modalBtn.onclick = () => {
            Favourites.toggleItem(modalBtn);
            UI.toggleBtn(modalBtn);
        }
    }

    static toggleBtn(item) {
        if( Favourites.isFavourite(item) ){
            item.classList.remove('green');
            item.classList.add('red');
            item.textContent = 'Remove';
        }else{
            item.classList.remove('red');
            item.classList.add('green');
            item.textContent = 'Add';
        }
        
        //Favourite button behaviour
        const favBtn = document.querySelector('.fav-btn');

        if(Favourites.getLength() > 0){
            favBtn.removeAttribute('disabled');
        }else{
            favBtn.setAttribute('disabled', true);
        }
        document.querySelector('.fav-counter').textContent = Favourites.getLength();
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