import { useGLTF } from "@react-three/drei";
import FBOMesh from "./FBOMesh/FBOMesh";

export default function Scene({ currentModel }) {
  return <FBOMesh currentModel={currentModel} />
}
