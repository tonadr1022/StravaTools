"use client";
import React from "react";
import { StravaActivityRaw } from "@/utils/types";
import { fetchActivities } from "@/strava/fetchActivities";
import { User } from "@prisma/client";
import { decode } from "@mapbox/polyline";
import { all_activities } from "@/utils/strava_activities";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "@/app/leaflet.css";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const colors = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Orange",
  "Black",
  "White",
  "Pink",
  "Brown",
  "Grey",
  "LightBlue",
  "LightGreen",
  "LightYellow",
  "LightPurple",
  "LightOrange",
];

function ActivitiesMap({ user }: { user: User }) {
  const [activities, setActivities] = React.useState<StravaActivityRaw[]>([]);
  const [center, setCenter] = React.useState<[number, number] | null>(null);

  React.useEffect(() => {
    const fetchRecentActivities = async () => {
      //   const activities = await fetchActivities(user.stravaAccessToken!, 7);
      const activities = all_activities.slice(0, 10);
      const firstCoords = decode(activities[0].map.summary_polyline)[0];
      const center = firstCoords;
      console.log(center);
      setCenter(center);
      setActivities(activities);
    };
    fetchRecentActivities();
  }, [user.stravaAccessToken]);

  return (
    <div className="h-96 w-96 border-2 border-white">
      {center ? (
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={center}
          zoom={13}>
          {activities.map((activity, i) => {
            const polyline = decode(activity.map.summary_polyline);
            return (
              <Polyline
                key={activity.id}
                pathOptions={{ color: colors[i] }}
                positions={polyline}>
                <Popup>
                  <span>{activity.start_date}</span>
                  <br />
                  <span>{activity.distance}</span>
                  <br />
                  <span>{activity.name}</span>
                </Popup>
              </Polyline>
            );
          })}

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      ) : (
        <span>loading map from client</span>
      )}
    </div>
  );
}

export default ActivitiesMap;
