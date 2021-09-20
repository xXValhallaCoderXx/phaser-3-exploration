import { Route, Switch } from "react-router-dom";
import SignInContainer from "./pages/auth/sign-in";
import LoginContainer from "./pages/auth/login";
const RootRoutes = () => {
  return (
    <Switch>
      <Route to="/login">
        <LoginContainer />
      </Route>
      <Route to="/">
        <SignInContainer />
      </Route>
    </Switch>
  );
};

export default RootRoutes;
