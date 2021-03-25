import React, { useEffect } from "react";
import AppNavbar from "./components/AppNavbar";
import Footer from "./components/Footer";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import Items from "./components/Items";
import About from "./components/About";
import Contact from "./components/Contact";
import Item from "./components/Item";
import LandingPage from "./components/LandingPage/LandingPage.js";
import HistoryPage from "./components/HistoryPage";
import ChangePassword from "./components/ChangePassword";
import { loadUser } from "./actions/authActions";

function App() {
  useEffect(() => {
    store.dispatch(loadUser()); 
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppNavbar />
          <Route
            exact
            path="/"
            render={() => {
              const token = localStorage.getItem("token");
              if (token) {
                return <Redirect to={{ pathname: "/Landing" }} />;
              } else {
                return <Redirect to={{ pathname: "/Landing" }} />;
              }
            }}
          />
          <Switch>
            <Route path="/SignIn" exact component={SignIn} />
            <Route path="/SignUp" exact component={SignUp} />
            <Route path="/User" exact component={Profile} />
            <Route path="/Items" exact component={Items} />
            <Route path="/Item/:id" exact component={Item} />
            <Route path="/Cart" exact component={Cart} />
            <Route path="/ChangePassword" exact component={ChangePassword} />
            <Route path="/History" exact component={HistoryPage} />
            <Route path="/Landing" exact component={LandingPage} />
            <Route path="/About" exact component={About} />
            <Route path="/Contact" exact component={Contact} />
          </Switch>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}
export default App;
