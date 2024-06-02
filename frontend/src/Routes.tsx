import { Route, Routes } from 'react-router-dom';
import AdminQuestion from './page/adminQuestion';
import AdminQuestionEdit from './page/adminQuestionEdit';
import Print from './page/print';
import Question from './page/question';
import Result from './page/result';
import User from './page/user';
import UserDetail from './page/userDetail';

const AppRoutes = () => (
  <Routes>
    <Route path="/question" element={<Question />} />
    <Route path="/question/print" element={<Print />} />
    <Route path="/user/:id" element={<UserDetail />} />
    <Route path="/admin/question" element={<AdminQuestion />} />
    <Route path="/admin/question/edit" element={<AdminQuestionEdit />} />
    <Route path="/admin/user" element={<User />} />
    <Route path="/admin/result" element={<Result />} />
  </Routes>
);

export default AppRoutes;
