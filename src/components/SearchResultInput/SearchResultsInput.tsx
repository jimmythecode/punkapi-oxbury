import { Box, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import Fuse from 'fuse.js';
import SearchIcon from '@mui/icons-material/Search';
import { Beer } from '../PunkApi/punkApi';

export function fuzzySearchUpdate(
	textSearchInputState: string,
	fuse: Fuse<Beer>,
	localSearchResults: Beer[],
	initialResults: Beer[]
): Beer[] | null {
	if (textSearchInputState.length > 0) {
		const fuseSearchResult = fuse.search(textSearchInputState).map((thisFuseResult) => thisFuseResult.item);
		if (
			fuseSearchResult.length === localSearchResults.length &&
			fuseSearchResult.every((val, index) => val === localSearchResults[index])
		)
			return null;
		return fuseSearchResult;
	}
	// If no text input, all results should show
	if (textSearchInputState.length === 0 && initialResults.length === localSearchResults.length) return null;
	// If there us no text in the input, and the localSearchResults aren't the same as the initial, return the initial:
	return initialResults;
}

function SearchResultsInput({
	initialResults,
	localSearchResults,
	setLocalSearchResults,
}: {
	initialResults: Beer[];
	localSearchResults: Beer[];
	setLocalSearchResults: React.Dispatch<React.SetStateAction<Beer[]>>;
}) {
	const [textSearchInputState, setTextSearchInputState] = useState('');

	// Initialise fuzzy search object
	const fuse = React.useMemo(
		() =>
			new Fuse(initialResults, {
				keys: ['name'],
				fieldNormWeight: 1,
			}),
		[initialResults]
	);
	// Fuzzy search with input to filter results
	React.useEffect(() => {
		// Set debounce to improve performance
		const delayDebounceFn = setTimeout(() => {
			const updateStateValue = fuzzySearchUpdate(textSearchInputState, fuse, localSearchResults, initialResults);
			updateStateValue && setLocalSearchResults(updateStateValue);
		}, 250);
		return () => clearTimeout(delayDebounceFn);
	}, [fuse, localSearchResults, initialResults, setLocalSearchResults, textSearchInputState]);

	return (
		<Box sx={{ margin: '16px 16px' }}>
			<TextField
				value={textSearchInputState}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setTextSearchInputState(event.target.value);
				}}
				autoFocus
				label='Search Beer Names'
				variant='outlined'
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<SearchIcon />
						</InputAdornment>
					),
				}}
			/>
		</Box>
	);
}

export default SearchResultsInput;
