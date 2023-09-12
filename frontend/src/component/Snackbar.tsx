import {
  Alert,
  Snackbar as MuiSnackbar,
  Slide,
  SlideProps,
  SnackbarCloseReason,
} from '@mui/material';
import { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { dismissSnackbar } from 'src/redux/uiSlice';

const Transition = (props: SlideProps) => <Slide {...props} direction="up" />;

const Snackbar = () => {
  const { showSnackbar, snackbar } = useSelector((rootState: RootState) => rootState.ui);
  const dispatch = useDispatch();

  const onClose = (event: Event | SyntheticEvent, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    dispatch(dismissSnackbar());
  };

  return (
    <MuiSnackbar
      open={showSnackbar}
      autoHideDuration={4000}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
