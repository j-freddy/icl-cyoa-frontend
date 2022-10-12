import WelcomeView from './pages/Welcome';
import GeneratorView from './pages/Generator';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeView />} />
        <Route path="/generator" element={<GeneratorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
