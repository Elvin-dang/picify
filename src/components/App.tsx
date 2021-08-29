import { FC } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import SignIn from "./SignIn/SignIn";
import theLayout from "../shared/components/TheLayout";

const App: FC = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact={true} component={theLayout} />
          <Route path="/sign-in" exact={true} component={SignIn} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
