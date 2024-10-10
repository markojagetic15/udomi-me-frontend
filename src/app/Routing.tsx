import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from '@pages';

export const Routing = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};
