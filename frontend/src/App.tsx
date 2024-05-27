import Loader from './component/Loader';
import Snackbar from './component/Snackbar';
import AppRoutes from './Routes';

const App = () => (
  <>
    <AppRoutes />
    <Loader />
    <Snackbar />
  </>
);

export default App;
