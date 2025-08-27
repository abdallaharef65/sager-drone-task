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

function Mapbox() {
  const dispatch = useDispatch();

  const selectedDrone = useSelector((state) => state.drones.selectedDrone);
  const droneData = useSelector((state) => state.drones.droneData);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !selectedDrone) return;

    const map = mapRef.current;
    const drone = droneData.find((d) => d.id == selectedDrone);
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
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [35.9124, 31.8939],
      zoom: 10,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => mapRef.current.remove();
  }, []);

  useEffect(() => {
    if (!mapRef.current || !droneData.length) return;
    const map = mapRef.current;

    function addOrUpdateDrones() {
      const droneFeatures = droneData.map((drone) => {
        const lastCoord = drone.path[drone.path.length - 1];

        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: lastCoord },
          properties: {
            id: drone.id,
            color: drone.color,
            altitude: drone.properties.altitude,
            appearanceTime: drone.properties.appearanceTime,
          },
        };
      });

      const droneGeoJSON = {
        type: "FeatureCollection",
        features: droneFeatures,
      };

      const pathFeatures = droneData.map((drone) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
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

      if (!map.getSource("drones")) {
        map.addSource("drones", {
          type: "geojson",
          data: droneGeoJSON,
          cluster: true,
          clusterRadius: 50,
        });

        const svgString = renderToStaticMarkup(<DroneSvg />);
        const img = new Image();
        img.src =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);

        img.onload = () => {
          if (!map.hasImage("drone-icon")) map.addImage("drone-icon", img);

          map.addLayer({
            id: "drones-bg",
            type: "circle",
            source: "drones",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-radius": 12,
              "circle-color": ["get", "color"],
            },
          });

          map.addLayer({
            id: "drones-layer",
            type: "symbol",
            source: "drones",
            layout: {
              "icon-image": "drone-icon",
              "icon-size": 0.5,
              "icon-allow-overlap": true,
            },
          });
        };

        map.addSource("drone-paths", { type: "geojson", data: pathGeoJSON });
        map.addLayer({
          id: "drone-paths",
          type: "line",
          source: "drone-paths",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": ["get", "color"],
            "line-width": 2,
          },
        });

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
        map.getSource("drones").setData(droneGeoJSON);
        map.getSource("drone-paths").setData(pathGeoJSON);
      }
    }

    if (map.isStyleLoaded()) {
      addOrUpdateDrones();
    } else {
      map.on("load", addOrUpdateDrones);
    }
  }, [droneData]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("click", "drones-layer", (e) => {
      if (!e.features || !e.features.length) return;
      const clickedDrone = e.features[0].properties;
      dispatch(setSelectedDrone(clickedDrone.id));
    });

    map.on("mouseenter", "drones-bg", (e) => {
      map.getCanvas().style.cursor = "pointer";
      if (!e.features || !e.features.length) return;

      const { id, altitude, appearanceTime } = e.features[0].properties;

      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<div style="
          background-color:#000;
          color:#fff;
          padding:8px 12px;
          border-radius:8px;
          font-family:sans-serif;
          font-size:13px;
          line-height:1.4;
          text-align:left;
          min-width:180px;">
        <div style="font-weight:bold; font-size:14px; margin-bottom:4px;">${id}</div>
        <div style="display:flex; justify-content:space-between; margin-top:4px;">
          <div>
            <div style="opacity:0.7;">Altitude</div>
            <div>${altitude} m</div>
          </div>
          <div style="text-align:right;">
            <div style="opacity:0.7;">Flight Time</div>
            <div>${appearanceTime}</div>
          </div>
        </div>
      </div>`
        )
        .addTo(map);
    });

    map.on("mousemove", "drones-bg", (e) => {
      if (!e.features || !e.features.length) return;
      popup.setLngLat(e.lngLat);
    });

    map.on("mouseleave", "drones-bg", () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
  );
}
export default React.memo(Mapbox);
