import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register } from '@pages';

export const Routing = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};
