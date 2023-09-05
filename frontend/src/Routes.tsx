import { Navigate, Route, Routes } from 'react-router-dom';
import Question from './page/question';

const AppRoutes = () => (
  <Routes>
    <Route path="/question" element={<Question />} />
    <Route path="/*" element={<Navigate to="/question" />} />
  </Routes>
);

export default AppRoutes;
