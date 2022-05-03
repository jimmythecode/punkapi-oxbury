import axios from 'axios'

interface Hops {
    add: string;
    amount: {
        unit: string;
        value: number;
    };
    attribute: string;
    name: string;
}

interface Malt {
    amount: { value: number; unit: string };
    name: string;
}

export interface Beer {
    abv: number;
    attenuation_level: number;
    boil_volume: { value: number; unit: string };
    brewers_tips: string;
    contributed_by: string;
    description: string;
    ebc: number | null;
    first_brewed: string;
    food_pairing: string[];
    ibu: number | null;
    id: number;
    image_url: string;
    ingredients: { malt: Malt[]; hops: Hops[]; yeast: string };
    method: { mash_temp: unknown[]; fermentation: {}; twist: unknown };
    name: string;
    ph: number | null;
    srm: number | null;
    tagline: string;
    target_fg: number;
    target_og: number;
    volume: { value: number; unit: string };
}

export function isButtonDisabled(buttonType: 'previous' | 'next', page: number, apiData: Beer[]) {
    if (apiData.length === 0) return true;
    if (page === 1) {
        if (buttonType === 'previous') return true;
        if (buttonType === 'next') {
            if (apiData.length > 14) {
                return false
            } else return true;
        }
    } else {
        if (buttonType === 'previous') return false;
        if (buttonType === 'next') {
            // If the next page is empty
            if (apiData.slice(0 + page * 15, 15 + page * 15).length === 0) return true;
            // If button is 'next' and the page is > 2, and the next page isn't empty
            return false;
        }
    }
    throw new Error("unexpected case in isButtonDisabled()")
}

export const apiUrl = 'https://api.punkapi.com/v2/beers'

export async function fetchApi(): Promise<Beer[]> {
    const returnValue = await axios.get<Beer[]>(apiUrl, {});
    return returnValue.data;
}
