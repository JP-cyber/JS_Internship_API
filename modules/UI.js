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
}