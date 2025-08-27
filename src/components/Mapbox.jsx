// MapBox.jsx

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedDrone } from "../redux/slices/droneSlice";
import DroneSvg from "../assets/svg/Drone.svg?react";
import { renderToStaticMarkup } from "react-dom/server";

mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_TOKEN;

function MapBox() {
  const dispatch = useDispatch();

  //selected drone and drone data from Redux
  const selectedDrone = useSelector((state) => state.drones.selectedDrone);
  const droneData = useSelector((state) => state.drones.droneData);

  // refs for the map && container map
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // when the selected drone changes  fly to last coordinate
  useEffect(() => {
    if (!mapRef.current || !selectedDrone) return;
    const map = mapRef.current;

    // find the drone by id
    const drone = droneData.find((d) => d.id == selectedDrone);
    if (!drone || !drone.path.length) return;

    // find last point in the path
    const lastCoord = drone.path[drone.path.length - 1];

    // fly to the selected drone
    map.flyTo({
      center: lastCoord,
      zoom: 15,
      speed: 1.5,
      curve: 2,
    });
  }, [selectedDrone]);

  // initialize  map
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [35.9124, 31.8939],
      zoom: 10,
    });

    // add navigation controls (zoom,rotation)
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    return () => mapRef.current.remove();
  }, []);

  // add or update drone info when data changes
  useEffect(() => {
    if (!mapRef.current || !droneData.length) return;
    const map = mapRef.current;

    //creates or updates layers
    function addOrUpdateDrones() {
      // convert each drone to point at last coordinate
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

      // GeoJSON :البيانات الجغرافية
      const droneGeoJSON = {
        type: "FeatureCollection",
        features: droneFeatures,
      };
      // build LineString path features per drone and simplify geometry for performance.
      //اذا كان مسار الدرون يحتوي على الاف النقاط فإن هذه الدالة تقلل عدد النقاط مع الحفاظ على الشكل الاساسي
      const pathFeatures = droneData.map((drone) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: turf.simplify(
            {
              type: "Feature",
              geometry: { type: "LineString", coordinates: drone.path },
            },
            {
              tolerance: 0.0005, // higher value the more points are removed from the path
              highQuality: true, // uses a higher-quality algorithm that keeps the path closer to its original shape
            }
          ).geometry.coordinates,
        },
        properties: { id: drone.id, color: drone.color },
      }));

      const pathGeoJSON = { type: "FeatureCollection", features: pathFeatures };

      // add sources/layers if first time otherwise, update the data.
      if (!map.getSource("drones")) {
        // GeoJSON source for drone points with clustering enabled.
        map.addSource("drones", {
          type: "geojson",
          data: droneGeoJSON,
          cluster: true,
          clusterRadius: 50,
        });

        // convert  SVG React component for Mapbox icons
        const svgComponent = renderToStaticMarkup(<DroneSvg />);
        const img = new Image();
        img.src =
          "data:image/svg+xml;charset=utf-8," +
          encodeURIComponent(svgComponent);

        // if image is loaded register it as "drone-icon" and add layers
        img.onload = () => {
          if (!map.hasImage("drone-icon")) map.addImage("drone-icon", img);

          // colored circular background under the icon
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

          //layer to render the drone SVG icon
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

        // layer drone paths (lines)
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

        // circle layer for clusters
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

        // symbol layer to display cluster counts.
        // map.addLayer({
        //   id: "cluster-count",
        //   type: "symbol",
        //   source: "drones",
        //   filter: ["has", "point_count"],
        //   layout: {
        //     "text-field": "{point_count_abbreviated}",
        //     "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        //     "text-size": 12,
        //   },
        // });
      } else {
        map.getSource("drones").setData(droneGeoJSON);
        map.getSource("drone-paths").setData(pathGeoJSON);
      }
    }

    // if style is loaded  update immediately otherwise wait for the load event
    if (map.isStyleLoaded()) {
      addOrUpdateDrones();
    } else {
      map.on("load", addOrUpdateDrones);
    }
  }, [droneData]);

  // setup interactions (click,hover) and create a hover popup
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    // on clicking a drone set the selected drone in redux
    map.on("click", "drones-layer", (e) => {
      if (!e.features || !e.features.length) return;
      const clickedDrone = e.features[0].properties;
      dispatch(setSelectedDrone(clickedDrone.id));
    });

    // on mouse enter over the background circle show info popup
    map.on("mouseenter", "drones-bg", (e) => {
      map.getCanvas().style.cursor = "pointer";
      if (!e.features || !e.features.length) return;

      const { id, altitude, appearanceTime } = e.features[0].properties;

      // Build popup HTML content
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

    // while moving the mouse over the circle  keep the popup following
    map.on("mousemove", "drones-bg", (e) => {
      if (!e.features || !e.features.length) return;
      popup.setLngLat(e.lngLat);
    });

    // on mouse leave reset cursor and remove the popup
    map.on("mouseleave", "drones-bg", () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    // Memory leaks : يعني ممكن ان تمتلىء الذاكرة في المتصفح
    // cleanup listeners on unmount to prevent leaks
    return () => {
      map.off("click", "drones-layer", () => {});
      map.off("mouseenter", "drones-bg", () => {});
      map.off("mousemove", "drones-bg", () => {});
      map.off("mouseleave", "drones-bg", () => {});
      popup.remove();
    };
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
  );
}
export default React.memo(MapBox);
