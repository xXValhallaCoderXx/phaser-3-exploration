import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import ForgotPassword from "./forgot-password";
import ResetPassword from "./reset-password";

const AuthRoutes = () => {
  return (
    <Switch>
      <Route exact path={`/auth/login`}>
        <Login />
      </Route>
      <Route path={`/auth/register`}>
        <Register />
      </Route>
      <Route path={`/auth/forgot-password`}>
        <ForgotPassword />
      </Route>
      <Route path={`/auth/reset-password`}>
        <ResetPassword />
      </Route>
      <Route>
        <Redirect to="/auth/login" />
      </Route>
    </Switch>
  );
};

export default AuthRoutes;
