import { useRef, useState } from "react";

export default function Info() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogEl = useRef(null);
  return (
    <>
      <button className="info__btn" onClick={() => dialogEl.current.showModal()}>Info</button>
      <dialog ref={dialogEl}>
        <h2>3D Models:</h2>
        <p><a href="https://sketchfab.com/3d-models/takashi-murakami-flower-8db0a11ec13048389f5e6a86e73f6c3d" target="_blank">"Takashi Murakami Flower"</a> by Tiko</p>
        <p><a href="https://sketchfab.com/3d-models/neon-signs-307e887d740649f88fbc77b061f3a742" target="_blank">"Neon Signs"</a> by Shalmon</p>
        <p><a href="https://sketchfab.com/3d-models/sculptjanuary18-day-26-dragon-c692ae64116d4f2b9d703171518443aa" target="_blank">"#SculptJanuary18 - Day 26: Dragon "</a> by beagleknight</p>
        <form method="dialog">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
}
