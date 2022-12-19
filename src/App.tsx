import { Container, Loader, Text } from '@mantine/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import 'reactflow/dist/style.css';
import AppFooter from './components/Footer';
import AppHeader from './components/Header';
import AccountView from './pages/account/Account';
import DashboardView from './pages/dashboard/Dashboard';
import GeneratorView from './pages/generator/Generator';
import InitialInputView from './pages/initialInput/InitialInput';
import LoginView from './pages/login/Login';
import SignupView from "./pages/signup/Signup";
import WelcomeView from './pages/welcome/Welcome';
import { loginWithSession, selectLoggedIn, selectSessionLoginFail } from './store/features/accountSlice';
import { startConnecting } from './store/features/wsSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  ACCOUNT_PAGE,
  DASHBOARD_PAGE,
  GENERATOR_PAGE,
  HOME_PAGE,
  INITIAL_INPUT_PAGE,
  LOGIN_PAGE,
  SIGNUP_PAGE
} from './utils/pages';


function App() {

  return (
    <Routes>
      <Route
        path={HOME_PAGE}
        element={wrapView(<WelcomeView />)}
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
        element={wrapView(checkLogin(<AccountView />))}
      />

      <Route
        path={DASHBOARD_PAGE}
        element={wrapView(checkLogin(<DashboardView />))}
      />
      <Route
        path={INITIAL_INPUT_PAGE}
        element={wrapView(checkLogin(<InitialInputView />))}
      />
      <Route
        path={GENERATOR_PAGE + "*"}
        element={wrapView(checkLogin(<GeneratorView />))}
      />
    </Routes>
  );
}

export default App;




const wrapView = (content: JSX.Element) => {

  return (
    <main id="page-container" className="d-flex flex-column">
      <AppHeader links={[
        { label: "Home", link: HOME_PAGE },
        { label: "Dashboard", link: DASHBOARD_PAGE }
      ]}
      />
      <div id="page-body" className="flex-grow-1">
        {content}
      </div>
      <AppFooter />
    </main>
  );
};


const checkLogin = (content: JSX.Element) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const loggedIn = useAppSelector(selectLoggedIn);
  const sessionLoginFail = useAppSelector(selectSessionLoginFail);

  const [goToLogin, setGoToLogin] = useState(false);


  useEffect(() => {
    dispatch(startConnecting());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn) {
      dispatch(loginWithSession());
    }
  }, [dispatch]);

  useEffect(() => {
    if (goToLogin) {
      navigate(LOGIN_PAGE);
    }
  }, [goToLogin])


  if (loggedIn) {
    return (<>{content}</>);
  }

  if (sessionLoginFail) {
    setTimeout(() => setGoToLogin(true), 2000);
    return (
      <Container className="wrapper">
        <Text>You are not logged in. Redirecting right now ...</Text>
      </Container>
    );
  }

  return (
    <Container className="wrapper">
      <Loader />
    </Container>
  );

};
