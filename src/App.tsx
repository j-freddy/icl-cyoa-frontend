import 'bootstrap/dist/css/bootstrap.min.css';
import 'reactflow/dist/style.css';
import { ReactNode } from 'react';
import WelcomeView from './pages/welcome/Welcome';
import InitialInputView from './pages/initialInput/InitialInput';
import GeneratorView from './pages/generator/Generator';
import LoginView from './pages/login/Login';
import DashboardView from './pages/dashboard/Dashboard';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppFooter from './components/Footer';
import SignupView from "./pages/signup/Signup";
import {
  ACCOUNT_PAGE,
  DASHBOARD_PAGE,
  HOME_PAGE,
  INITIAL_INPUT_PAGE,
  LOGIN_PAGE,
  SIGNUP_PAGE
} from './utils/links';
import AppHeader from './components/Header';
import AccountView from './pages/account/Account';


interface PageProps {
  children: ReactNode;
}

const Page = ({ children }: PageProps) => {
  return (
    <main id="page-container" className="d-flex flex-column">
      <AppHeader links={[
        { label: "Home", link: HOME_PAGE },
        { label: "Dashboard", link: DASHBOARD_PAGE }
      ]}
      />
      <div id="page-body" className="flex-grow-1">
        {children}
      </div>
      <AppFooter />
    </main>
  );
};

function App() {
  const wrapView = (content: ReactNode) => {
    return <Page>{content}</Page>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={HOME_PAGE}
          element={wrapView(<WelcomeView />)}
        />
        <Route
          path={INITIAL_INPUT_PAGE}
          element={wrapView(<InitialInputView />)}
        />
        <Route
          path="/generator/*"
          element={wrapView(<GeneratorView />)}
        />
        <Route
          path={LOGIN_PAGE}
          element={wrapView(<LoginView />)}
        />
        <Route
          path={SIGNUP_PAGE}
          element={wrapView(<SignupView />)}
        />
        <Route
          path={ACCOUNT_PAGE}
          element={wrapView(<AccountView />)}
        />
        <Route
          path={DASHBOARD_PAGE}
          element={wrapView(<DashboardView />)}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
