import { render, screen } from '@testing-library/react';
import exampleBeers from '../PunkApi/beersExample';
import SearchResultsInput, { fuzzySearchUpdate } from './SearchResultsInput';
import Fuse from 'fuse.js';
import userEvent from '@testing-library/user-event';

const mockSetState = jest.fn();

describe('SearchResultInput functions', () => {
	const textSearchInputState = 'buzz';
	const initialResults = exampleBeers;
	const localSearchResults = initialResults;
	const fuse = new Fuse(initialResults, {
		keys: ['name'],
		fieldNormWeight: 1,
	});
	test('fuzzySearchUpdate() - search "buzz"', () => {
		const functionResult = fuzzySearchUpdate(textSearchInputState, fuse, localSearchResults, initialResults);
		expect(functionResult).toStrictEqual([exampleBeers[0]]);
	});
	test('fuzzySearchUpdate() - search "buzz", when we already have buzz in the array', () => {
		const functionResult = fuzzySearchUpdate(textSearchInputState, fuse, [exampleBeers[0]], initialResults);
		expect(functionResult).toBe(null);
	});
	test('fuzzySearchUpdate() - empty search, when already have full array', () => {
		const textSearchInputState = '';
		const functionResult = fuzzySearchUpdate(textSearchInputState, fuse, localSearchResults, initialResults);
		expect(functionResult).toBe(null);
	});
	test('fuzzySearchUpdate() - empty search, when have partial array', () => {
		const functionResult = fuzzySearchUpdate('', fuse, initialResults.slice(0, 10), initialResults);
		expect(functionResult?.length).toBe(25);
	});
});

const setup = () => {
	const utils = render(
		<SearchResultsInput
			initialResults={exampleBeers}
			localSearchResults={exampleBeers}
			setLocalSearchResults={mockSetState}
		/>
	);
	// const inputMui = screen.getByLabelText(/Search Beer Names/i) as HTMLInputElement;
	// where the "name" prop will be used to match the label of the input
	const textInput = screen.getByRole('textbox', { name: /search/i }) as HTMLInputElement;
	return {
		textInput,
		...utils,
	};
};

describe('SearchResultInput Component', () => {
	test('renders component', () => {
		const { textInput } = setup();
		// screen.debug()
		expect(textInput).toBeTruthy();
	});
	test('enters text into input', async () => {
		const { textInput } = setup();
		await userEvent.type(textInput, 'buzz');
		expect(textInput.value).toBe('buzz');
	});
});
