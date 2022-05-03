import exampleBeers from './beersExample';
import { isButtonDisabled } from './punkApi';

describe("isButtonDisabled()", () => {
    test("button is 'previous'", async () => {
        let page = 1;
        const testResponse = isButtonDisabled('previous', page, exampleBeers);
        // If we're on first page, we expect the previous button to be disabled
        expect(testResponse).toEqual(true);
        page = 2;
        const testResponsePage2 = isButtonDisabled('previous', page, exampleBeers);
        // If we're on page 2, we expect the previous button to be enabled
        expect(testResponsePage2).toEqual(false);
    });
    test("button is 'next'", async () => {
        let page = 1;
        const testResponse = isButtonDisabled('next', page, exampleBeers);
        // If we're on first page, we expect the next button to be enabled when there are > 15 Beers in the array
        expect(testResponse).toEqual(false);
        const testResponseZeroBeers = isButtonDisabled('next', page, []);
        // If there are zero beers, expect the next button to be disabled
        expect(testResponseZeroBeers).toEqual(true);
        const testResponseFiveBeers = isButtonDisabled('next', page, exampleBeers.slice(0, 5));
        // If there are fewer than 15 beers, expect the next button to be disabled
        expect(testResponseFiveBeers).toEqual(true);
        page = 2;
        const testResponsePage2 = isButtonDisabled('next', page, exampleBeers);
        expect(testResponsePage2).toEqual(true);
        const testResponsePage2ManyBeers = isButtonDisabled('next', page, exampleBeers.concat(exampleBeers));
        // If we're on page 2, we expect the next button to be enabled if there are > 30 Beers in the array
        expect(testResponsePage2ManyBeers).toEqual(false);
    });

});
