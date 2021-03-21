import LocalStorageHandler from './LocalStorageHandler.js';

export default class Favourites {

    static _items = [];

    static toggleItem(item) {
        const itemName = item.parentElement.querySelector('h2').textContent;

        if(Favourites._items.includes(itemName)){
            const itemIndex = Favourites._items.indexOf(itemName);
            Favourites._items.splice(itemIndex, 1);
        }else{
            Favourites._items.push(itemName);
        }
        LocalStorageHandler.toggleFavItem(itemName);
    }

    static refresh() {
        const favsArr = JSON.parse( localStorage.getItem('favs') );
        if(favsArr){
            Favourites._items = favsArr;
        }
        const favBtn = document.querySelector('.fav-btn');

        if(Favourites.getLength() > 0){
            favBtn.removeAttribute('disabled');
        }else{
            favBtn.setAttribute('disabled', true);
        }
        document.querySelector('.fav-counter').textContent = Favourites.getLength();
    }

    static isFavourite(item) {
        let itemName = item;
        if(typeof item !== 'string'){
            itemName = item.parentElement.querySelector('h2').textContent;
        }
        return Favourites._items.includes(itemName);
    }

    static getLength() {
        return Favourites._items.length;
    }

    static getItems() {
        return Favourites._items;
    }

}