import { FC } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import theLayout from "../shared/components/TheLayout/TheLayout";
import SignInAndSignUp from "./SignInAndSignUp/SignInAndSignUp";

const App: FC = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact={true} component={theLayout} />
          <Route path="/sign-in" exact={true} component={SignInAndSignUp} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
