export default class UI {

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

    static renderBeers(beers) {
        const targetList = document.querySelector('.founded-beers ul');
        targetList.innerHTML = '';
        const isBeersValid = typeof beers == 'object' && beers.length > 0;

        if(isBeersValid){
            beers.forEach(({imageURL, name, description,price}) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
            <img src="${imageURL}">
            <h2>${name}</h2>
            <p>${description}</p>
            <p>Price: ${price}</p>
            `;
            targetList.append(listItem);
            });
        }else{
            UI.hideElement('.founded-beers');
        }
        
    }

    static displayError() {
        const errorModal = document.querySelector('.error-modal');
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