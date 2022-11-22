import { ReactNode } from 'react';
import WelcomeView from './pages/welcome/Welcome';
import InitialInputView from './pages/initialInput/InitialInput';
import GeneratorView from './pages/generator/Generator';
import LoginView from './pages/login/Login';
import DashboardView from './pages/dashboard/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'reactflow/dist/style.css';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SignupView from "./pages/signup/Signup";


interface PageProps {
	children: ReactNode;
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
};

function App() {
	const wrapView = (content: ReactNode) => {
		return <Page>{content}</Page>;
	};

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={wrapView(<WelcomeView />)}
        />
        <Route
          path="/initial-input"
          element={wrapView(<InitialInputView />)}
        />
        <Route
          path="/generator/*"
          element={wrapView(<GeneratorView />)}
        />
        <Route
          path="/login"
          element={wrapView(<LoginView />)}
        />
        <Route
          path="/signup"
          element={wrapView(<SignupView />)}
        />
        <Route
          path="/dashboard"
          element={wrapView(<DashboardView />)}
        />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
