import { Box, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import Fuse from 'fuse.js';
import SearchIcon from '@mui/icons-material/Search';
import { Beer } from '../PunkApi/punkApi';

function SearchResultsInput({
  initialResults,
  localSearchResults,
  setLocalSearchResults,
}: {
  initialResults:  Beer[],
  localSearchResults: Beer[];
  setLocalSearchResults: React.Dispatch<React.SetStateAction<Beer[]>>;
}) {
  const [textSearchInputState, setTextSearchInputState] = useState('');

  // Initialise fuzzy search object
  const fuse = React.useMemo(
    () =>
      new Fuse(initialResults, {
        keys: ['name'],
      }),
    [initialResults]
  );
  // Fuzzy search with input to filter results
  React.useEffect(() => {
    // Set debounce to improve performance
    const delayDebounceFn = setTimeout(() => {
      if (textSearchInputState.length === 0) {
        if (initialResults.length === localSearchResults.length) return;
        setLocalSearchResults(initialResults);
      } else if (textSearchInputState.length > 0) {
        const fuseSearchResult = fuse
          .search(textSearchInputState)
          .map((thisFuseResult) => thisFuseResult.item);
        if (
          fuseSearchResult.length === localSearchResults.length &&
          fuseSearchResult.every((val, index) => val === localSearchResults[index])
        )
          return;
        setLocalSearchResults(fuseSearchResult);
      }
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
