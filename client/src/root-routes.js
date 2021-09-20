import { Route, Switch } from "react-router-dom";
import SignInContainer from "./pages/auth/sign-in";
import LoginContainer from "./pages/auth/sign-up";
const RootRoutes = () => {
  return (
    <Switch>
      {/* <Route exact to="/login">
        <LoginContainer />
      </Route> */}
      <Route exact to="/">
        <SignInContainer />
      </Route>
    </Switch>
  );
};

export default RootRoutes;
