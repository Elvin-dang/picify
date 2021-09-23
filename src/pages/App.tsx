import { FC, useEffect } from "react";
import "./App.scss";
import { Route, Switch, useHistory } from "react-router-dom";

import theLayout from "../shared/components/TheLayout";
import routes, { publicRoutes } from "@config/routes";

const App: FC = () => {
  const history = useHistory();

  useEffect(() => {
    routes.forEach((item) => {
      if (window.location.pathname.includes(item.path)) {
        window.document.title = item.title
          ? "Picify | " + item.title
          : "Picify";
      }
    });
  }, []);

  useEffect(() => {
    history.listen((location) => {
      routes.forEach((item) => {
        if (location.pathname.includes(item.path)) {
          window.document.title = item.title
            ? "Picify | " + item.title
            : "Picify";
        }
      });
    });
  }, [history]);

  return (
    <div className="container">
      <Switch>
        {publicRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        ))}
        <Route path="/" component={theLayout} />
      </Switch>
    </div>
  );
};

export default App;
