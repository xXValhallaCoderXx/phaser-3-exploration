import { Route, Switch, Redirect } from "react-router-dom";
import Game from "./pages/game";
import AuthRoutes from "./pages/auth";
import { ProtectedRoute } from "shared/components/protected-route";
import NavigationHeader from "shared/components/navigation-header/navigation-header";
const RootRoutes = () => {
  return (
    <>
      <NavigationHeader />
      <Switch>
        <Route path="/auth/*">
          <AuthRoutes />
        </Route>

        <ProtectedRoute path="/game" component={Game} isAuthenticated={false} />
        <Route>
          <Redirect to="/auth/login" />
        </Route>
      </Switch>
    </>
  );
};

export default RootRoutes;
