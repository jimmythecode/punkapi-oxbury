import PunkApi from './PunkApi';
import { render, screen, within } from '@testing-library/react';
import exampleBeers from './beersExample';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { apiUrl } from './punkApi';


const server = setupServer(
	rest.get(apiUrl, (req, res, ctx) => {
		return res(ctx.json(exampleBeers));
	})
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('PunkApi Component', () => {
	render(<PunkApi />);
	test('renders table', () => {
		expect(screen.getByTestId('punk-api')).toBeTruthy();
		expect(screen.getByRole('table')).toBeTruthy();
		const table = screen.getByRole('table');
		const [tableHeader, tableBody] = within(table).getAllByRole('rowgroup');
		expect(within(tableHeader).getByRole('row')).toBeTruthy();
		const [headerRow] = within(tableHeader).getAllByRole('row');
		expect(within(headerRow).getAllByRole('columnheader')).toBeTruthy();
		const columnHeaders = within(headerRow).getAllByRole('columnheader');
		expect(within(columnHeaders[0]).getByText(/name/i)).toBeTruthy();
	});
});

test('loads and api data', async () => {
	render(<PunkApi />);
	await screen.findByTestId('table-body-cell1');
	expect(screen.getByTestId('table-body-cell1')).toBeTruthy();
});