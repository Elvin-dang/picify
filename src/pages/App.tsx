import { FC } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import theLayout from "../shared/components/TheLayout/TheLayout";
import SignInAndSignUp from "./SignInAndSignUp";

const App: FC = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Switch>
          <Route path="/sign-in" exact={true} component={SignInAndSignUp} />
          <Route path="/" component={theLayout} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
