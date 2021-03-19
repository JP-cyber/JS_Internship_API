export default class PunkAPI {

    static async searchBeer(beer, page = 1) {
        const beers = await fetch(`https://api.punkapi.com/v2/beers?beer_name=${beer}&page=${page}&per_page=25`)
        .then(async response => {
            const result = await response.json();
            
            if(result.length === 0){
                throw Error;
            }
            return PunkAPI._transformBeer(result);
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