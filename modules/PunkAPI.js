import UI from './UI.js';

export default class PunkAPI {

    static async searchBeer(beer) {
        const beers = await fetch(`https://api.punkapi.com/v2/beers?beer_name=${beer}`)
        .then(async response => {
            const result = await response.json();
            return PunkAPI._transformBeer(result);
        })
        .catch(err => {
            UI.displayError();
            UI.hideElement('.founded-beers');
        });

        return beers;
    }

    static _transformBeer(beerArr) {
        const res = [];

        beerArr.forEach(beer => {
            const validObj = {
                name: beer.name,
                description: beer.description,
                imageURL: beer['image_url'],
                price: beer['attenuation_level']
            };
            res.push(validObj);
        });
        return res;
    }
}