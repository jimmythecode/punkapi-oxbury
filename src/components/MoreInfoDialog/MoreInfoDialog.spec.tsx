import { render, screen } from '@testing-library/react';
import exampleBeers from '../PunkApi/beersExample';
import MoreInfoDialog from './MoreInfoDialog';

const mockSetOpen = jest.fn();

describe('MoreInfoDialog Component', () => {
	test('renders table', () => {
		render(<MoreInfoDialog open={true} setOpen={mockSetOpen} data={exampleBeers[0]} />);
		expect(screen.getByRole('dialog')).toBeTruthy();
	});
});


