import { FC } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import SignIn from "./SignIn/SignIn";
import theLayout from "../shared/components/TheLayout";
import SignUp from "./SignUp/SignUp";

const App: FC = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact={true} component={theLayout} />
          <Route path="/sign-in" exact={true} component={SignIn} />
          <Route path="/sign-up" exact={true} component={SignUp} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
