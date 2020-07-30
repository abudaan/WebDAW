import { Track } from "./Track";
import { MIDIEvent } from "./MIDIEvent";
import { MIDINote } from "./MIDINote";
export interface Song {
    ppq: number;
    latency: number;
    bufferTime: number;
    initialTempo: number;
    tracks: Track[];
    tracksById: {
        [id: string]: Track;
    };
    events: MIDIEvent[];
    notes: MIDINote[];
    durationTicks?: number;
    durationMillis?: number;
    numBars?: number;
    initialNumerator?: number;
    initialDenominator?: number;
    repeats?: number[][];
    scheduler: {
        timestamp: number;
        index: number;
        scheduled: MIDIEvent[];
    };
    positionMillis: number;
}
