import { extend, useFrame, createPortal } from "@react-three/fiber";
import { useFBO, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { FBOMeshShader } from "./FBOMeshShader";
import { PointsShader } from "./PointsShader";
import { getModelDataTexture, getRandomnessArray } from "./utils";
import { useControls } from "leva";
import { bezier } from "@leva-ui/plugin-bezier";

extend({ FBOMeshShader });
extend({ PointsShader });

export default function FBOMesh({ currentModel }) {
  const size = 316;

  const { duration, curve } = useControls({
    duration: {
      value: 1.3,
      min: 0,
      max: 5,
      step: 0.1,
    },
    curve: bezier([0.16, 1, 0.3, 1]),
  });

  const startTimeRef = useRef(0);
  const points = useRef();
  const fboMeshShaderRef = useRef();
  
  const murakamiMesh = useGLTF("/murakami.glb").nodes.murakami;
  const neon_signMesh = useGLTF("/neon-sign.glb").nodes.neon_sign;
  const dragonMesh = useGLTF("/dragon.glb").nodes.dragon;

  const modelTextures = {
    murakami: useMemo(() => getModelDataTexture(size, murakamiMesh), [size]),
    neon_sign: useMemo(() => getModelDataTexture(size, neon_signMesh), [size]),
    dragon: useMemo(() => getModelDataTexture(size, dragonMesh), [size]),
  };

  const modelIndex = {
    murakami: 0,
    neon_sign: 1,
    dragon: 2,
  };

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1
  );
  const positions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO({
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    type: THREE.FloatType,
  });

  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }

    return particles;
  }, [size]);

  const randomnessArray = useMemo(() => getRandomnessArray(size), [size]);

  const [model1State, changeModel1State] = useState(null);
  const [model2State, changeModel2State] = useState(null);

  function changingModels() {
    startTimeRef.current = 0;
    changeModel2State(currentModel);
  }

  useEffect(() => {
    changingModels();
  }, [currentModel]);

  useFrame((state, delta) => {
    const { gl, clock } = state;
    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    if (startTimeRef.current === 0) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current;
    const progress = curve.evaluate(Math.min(elapsed / duration, 1));

    if (progress >= 1) {
      changeModel1State(model2State);
    }

    points.current.material.uniforms.uPositions.value = renderTarget.texture;
    points.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    fboMeshShaderRef.current.uniforms.uTransitionProgress.value = progress;
    points.current.material.uniforms.uTransitionProgress.value = progress;
  });

  return (
    <>
      {createPortal(
        <mesh>
          <fBOMeshShader
            ref={fboMeshShaderRef}
            key={FBOMeshShader.key}
            positionsA={modelTextures[model1State]}
            positionsB={modelTextures[model2State]}
          />

          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points} position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aRandom"
            count={randomnessArray.length / 3}
            array={randomnessArray}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsShader
          key={PointsShader.key}
          depthWrite={false}
          uModel1={modelIndex[model1State]}
          uModel2={modelIndex[model2State]}
        />
      </points>
    </>
  );
}
