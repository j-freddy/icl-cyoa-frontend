import { Loader } from '@mantine/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
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

  const HomePage = () => wrapView(<WelcomeView />);

  const LoginPage = () => checkLoginOnAuthPage(wrapView(<LoginView />));
  const SignupPage = () => checkLoginOnAuthPage(wrapView(<SignupView />));
  const AccountPage = () => checkLogin(wrapView(<AccountView />));

  const DashboardPage = () => checkLogin(wrapView(<DashboardView />));
  const InitialInputPage = () => checkLogin(wrapView(<InitialInputView />));
  const GeneratorPage = () => checkLogin(wrapView(<GeneratorView />));


  return (
    <Routes>
      <Route path={HOME_PAGE} element={<HomePage />} />

      <Route path={LOGIN_PAGE} element={<LoginPage />} />
      <Route path={SIGNUP_PAGE} element={<SignupPage />} />
      <Route path={ACCOUNT_PAGE} element={<AccountPage />} />

      <Route path={DASHBOARD_PAGE} element={<DashboardPage />} />
      <Route path={INITIAL_INPUT_PAGE} element={<InitialInputPage />} />
      <Route path={GENERATOR_PAGE + "*"} element={<GeneratorPage />} />
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


  useEffect(() => {
    dispatch(startConnecting());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn) {
      dispatch(loginWithSession());
    }
  }, [dispatch, loggedIn]);

  useEffect(() => {
    if (!loggedIn && sessionLoginFail) {
      navigate(LOGIN_PAGE);
    }
  }, [navigate, loggedIn, sessionLoginFail]);


  if (loggedIn) {
    return (<>{content}</>);
  }

  return (
    <div className={"loader"}>
      <Loader />
    </div>
  );
};


const checkLoginOnAuthPage = (content: JSX.Element) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(selectLoggedIn);


  useEffect(() => {
    dispatch(startConnecting());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn) {
      dispatch(loginWithSession());
    }
  }, [dispatch, loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      navigate(DASHBOARD_PAGE);
    }
  }, [navigate, loggedIn]);


  return (<>{content}</>);
}
