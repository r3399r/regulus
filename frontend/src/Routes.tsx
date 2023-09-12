import { Navigate, Route, Routes } from 'react-router-dom';
import EditQuestion from './page/editQuestion';
import Question from './page/question';

const AppRoutes = () => (
  <Routes>
    <Route path="/question" element={<Question />} />
    <Route path="/admin/question" element={<EditQuestion />} />
    <Route path="/*" element={<Navigate to="/question" />} />
  </Routes>
);

export default AppRoutes;
