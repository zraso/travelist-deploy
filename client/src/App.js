import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link
} from "react-router-dom";
import axios from "axios";

import Start from "./components/start/Start";
import StartNew from "./components/new/StartNew";
import TripsListNew from "./components/new/TripsListNew";
import PackingNew from "./components/new/PackingNew";
import ActivityList from "./components/activities/ActivityList";
import PackingList from "./components/travelist/PackingList";
import Trips from "./components/trips/Trips";
import Auth from "./components/user/Auth";
import { AuthContext } from "./components/shared/context/auth-context";

function App() {
  const [userId, setUserId] = useState(false);
  const [name, setName] = useState(false);
  const [token, setToken] = useState(false);
  const [trip, updateTrip] = useState({});
  const [tripList, updateTripList] = useState([]);

  const login = useCallback((userId, name, token) => {
    setToken(token);
    setName(name);
    setUserId(userId);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        name: name,
        token: token
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setName(null);
    updateTrip(null);
    updateTripList(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.name, storedData.token);
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      <React.Fragment>
        <Route exact path="/trips" component={Trips} />
<<<<<<< HEAD
=======
        <Redirect to="/trips" />
>>>>>>> ac0d0e4ed62f943edababd78be714f1b2f5f26ea
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId: userId,
        setUserId: setUserId,
        name: name,
        setName: setName,
        token: token,
        setToken: setToken,
        trip: trip,
        updateTrip: updateTrip,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <Switch>
          <Route exact path="/" component={Start} />
          <Route exact path="/activities" component={ActivityList} />
          <Route exact path="/packinglist" component={PackingList} />
          <Route exact path="/auth" component={Auth} />          
          <Route path="/trips-list" exact>
            <TripsListNew />
          </Route>
          <Route path="/start-new" exact>
            <StartNew />
          </Route>
          <Route path="/packing-new" exact>
            <PackingNew />
          </Route>
          <Redirect to="/" />
          {routes}
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
