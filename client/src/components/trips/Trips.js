import React, { useState, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { AuthContext } from "../shared/context/auth-context";
import axios from 'axios';

import TripCard from "./TripCard";
import TripsListHeader from "./TripsListHeader";

function Trips() {

  const auth = useContext(AuthContext);
  const trip = auth.trip;
  const updateTrip = auth.updateTrip;
  const [trips, updateTrips] = useState([])

  const renderName = () => {
    if (auth.name) return (
      <h5>Hey, {auth.name}!</h5>
    );
  }

  const renderTrips = () => {
    const trips = handleGetTrips()
    // trips.map(trip => trip.destination)
  }

  useEffect(() => {
    console.log(handleGetTrips())
  });

  const callUpdateTrips = (tripsarray) => {
    updateTrips(tripsarray)
  }

  const handleGetTrips = () => {
    console.log("Auth", auth)
    console.log("Auth user id", auth.userId)
    axios
      .get(
        `http://localhost:3001/api/users/${auth.userId}/trips`,
        {
          headers: { Authorization: "bearer " + auth.token }
        }
      )
      .then(response => {
        console.log(
          "User's trips array",
          response.data.trips
        );
        return response.data.trips
      })
      .catch(console.log);
  };

  return (
    <div className="justify-content-center d-flex flex-column align-items-center">
      <TripsListHeader />
      
      <h2>{renderName()}</h2>
      <h3>Trips</h3>

      start loop
      <TripCard />
      end loop
    </div>
  );
}

export default Trips;
