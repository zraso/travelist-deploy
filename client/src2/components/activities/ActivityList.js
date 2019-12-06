import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { AuthContext } from "../shared/context/auth-context";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import ActivityListItem from "./ActivityListItem";

function ActivityList() {
  const auth = useContext(AuthContext);
  const trip = auth.trip;
  const updateTrip = auth.updateTrip;

  let history = useHistory();

  const [activities, setActivities] = useState([
    "skiing",
    "hiking",
    "business"
  ]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const callUpdateTrip = trip => {
    updateTrip(trip);
  };

  const select = activity => {
    if (selectedActivities.includes(activity)) return;
    setSelectedActivities([...selectedActivities, activity]);
  };

  const deselect = activity => {
    if (!selectedActivities.includes(activity)) return;
    const newSelectedActivities = [...selectedActivities];
    newSelectedActivities.splice(selectedActivities.indexOf(activity), 1);
    setSelectedActivities(newSelectedActivities);
  };

  const getImage = async (destination) => {
    const formattedDestination = destination.split(' ').join('+');
    const apiKey = process.env.REACT_APP_IMAGE_API_KEY;
    const url = `https://api.pexels.com/v1/search?query=${formattedDestination}&per_page=1&page=1`;

    const imageUrl = await axios.get(
      url,
      { headers: { 'Authorization': `${apiKey}` } }
    )
      .then(response => {
        const photoResults = response.data.photos;
        if (photoResults.length > 0) return photoResults[0].src.medium;
      })
    return imageUrl;
  }

  const handleCreateList = e => {
    getImage(trip.destination)
      .then(imageUrl => {
        axios
          .patch(
            `https://travelistmakers.herokuapp.com/api/trips/${trip._id}`,
            {
              destination: trip.destination,
              activities: selectedActivities,
              imageUrl: imageUrl
            },
            {
              headers: { Authorization: "bearer " + auth.token }
            }
          )
          .then(response => {
            callUpdateTrip(response.data.trip);
            console.log(
              "update trip with activities: response",
              response.data.trip
            );
            history.push('/packinglist');
          })
          .catch(console.log);
      });
  };

  const renderHeader = () => {
    if (trip.destination) {
      return <h3>Things I'll be doing in {trip.destination}</h3>;
    }
  };

  const renderActivitiesList = () => {
    const activitiesList = activities.map((activity, index) => {
      return (
        <ActivityListItem
          key={activity}
          name={activity}
          select={select}
          deselect={deselect}
        />
      );
    });
    ReactDOM.render(activitiesList, document.getElementById("activities-list"));
  };

  useEffect(() => {
    console.log("Activities: trip obj", trip);
    renderActivitiesList();
    console.log("Selected activities", selectedActivities);
  });

  return (
    <div>
      {renderHeader()}

      <div id="activities-list"></div>

      <button data-cy="generate-list-button" onClick={handleCreateList}>
        Generate a Travelist!
      </button>

    </div>
  );
}

export default ActivityList;
