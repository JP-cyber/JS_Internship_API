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