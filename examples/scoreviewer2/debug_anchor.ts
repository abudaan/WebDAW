import { AnchorData } from "../../publish/src";
import { store } from "./store";

export const setup = () => {
  const divContainer = document.getElementById("controls") as HTMLDivElement;
  const divAnchor = document.createElement("div");
  divAnchor.style.position = "absolute";
  divContainer.appendChild(divAnchor);
  const divAnchor2 = document.createElement("div");
  divAnchor2.style.position = "absolute";
  divContainer.appendChild(divAnchor2);

  let offsetX: number = 0;
  let offsetY: number = 0;

  const unsub1 = store.subscribe(
    (anchor: AnchorData | null) => {
      if (anchor !== null) {
        ({
          offset: { x: offsetX, y: offsetY },
        } = store.getState());
      }
    },
    (state) => state.currentPlayheadAnchor
  );

  const unsub2 = store.subscribe(
    (anchor: AnchorData | null) => {
      if (anchor !== null) {
        divAnchor.style.left = `${anchor.bbox.x + offsetX}px`;
        divAnchor.style.top = `${anchor.bbox.y + offsetY}px`;
        divAnchor.style.width = `${anchor.bbox.width}px`;
        divAnchor.style.height = `${anchor.bbox.height}px`;
        divAnchor.style.background = "rgba(0,255,0,0.5)";
      }
      const { nextPlayheadAnchor } = store.getState();
      if (nextPlayheadAnchor !== null) {
        divAnchor2.style.left = `${nextPlayheadAnchor.bbox.x + offsetX}px`;
        divAnchor2.style.top = `${nextPlayheadAnchor.bbox.y + offsetY}px`;
        divAnchor2.style.width = `${nextPlayheadAnchor.bbox.width}px`;
        divAnchor2.style.height = `${nextPlayheadAnchor.bbox.height}px`;
        divAnchor2.style.background = "rgba(0,100,255,0.5)";
      }
    },
    (state) => state.currentPlayheadAnchor
  );

  return {
    cleanup: () => {
      unsub1();
      unsub2();
    },
  };
};
