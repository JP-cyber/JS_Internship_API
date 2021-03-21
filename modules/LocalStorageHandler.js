export default class LocalStorageHandler {
    
    static setSearchItem(item){
        const searches = localStorage.getItem('searches');

        if(!searches){
            const arr = [item];
            const jsonArr = JSON.stringify(arr);
            
            localStorage.setItem('searches', jsonArr);

        }else{
            const parsedSearches = JSON.parse(searches);

            if(parsedSearches.length < 10){
                parsedSearches.unshift(item);
            }else{
                parsedSearches.pop();
                parsedSearches.unshift(item);
            }
            
            const jsonSearches = JSON.stringify(parsedSearches);

            localStorage.setItem('searches', jsonSearches);
        }
    }

    static toggleFavItem(item) {
        const favs = localStorage.getItem('favs');
        
        if(!favs){
            const arr = [item];
            const jsonArr = JSON.stringify(arr);

            localStorage.setItem('favs', jsonArr);
        }else{
            const favArr = JSON.parse(favs);
            if( favArr.includes(item) ){
                const itemIndex = favArr.indexOf(item);
                favArr.splice(itemIndex, 1);
            }else{
                favArr.push(item);
            }
            const jsonFavs = JSON.stringify(favArr);
            localStorage.setItem('favs', jsonFavs);
        }
        
    }
}