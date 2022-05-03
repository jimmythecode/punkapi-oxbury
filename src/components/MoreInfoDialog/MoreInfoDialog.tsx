import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Beer } from '../PunkApi/punkApi';

const Transition = React.forwardRef(
	(
		props: TransitionProps & {
			children: React.ReactElement;
		},
		ref: React.Ref<unknown>
	) => <Slide direction='up' ref={ref} {...props} />
);

interface MoreInfoDialogProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	data: Beer | undefined;
}

export default function MoreInfoDialog({ data, open, setOpen }: MoreInfoDialogProps) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog fullScreen={fullScreen} open={open} onClose={handleClose} TransitionComponent={Transition} maxWidth='md'>
			<AppBar sx={{ position: 'relative', backgroundColor: '#04aa6d' }}>
				<Toolbar>
					<IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
						<CloseIcon />
					</IconButton>
					<Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
						More info for: "{data && data.name}""
					</Typography>
				</Toolbar>
			</AppBar>
			<Box sx={{ margin: '24px 24px', width: '350px', '&>span': { display: 'inline-block', marginTop: '8px' } }}>
				<Typography variant='caption'>Name:</Typography>
				<Typography sx={{ marginTop: 0 }}>{data?.name}</Typography>
				<Typography variant='caption'>Tagline:</Typography>
				<Typography sx={{ marginTop: 0 }}>{data?.tagline}</Typography>
				<br />
				<Box sx={{ '&>img': { width: '100px', margin: 'auto', display: 'block' } }}>
					<img src={data?.image_url} alt={data?.name} />
				</Box>
				<br />
				<Typography variant='caption'>Description:</Typography>
				<Typography sx={{ marginTop: 0 }}>{data?.description}</Typography>
				<Typography variant='caption'>ABV:</Typography>
				<Typography sx={{ marginTop: 0 }}>{data?.abv}%</Typography>
				<br />
				<Typography variant='h5'>Ingredients:</Typography>
				<Typography variant='caption'>Malt:</Typography>
				{data?.ingredients.malt.map((curMaltObj, index) => (
					<li key={`${curMaltObj.name}-${index}`}>{`${curMaltObj.name}: ${curMaltObj.amount.value} ${curMaltObj.amount.unit}`}</li>
				))}
				<Typography variant='caption'>Hops:</Typography>
				{data?.ingredients.hops.map((curHopsObj, index) => (
					<li key={`${curHopsObj.name}-${index}`}>{`${curHopsObj.name}: ${curHopsObj.amount.value} ${curHopsObj.amount.unit}`}</li>
				))}
				<Typography variant='caption'>Yeast:</Typography>
				<Typography sx={{ marginTop: 0 }}>{data?.ingredients.yeast}</Typography>
			</Box>
		</Dialog>
	);
}
