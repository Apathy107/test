import React, { useRef, useEffect } from "react";
import { Viewer, Cartesian3, HeadingPitchRoll } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

/** 三维底图（Cesium）组件，在容器内创建并销毁 Viewer */
const CesiumMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const viewer = new Viewer(el, {
      useDefaultRenderLoop: true,
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      homeButton: true,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: true,
      navigationInstructionsInitiallyVisible: false,
    });

    viewerRef.current = viewer;

    const camera = viewer.camera;
    camera.setView({
      destination: Cartesian3.fromElements(-2179077.0, 4383192.0, 4086919.0),
      orientation: new HeadingPitchRoll(0, -1.57, 0),
    });

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
};

export default CesiumMap;
