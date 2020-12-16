import React from "react";
//google maps
import { GoogleMap, Polygon, DrawingManager } from "@react-google-maps/api";

const containerStyle = {
  width: "770px",
  height: "700px",
};

const polygonOptions = {
  fillColor: "lightblue",
  fillOpacity: 0.5,
  strokeColor: "red",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: true,
  editable: true,
  geodesic: false,
  zIndex: 1,
};

function Map(props) {
  const [map, setMap] = React.useState(null);
  const [path, setPath] = React.useState([]);
  const [newFence, setNewFence] = React.useState(true);

  const polygonInstance = React.useRef(null);
  const listenersRef = React.useRef([]);

  React.useEffect(() => {
    if (props.currentPath.length > 0) {
      setNewFence(false);
      console.log(props.currentPath);
      setPath(props.currentPath);
    }
  }, []);

  React.useEffect(() => {
    props.setPath(path);
  }, [path]);

  // Call setPath with new edited path
  const onEdit = React.useCallback(() => {
    if (polygonInstance.current) {
      const nextPath = polygonInstance.current
        .getPath()
        .getArray()
        .map((latLng) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
    }
  }, [setPath]);

  // Bind refs to current Polygon and listeners
  const onLoad = React.useCallback(
    (polygon) => {
      polygonInstance.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  // Clean up refs
  const onUnmount = React.useCallback(() => {
    listenersRef.current.forEach((lis) => lis.remove());
    polygonInstance.current = null;
  }, []);

  const onPolygonComplete = (pol) => {
    const polygon = [];
    //console.log(pol.getPath());
    pol.getPath().Mb.forEach((coord) => {
      polygon.push({
        lat: coord.lat(),
        lng: coord.lng(),
      });
    });
    pol.setMap(null);
    setPath(polygon);
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{
        lat: 31.20896359,
        lng: 29.96073604,
      }}
      zoom={13}
      onUnmount={onUnmount}
    >
      {path.length > 0 && (
        <Polygon
          onLoad={onLoad}
          paths={path}
          options={polygonOptions}
          onMouseUp={onEdit}
          onDragEnd={onEdit}
          onUnmount={onUnmount}
        />
      )}
      <DrawingManager
        onPolygonComplete={onPolygonComplete}
        drawingMode={newFence ? "polygon" : null}
      />
      <></>
    </GoogleMap>
  );
}

export default Map;
