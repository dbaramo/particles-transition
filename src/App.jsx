import { Canvas } from "@react-three/fiber";
import { OrbitControls, useProgress } from "@react-three/drei";
import Scene from "./Scene";
import { Leva } from "leva";
import { useState } from "react";
import SelectModel from "./SelectModel";
import Info from "./Info";

function Loading() {
  return (
    <div className="loading">
      <h1>LOADING...</h1>
    </div>
  );
}

function App() {
  const [currentModel, changeModel] = useState("murakami");
  const cameraZPosition = window.innerWidth >= 900 ? 2 : 3;
  const { progress, loaded } = useProgress();

  return (
    <>
      {progress < 100 ? (
        <Loading />
      ) : (
        <SelectModel currentModel={currentModel} changeModel={changeModel} />
      )}
      <Leva collapsed />
      <Info />
      <div id="canvas-container">
        <Canvas
          camera={{
            fov: 75,
            near: 0.1,
            far: 1000,
            position: [0, 0, cameraZPosition],
          }}
        >
          <Scene currentModel={currentModel} />
          <OrbitControls />
        </Canvas>
      </div>
    </>
  );
}

export default App;
