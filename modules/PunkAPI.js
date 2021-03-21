export default class PunkAPI {

    static async searchBeer(beer, page = 1, returnExtended = false) {
        const beers = await fetch(`https://api.punkapi.com/v2/beers?beer_name=${beer}&page=${page}&per_page=25`)
        .then(async response => {
            const result = await response.json();
            
            if(result.length === 0){
                throw Error;
            }
            if(returnExtended){
                return PunkAPI._transformToExtended(result);
            }else{
                return PunkAPI._transformBeer(result);
            }
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

    static _transformToExtended(beerArr) {
        const res = [];

        beerArr.forEach(beer => {
            const validObj = {
                name: beer.name,
                description: beer.description,
                imageURL: beer['image_url'],
                price: beer['attenuation_level'],
                abv: beer.abv,
                tagline: beer.tagline,
                ebc: beer.ebc,
                firstBrewed: beer['first_brewed'],
                srm: beer.srm,
                brewersTips: beer['brewers_tips'],
                ph: beer.ph,
                contributed: beer['contributed_by'],
                ibu: beer.ibu
            };
            res.push(validObj);
        });
        return res[0];
    }
}