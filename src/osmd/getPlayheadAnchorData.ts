import { OpenSheetMusicDisplay, SourceMeasure } from "opensheetmusicdisplay";
import { getBoundingBoxData } from "./mapper3";
import { PartData, RepeatData } from "../musicxml/parser";
import { BBox } from "../types";
import { getBoundingBoxMeasureAll } from "./getBoundingBoxMeasure";

export const getTicksAtBar = (parts: PartData[]) => {
  parts.forEach(data => {
    let bar = 0;
    data.events.reduce((acc, val) => {
      if (val.bar && val.bar !== bar) {
        bar = val.bar;
        // console.log(bar, val.ticks);
      }
      return bar;
    }, 0);
  });
};

export type AnchorData = {
  measureNumber: number;
  startTicks: number;
  endTicks: number;
  bbox: BBox;
  bboxMeasure: BBox;
  yPos: number;
  numPixels: number;
  numTicks: number;
  pixelsPerTick: number;
  ghost: boolean;
};

export const getPlayheadAnchorData = (
  osmd: OpenSheetMusicDisplay,
  repeats: RepeatData[],
  ppq: number = 960
): { anchorData: AnchorData[]; measureStartTicks: number[] } => {
  const measureBoundingBoxes = getBoundingBoxMeasureAll(osmd);
  const measureStartTicks = osmd.Sheet.SourceMeasures.map((measure: SourceMeasure) => {
    return ppq * measure.AbsoluteTimestamp.RealValue * 4;
  });
  // console.log(ppq);
  const anchorData: AnchorData[] = [];
  osmd.GraphicSheet.VerticalGraphicalStaffEntryContainers.forEach(container => {
    const realValue = container.AbsoluteTimestamp.RealValue;
    const data: AnchorData[] = [];

    container.StaffEntries.forEach(entry => {
      const measureNumber = entry.parentMeasure.MeasureNumber;
      const bboxMeasure = measureBoundingBoxes[measureNumber - 1];
      const { Numerator, Denominator } = osmd.Sheet.SourceMeasures[measureNumber - 1].ActiveTimeSignature;
      const beatTicks = ppq / (Denominator / 4);
      const runningTicks = beatTicks * Numerator * realValue;
      const yPos = (entry.parentMeasure as any).parentMusicSystem.boundingBox.absolutePosition.y * 10;

      if (typeof (entry.parentMeasure as any).multiRestElement !== "undefined") {
        const numberOfMeasures = (entry.parentMeasure as any).multiRestElement.number_of_measures;
        const diffTicks = numberOfMeasures * Numerator * beatTicks;
        const numGhostAnchors = numberOfMeasures * Numerator;
        const anchorTicks = diffTicks / numGhostAnchors;
        const anchorPixels = bboxMeasure.width / numGhostAnchors;
        let x = bboxMeasure.x;
        for (let i = 0; i < numGhostAnchors; i++) {
          data.push({
            numPixels: anchorTicks,
            startTicks: runningTicks + i * anchorTicks,
            endTicks: 0,
            numTicks: 0,
            pixelsPerTick: 0,
            measureNumber,
            bbox: {
              x: x + i * anchorPixels,
              y: bboxMeasure.y,
              width: anchorPixels,
              height: bboxMeasure.height,
            },
            bboxMeasure,
            yPos,
            ghost: true,
          });
        }
      } else {
        const bbox = getBoundingBoxData((entry as any).boundingBox);
        data.push({
          numPixels: 0,
          startTicks: runningTicks,
          endTicks: 0,
          numTicks: 0,
          pixelsPerTick: 0,
          measureNumber,
          bbox,
          // bboxMeasure: getBoundingBoxData((entry.parentMeasure as any).boundingBox),
          bboxMeasure,
          yPos,
          ghost: false,
        });
      }
    });

    data.sort((a, b) => {
      if (a.bbox.x < b.bbox.x) {
        return -1;
      }
      if (a.bbox.x > b.bbox.x) {
        return 1;
      }
      return 0;
    });
    // console.log(boxes);

    // always get the first vertical graphical staff entry
    const anchor = data[0];
    if (anchor.ghost === false) {
      anchorData.push(anchor);
    } else {
      let x;
      for (let i = 0; i < data.length; i++) {
        const tmpX = data[i].bbox.x;
        if (tmpX !== x) {
          x = tmpX;
          anchorData.push(data[i]);
        }
      }
    }
  });

  // console.log(anchorData);

  // copy anchor data for all repeats
  let diffTicks = 0;
  let diffBars = 0;
  const copies: AnchorData[] = [];
  for (let i = 0; i < repeats.length; i++) {
    const { start, end } = repeats[i];
    const minTicks = measureStartTicks[start - 1];
    const maxTicks = measureStartTicks[end];
    // console.log(min, max, minTicks, maxTicks);
    diffTicks += maxTicks - minTicks;
    diffBars += end - (start - 1);
    // console.log(min, max, minTicks, maxTicks, diffTicks);
    for (let j = 0; j < anchorData.length; j++) {
      const anchor = anchorData[j];
      if (anchor.measureNumber >= start && anchor.measureNumber <= end) {
        const clone = { ...anchor };
        clone.startTicks += diffTicks;
        clone.measureNumber += diffBars;
        copies.push(clone);
      }
    }
  }

  // console.log(copies);

  // update the ticks and measure number of the bars that come after the repeats
  const result: AnchorData[] = anchorData.map(d => {
    const { measureNumber, startTicks } = d;
    const clone = { ...d };
    let diffTicks = 0;
    let diffBars = 0;
    for (let i = 0; i < repeats.length; i++) {
      const { start, end } = repeats[i];
      console.log(start, end);
      const minTicks = measureStartTicks[start - 1];
      const maxTicks = measureStartTicks[end];
      diffTicks += maxTicks - minTicks;
      diffBars += end - (start - 1);
      if (measureNumber > end) {
        clone.startTicks = startTicks + diffTicks;
        clone.measureNumber = measureNumber + diffBars;
      }
    }
    return clone;
  });

  // result.forEach(d => {
  //   console.log(d.measureNumber, d.ticks);
  // });

  // copies.forEach(d => {
  //   console.log(d.measureNumber, d.ticks);
  // });

  result.push(...copies);
  result.sort((a, b) => {
    if (a.startTicks < b.startTicks) {
      return -1;
    }
    if (a.startTicks > b.startTicks) {
      return 1;
    }
    return 0;
  });

  result.sort((a, b) => {
    if (a.measureNumber < b.measureNumber) {
      return -1;
    }
    if (a.measureNumber > b.measureNumber) {
      return 1;
    }
    return 0;
  });

  const result1: number[] = [];
  let currentMeasureNumber = 0;
  result.forEach(r => {
    const { startTicks, measureNumber } = r;
    if (currentMeasureNumber !== measureNumber) {
      currentMeasureNumber = measureNumber;
      result1.push(startTicks);
    }
  });

  // add ticks position of the end of the last bar
  const { Numerator, Denominator } = osmd.Sheet.SourceMeasures[osmd.Sheet.SourceMeasures.length - 1].ActiveTimeSignature;
  const lastTicks = result1[result1.length - 1] + Numerator * (4 / Denominator) * 960;
  result1.push(lastTicks);

  for (let i = 0; i < result.length; i++) {
    let a1 = result[i];
    let a2 = result[i + 1];
    if (a2) {
      a1.endTicks = a2.startTicks;
      a1.numPixels = a2.bbox.x - a1.bbox.x;
      if (a2.yPos !== a1.yPos || a2.bbox.x < a1.bbox.x) {
        // a1.numPixels = a1.bbox.width
        a1.numPixels = a1.bboxMeasure.x + a1.bboxMeasure.width - a1.bbox.x;
      }
    } else {
      a1.endTicks = lastTicks;
      a1.numPixels = a1.bboxMeasure.x + a1.bboxMeasure.width - a1.bbox.x;
    }
    const diffTicks = a1.endTicks - a1.startTicks;
    a1.pixelsPerTick = a1.numPixels / (a1.endTicks - a1.startTicks);
    a1.numTicks = a1.endTicks - a1.startTicks;
  }

  // result.forEach(d => {
  //   console.log(d.measureNumber, d.ticks);
  // });

  // console.log(result);

  return { anchorData: result, measureStartTicks: result1 };
};
