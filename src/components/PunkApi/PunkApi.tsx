import React, { useEffect, useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, CircularProgress, IconButton } from '@mui/material';
import { Beer, fetchApi, isButtonDisabled } from './punkApi';
import MoreInfoDialog from '../MoreInfoDialog/MoreInfoDialog';
import HelpIcon from '@mui/icons-material/Help';
import ErrorIcon from '@mui/icons-material/Error';
import SearchResultsInput from '../SearchResultInput/SearchResultsInput';

function Loading() {
	return (
		<Box id='loading-circle'>
			<CircularProgress />
			<p>Fetching data...</p>
		</Box>
	);
}

function Error() {
	return (
		<Box id='error'>
			<ErrorIcon color='error' />
			<p>Failed to fetch data from the API. Try refreshing.</p>
		</Box>
	);
}

function PunkApi() {
	const [apiData, setApiData] = useState<Beer[]>([]);
	const [initialApiData, setInitialApiData] = useState<Beer[]>([]);
	const [page, setPage] = useState(1);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedBeer, setSelectedBeer] = useState<Beer | undefined>(undefined);
	const [fetchTimestamp, setFetchTimestamp] = useState('');
	const [apiError, setApiError] = useState(false);

	useEffect(() => {
		setPage(1);
	}, [apiData]);

	useEffect(() => {
		if (initialApiData.length > 0) return;
		fetchApi()
			.then((parsed) => {
				setApiData(parsed);
				setInitialApiData(parsed);
				setFetchTimestamp(new Date().toUTCString());
				setApiError(false);
			})
			.catch((error) => {
				setApiError(true);
				console.error(error);
			});
	}, [initialApiData.length]);

	return (
		<div data-testid='punk-api'>
			<br />
			<h2>Punk API - Oxbury Technical Assessment</h2>
			<br />
			<MoreInfoDialog data={selectedBeer} open={dialogOpen} setOpen={setDialogOpen} />
			<SearchResultsInput initialResults={initialApiData} localSearchResults={apiData} setLocalSearchResults={setApiData} />
			<div className='paginationButtons'>
				<div></div>
				<div>
					<IconButton
						aria-label='previous page'
						onClick={() => setPage((prev) => prev - 1)}
						disabled={isButtonDisabled('previous', page, apiData)}
					>
						<KeyboardArrowLeftIcon />
					</IconButton>
					<IconButton
						aria-label='next page'
						onClick={() => setPage((prev) => prev + 1)}
						disabled={isButtonDisabled('next', page, apiData)}
					>
						<KeyboardArrowRightIcon />
					</IconButton>
				</div>
				<div>
					<p>
						Showing results {1 + (page - 1) * 15} - {15 + (page - 1) * 15} of {apiData.length}
					</p>
				</div>
			</div>
			<table id='beer-table'>
				<thead>
					<tr>
						<th>Name</th>
						<th>abv (%)</th>
						<th>Volume</th>
						<th>Hops</th>
						<th>Malt</th>
						<th>Yeast</th>
						<th>More Info</th>
					</tr>
				</thead>

				<tbody>
					{apiData.slice(0 + (page - 1) * 15, 15 + (page - 1) * 15).map((curBeerRow, index) => (
						<tr key={curBeerRow.name} data-testid={`table-body-row${index}`}>
							<td data-testid={`table-body-cell${index}`}>{curBeerRow.name}</td>
							<td>{curBeerRow.abv}</td>
							<td>
								{curBeerRow.volume.value} ({curBeerRow.volume.unit})
							</td>
							<td>
								{curBeerRow.ingredients.hops.map(
									(curHopObj, index) => `${index === 0 ? '' : '; '}${curHopObj.name}`
								)}
							</td>
							<td>
								{curBeerRow.ingredients.malt.map(
									(curMaltObj, index) => `${index === 0 ? '' : '; '}${curMaltObj.name}`
								)}
							</td>
							<td>{curBeerRow.ingredients.yeast}</td>
							<td>
								<IconButton
									aria-label='more info'
									onClick={() => {
										setDialogOpen(true);
										setSelectedBeer(curBeerRow);
									}}
								>
									<HelpIcon />
								</IconButton>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<br />
			{initialApiData.length > 0 && apiData.length === 0 && <p>No matching results. Try expanding the filters.</p>}
			{fetchTimestamp.length === 0 && <Loading />}
			{apiError && <Error />}
			<br />
			<br />
			<br />
		</div>
	);
}

export default PunkApi;
