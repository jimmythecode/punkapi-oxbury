import { render, screen } from '@testing-library/react';
import exampleBeers from '../PunkApi/beersExample';
import SearchResultsInput from './SearchResultsInput';

const mockSetState = jest.fn();

describe('MoreInfoDialog Component', () => {
	test('renders table', () => {
		render(<SearchResultsInput initialResults={exampleBeers} localSearchResults={exampleBeers} setLocalSearchResults={mockSetState}
			 />);
		expect(screen.getByRole('textbox')).toBeTruthy();
	});
});




