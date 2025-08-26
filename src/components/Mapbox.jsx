// Mapbox.jsx
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedDrone } from "../redux/slices/droneSlice";
import DroneSvg from "../assets/svg/Drone.svg?react";
import { renderToStaticMarkup } from "react-dom/server";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJkYWxsYWhhcmVmNjUiLCJhIjoiY21lcHVrOGp4MHNtbjJrcXZsMTBudHNsdiJ9.BrPZ_T8I6bgDAo2iwaPvxQ";

export default function Mapbox() {
  const dispatch = useDispatch();

  const selectedDrone = useSelector((state) => state.drones.selectedDrone);
  const droneData = useSelector((state) => state.drones.droneData);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !selectedDrone) return;

    const map = mapRef.current;

    const drone = droneData.find((d) => d.id === selectedDrone);
    if (!drone || !drone.path.length) return;

    const lastCoord = drone.path[drone.path.length - 1];

    map.flyTo({
      center: lastCoord,
      zoom: 15,
      speed: 1.5,
      curve: 2,
    });
  }, [selectedDrone]);

  useEffect(() => {
    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [35.9124, 31.8939],
      zoom: 10,
    });

    // Add zoom and rotation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => mapRef.current.remove();
  }, []);

  useEffect(() => {
    if (!mapRef.current || !droneData.length) return;
    const map = mapRef.current;

    function addOrUpdateDrones() {
      // --- Prepare drone point features ---
      const droneFeatures = droneData.map((drone) => {
        const lastCoord = drone.path[drone.path.length - 1];
        let angle = 0;

        // Calculate bearing (rotation) between last two points
        if (drone.path.length > 1) {
          const [lng1, lat1] = drone.path[drone.path.length - 2];
          const [lng2, lat2] = lastCoord;
          angle = (Math.atan2(lat2 - lat1, lng2 - lng1) * 180) / Math.PI;
        }

        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: lastCoord },
          properties: { id: drone.id, bearing: angle, color: drone.color },
        };
      });

      const droneGeoJSON = {
        type: "FeatureCollection",
        features: droneFeatures,
      };

      // --- Prepare drone path features ---
      const pathFeatures = droneData.map((drone) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          // Simplify path using turf.js for better performance
          coordinates: turf.simplify(
            {
              type: "Feature",
              geometry: { type: "LineString", coordinates: drone.path },
            },
            { tolerance: 0.0005, highQuality: true }
          ).geometry.coordinates,
        },
        properties: { id: drone.id, color: drone.color },
      }));

      const pathGeoJSON = { type: "FeatureCollection", features: pathFeatures };

      // --- Add sources and layers ---
      if (!map.getSource("drones")) {
        map.addSource("drones", {
          type: "geojson",
          data: droneGeoJSON,
          cluster: true, // enable clustering
          clusterRadius: 50,
        });

        // Drone SVG icon as a string
        const svgString = renderToStaticMarkup(<DroneSvg />);
        // Convert SVG string to an image
        const img = new Image();
        img.src =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);

        img.onload = () => {
          // Add drone image if not already added
          if (!map.hasImage("drone-icon")) map.addImage("drone-icon", img);

          // Background circle behind drone (with dynamic color)
          map.addLayer({
            id: "drones-bg",
            type: "circle",
            source: "drones",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-radius": 12,
              "circle-color": ["get", "color"], // use drone color
            },
          });

          // Drone symbol (SVG)
          map.addLayer({
            id: "drones-layer",
            type: "symbol",
            source: "drones",
            layout: {
              "icon-image": "drone-icon",
              "icon-size": 0.5,
              "icon-allow-overlap": true,
              "icon-rotate": ["get", "bearing"], // rotate based on bearing
            },
          });
        };

        // Drone paths (lines)
        map.addSource("drone-paths", { type: "geojson", data: pathGeoJSON });
        map.addLayer({
          id: "drone-paths",
          type: "line",
          source: "drone-paths",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": ["get", "color"], // dynamic path color
            "line-width": 2,
          },
        });

        // Clustered points visualization
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "drones",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#f700ff",
            "circle-radius": [
              "step",
              ["get", "point_count"],
              15,
              100,
              20,
              750,
              25,
            ],
          },
        });

        // Cluster count text
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "drones",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });
      } else {
        // --- Update data if sources already exist ---
        map.getSource("drones").setData(droneGeoJSON);
        map.getSource("drone-paths").setData(pathGeoJSON);
      }
    }

    // Add drones only when style is fully loaded
    if (map.isStyleLoaded()) {
      addOrUpdateDrones();
    } else {
      map.on("load", addOrUpdateDrones);
    }
  }, [droneData]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    map.on("click", "drones-layer", (e) => {
      if (!e.features || !e.features.length) return;
      const clickedDrone = e.features[0].properties;
      dispatch(setSelectedDrone(clickedDrone.id));
    });

    map.on("mouseenter", "drones-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "drones-layer", () => {
      map.getCanvas().style.cursor = "";
    });
  }, [dispatch]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
  );
}
