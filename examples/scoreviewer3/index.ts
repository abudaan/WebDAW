import "./style/index.styl";
import { getVersion } from "webdaw-modules";
import { store } from "./store";
import { setup as setupSong } from "./songWrapper";
import { setup as setupScore } from "./scoreWrapper";
import { setup as setupControls } from "./controls";
import { setup as setupPlayhead } from "./playhead";
import { setup as setupDrawLoop } from "./drawLoop";
import { setup as setupDebugAnchor } from "./debug_anchors";
import { setup as setupFollowScore } from "./followScore";
import { setup as setupDrawSelection, startSelect } from "./drawSelection";
import { setup as setupSparklingNotes } from "./sparklingNotes";
import { compareScoreAndMIDI } from "./compareScoreAndMIDI";
import { setPlayheadFromPointer } from "./actions/setPlayheadFromPointer";

const scoreDiv = document.getElementById("score") as HTMLDivElement;
const loadingDiv = document.getElementById("loading");

if (scoreDiv === null || loadingDiv === null) {
  throw new Error("element not found");
}

console.log(`WebDAW: ${getVersion()}`);

let raqId: number;
let updateSparklingNotes: () => void;

const loop = () => {
  // you can do something else here if necessary
  updateSparklingNotes();
  raqId = requestAnimationFrame(loop);
};

const init = async () => {
  await setupSong();
  await setupScore(scoreDiv);
  setupControls();
  setupPlayhead();
  setupDrawLoop();
  setupDrawSelection();
  setupFollowScore(); // makes the score scroll together with the playhead
  // setupDebugAnchor();
  // compareScoreAndMIDI();
  ({ update: updateSparklingNotes } = setupSparklingNotes());

  window.addEventListener("resize", () => {
    store.setState({ width: window.innerWidth });
  });

  window.addEventListener("scroll", () => {
    store.setState({ scrollPos: { y: window.scrollY, x: window.scrollX } });
  });

  document.addEventListener("keydown", (e) => {
    // console.log(e.code);
    if (e.code === "Enter") {
      store.setState({ songState: "play" });
    } else if (e.code === "Space") {
      e.preventDefault();
      store.getState().toggleSongState();
    } else if (e.code === "Numpad0") {
      store.setState({ songState: "stop" });
    }
  });

  scoreDiv.addEventListener("mousedown", (e) => {
    if (e.altKey) {
      startSelect(e);
    } else {
      setPlayheadFromPointer(e as PointerEvent);
    }
  });

  // main loop during playback
  store.subscribe(
    (songState) => {
      if (songState === "play") {
        raqId = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raqId);
      }
    },
    (state) => state.songState
  );

  loadingDiv.style.display = "none";
  store.setState({ loaded: true });
};

init();
