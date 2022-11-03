import { ReactNode } from 'react';
import WelcomeView from './pages/Welcome';
import GeneratorView from './pages/Generator';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'reactflow/dist/style.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

interface PageProps {
  children: ReactNode
}

const Page = ({ children }: PageProps) => {
  return (
    <main id="page-container" className="d-flex flex-column">
      <Header />
      <div id="page-body" className="flex-grow-1">
        {children}
      </div>
      <Footer />
    </main>
  );
}

function App() {
  const wrapView = (content: ReactNode) => {
    return (
      <Page>
        {content}
      </Page>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          wrapView(<WelcomeView />)
        } />
        <Route path="/generator" element={
          wrapView(
            <GeneratorView />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
