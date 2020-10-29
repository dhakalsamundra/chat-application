import React from 'react'
import { Container } from "react-bootstrap";
import { BrowserRouter, Switch } from "react-router-dom";
import ApolloProvider from "./ApolloProvider";

import "./App.scss";
import Register from "./pages/Register";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import { AuthProvider } from './context/auth'
import { MessageProvider } from './context/message'
import PrivateRoute from './util/PrivateRoute'


function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
      <BrowserRouter>
        <Container className="pt-5">
          <Switch>
            <PrivateRoute path="/register" component={Register} guest />
            <PrivateRoute exact path="/" component={Home} authenticated />
            <PrivateRoute path="/login" component={Login} guest />
          </Switch>
        </Container>
      </BrowserRouter>
      </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
