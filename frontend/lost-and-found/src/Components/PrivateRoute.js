// PrivateRoute.js
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const accessToken = localStorage.getItem('access_token'); // Retrieve the access token from storage

  return (
    <Route
      {...rest}
      render={(props) =>
        accessToken ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" /> // Redirect to the login page if not authenticated
        )
      }
    />
  );
};

export default PrivateRoute;
