import { Navigate, Route, Routes } from 'react-router-dom';
import AdminQuestion from './page/adminQuestion';
import Print from './page/print';
import Question from './page/question';

const AppRoutes = () => (
  <Routes>
    <Route path="/question" element={<Question />} />
    <Route path="/question/print" element={<Print />} />
    <Route path="/admin/question" element={<AdminQuestion />} />
    <Route path="/*" element={<Navigate to="/question" />} />
  </Routes>
);

export default AppRoutes;
