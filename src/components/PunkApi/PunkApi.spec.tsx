import PunkApi from './PunkApi';
import { render, screen, within, act, waitForElementToBeRemoved } from '@testing-library/react';
import exampleBeers from './beersExample';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { apiUrl } from './punkApi';
import userEvent from '@testing-library/user-event';

function delay(time: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, time));
}

const server = setupServer(
	rest.get(apiUrl, (req, res, ctx) => {
		return res(ctx.json(exampleBeers));
	})
);

beforeAll(() => {
	// jest.useFakeTimers();
	server.listen();
});

afterEach(() => {
	// jest.clearAllTimers();
	server.resetHandlers();
});

afterAll(() => server.close());

describe('PunkApi Component', () => {
	test('renders table', () => {
		render(<PunkApi />);
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
	test('loads api data', async () => {
		render(<PunkApi />);
		// Renders cells with data-testid
		await screen.findByTestId('table-body-cell1');
		expect(screen.getByTestId('table-body-cell1')).toBeTruthy();
		// Renders 15 'more info' buttons:
		const buttons = await screen.findAllByRole('button', {
			name: /more info/i,
		});
		expect(buttons.length).toBe(15);
		// Renders 15 rows within the table body:
		const table = await screen.findByRole('table');
		const [tableHeader, tableBody] = within(table).getAllByRole('rowgroup');
		const bodyRows = within(tableBody).getAllByRole('row');
		expect(bodyRows.length).toBe(15);
		// screen.debug(bodyRows);
	});
	test('loads api data, then type', async () => {
		render(<PunkApi />);
		const textInput = (await screen.findByRole('textbox', { name: /search/i })) as HTMLInputElement;
		// screen.debug(textInput);
		await userEvent.type(textInput, 'buzz');
		expect(textInput.value).toBe('buzz');
		const table = await screen.findByRole('table');
		const [tableHeader, tableBody] = within(table).getAllByRole('rowgroup');
		const bodyRows = within(tableBody).getAllByRole('row');
		expect(bodyRows.length).toBe(15);
		// screen.debug(bodyRows);
	});
	test.only('try with fireEvent', async () => {
		render(<PunkApi />);
		// Need to await something in the table body in order for the tests to work
		const buttons = await screen.findAllByRole('button', {
			name: /more info/i,
		});
		// Select the search textfield:
		const textInput = (await screen.findByRole('textbox', { name: /search/i })) as HTMLInputElement;
		// Filter out all results by putting in a bad search string:
		await userEvent.type(textInput, 'nothing should show');
		expect(textInput.value).toBe('nothing should show');
		const emptyResultsMessage = await screen.findByText('No matching results. Try expanding the filters.');
		const table = await screen.findByRole('table');
		const [tableHeader, tableBody] = within(table).getAllByRole('rowgroup');
		expect(tableBody).toBeEmptyDOMElement();
		expect(emptyResultsMessage).toBeInTheDocument();
		// Change search text to 'buzz' so that only one result shows:
		// textInput.setSelectionRange(0, textInput.value.length) // select all text, but doesn't work for me?
		textInput.value = "";
		await userEvent.type(textInput, 'buzz');
		expect(textInput.value).toBe('buzz');
		await waitForElementToBeRemoved(emptyResultsMessage)
		const buzzRow = await screen.findByText(/buzz/i);
		const tableRows = await screen.findAllByRole('rowgroup');
		const bodyRows = within(tableRows[1]).getAllByRole('row');
		expect(bodyRows.length).toBe(1);
		
		// screen.debug(tableRows[1]);
	});
});
