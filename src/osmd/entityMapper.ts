import {
  OpenSheetMusicDisplay,
  GraphicalVoiceEntry,
  GraphicalMeasure,
} from "opensheetmusicdisplay";
import { OSMDEntityData } from "./getEntities";
import { getRandomColor, match, setAttibuteSVGElement } from "./util";

const ppq = 960;

export const entityMapper = (osmd: OpenSheetMusicDisplay, entityData: OSMDEntityData[]) => {
  const svgDoc = document.getElementById("osmdSvgPage1");
  if (svgDoc === null) {
    return;
  }
  const container = document.createElement("div");
  document.body.appendChild(container);
  const notes = document.querySelectorAll(".vf-notehead");
  const tabs = document.querySelectorAll(".vf-tabnote");
  const elementData: [SVGElement, DOMRect][] = [];
  notes.forEach(note => {
    const elem = note as SVGElement;
    const bbox = elem.getBoundingClientRect();
    elementData.push([elem, bbox]);
    elem.addEventListener("click", e => {
      console.log("CLICK");
    });
  });
  tabs.forEach(tab => {
    const elem = tab as SVGElement;
    const bbox = elem.getBoundingClientRect();
    elementData.push([elem, bbox]);
    elem.addEventListener("click", e => {
      console.log("CLICK");
    });
  });

  let j = 0;
  let matches = 0;
  for (let i = 0; i < entityData.length; i++) {
    const data = entityData[i];
    // console.log(data);
    for (let j = 0; j < elementData.length; j++) {
      const [elem, box] = elementData[j];
      // console.log(data.x, data.y, box.x, box.y);
      if (match(box.x, data.staves[0].x, 2)) {
        // && match(box.y, data.y, 2)) {
        matches++;
        const div = document.createElement("div");
        div.innerHTML = `${j}`;
        div.style.position = "absolute";
        // div.style.backgroundColor = getRandomColor(0.6);
        div.style.border = "1px dotted red";
        div.style.boxSizing = "border-box";

        div.style.width = `${15}px`;
        div.style.height = `${15}px`;
        div.style.left = `${box.x}px`;
        div.style.top = `${box.y}px`;
        container.appendChild(div);

        setAttibuteSVGElement(elem, "path", "opacity", "0");
        setAttibuteSVGElement(elem, "text", "opacity", "0");
        elem.addEventListener("click", e => {
          // console.log("MATCH", data.noteNumber, data.ticks);
        });
      }
    }
  }
  // console.log(matches, filtered.length);
};
