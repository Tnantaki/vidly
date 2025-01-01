import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Movies from "./components/Movies";
import Customers from "./components/Customers";
import Rentals from "./components/Rentals";
import NotFound from "./components/NotFound";
import MovieForm from "./components/MovieForm";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Logout from "./components/Logout";
import auth from './services/authService'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from "./components/common/ProtectedRoute";

class App extends Component {
  state = {};

  render() {
    const user = auth.getCurrentUser()

    return (
      <div>
        <ToastContainer />
        <NavBar user={user} />
        <div className="content container">
          <Routes>
            <Route
              path="/login"
              element={!user ? <LoginForm /> : <Navigate to={"/"} />}
            />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/movies" element={<Movies user={user} />} />
            <Route path="/movies/new" element={<MovieForm />} />
            <Route
              path="/movies/:id"
              element={<ProtectedRoute user={user} Component={MovieForm} />}
            />
            <Route path="/customers" element={<Customers />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/" element={<Navigate to="/movies" />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
