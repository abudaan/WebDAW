/// <reference types="webmidi" />

export module Heartbeat {
  export interface SongPosition {
    bar?: number;
    beat?: number;
    sixteenth?: number;
    tick?: number;
    ticks: number;
    timestamp: number;
    barsAsString: string;
    activeColumn: number;
    millis: number;
  }

  export type Listener = {
    [key: string]: any;
  };

  export interface Song {
    ppq: number;
    nominator: number;
    denominator: number;
    beat: number;
    sixteenth: number;
    tick: number;
    ticks: number;
    percentage: number;
    activeNotes: MIDIEvent[];
    id: string;
    name: string;
    loop: boolean;
    bpm: number;
    durationTicks: number;
    durationMillis: number;
    millisPerTick: number;
    millis: number;
    parts: Part[];
    tracks: Track[];
    listeners: Listener;
    loopEndPosition: SongPosition;
    bars: number; // number of bars in Song
    bar: number; // current bar position
    barsAsString: string; // current position in bars
    events: Array<MIDIEvent>;
    timeEvents: Array<MIDIEvent>;
    notes: Array<MIDINote>;
    useMetronome: boolean;
    keyEditor: KeyEditor;
    play: () => void;
    pause: () => void;
    stop: () => void;
    update: (updateTimeEvents?: boolean) => void;
    setTempo: (bpm: number, update?: boolean) => void;
    addEventListener: (event: string, typeOrCallback: any, callback?: (arg?: any) => void) => void;
    addMidiEventListener: (event: string, callback: (arg?: any) => void) => void;
    removeEventListener: (type: string) => void;
    setLoop: (loop?: boolean) => void;
    setLeftLocator: (type: string, bar: number, beat?: number, sixteenth?: number, tick?: number) => void;
    setRightLocator: (type: string, bar: number, beat?: number, sixteenth?: number, tick?: number) => void;
    addEvents: (events: Array<MIDIEvent>) => void;
    addTimeEvents: (events: Array<MIDIEvent>) => void;
    removeTimeEvents: () => void;
    setTrackSolo: (t: Track, f: boolean) => void;
    getPosition: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => SongPosition;
    addTrack: (t: Track) => void;
    setVolume: (val: any) => void;
    paused: boolean;
    playing: boolean;
    setPlayhead: (type: string, value: number) => void;
    playhead: Playhead;
  }

  export interface Playhead {
    data: {
      timeAsString: string;
      barsAsString: string;
      millis: number;
    };
    activeNotes: MIDINote[];
  }

  export type MIDIEvent = {
    id: string;
    bar: number;
    type: number;
    data1: number;
    data2: number;
    ticks: number;
    millis: number;
    command: number;
    noteName: string;
    noteNumber: number;
    velocity: number;
    midiNote: MIDINote;
    muted: boolean;
    song: null | Song;
    track: null | Track;
    trackId: string;
    part: null | Part;
    clone: () => MIDIEvent;
    transpose: (semi: number) => void;
    active?: boolean;
  };

  export type Note = {
    name: string;
    octave: number;
    fullName: string;
    number: number;
    frequency: number;
    blackKey: boolean;
  };

  // export interface MIDINote extends MIDIEvent {
  export type MIDINote = {
    id: string;
    bar: number;
    type: number;
    data1: number;
    data2: number;
    ticks: number;
    command: number;
    noteName: string;
    noteNumber: number;
    velocity: number;
    midiNote: MIDINote;
    muted: boolean;
    song: null | Song;
    track: null | Track;
    trackId: string;
    part: null | Part;
    clone: () => MIDINote;
    transpose: (semi: number) => void;
    number: number;
    noteOn: MIDIEvent;
    noteOff: MIDIEvent;
    durationTicks: number;
    note: Note;
    mute: (flag: boolean) => void;
    active?: boolean;
  };

  export type Part = {
    id: string;
    name: string;
    events: Array<MIDIEvent>;
    needsUpdate: boolean;
    eventsById: { [id: string]: MIDIEvent };
    addEvents: (events: Array<MIDIEvent | AudioEvent>) => void;
    removeEvents: (events: Array<MIDIEvent>, part?: Part) => void;
    transposeAllEvents: (semi: number) => void;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };

  export type Track = {
    id: string;
    name: string;
    parts: Part[];
    events: MIDIEvent[];
    needsUpdate: boolean;
    partsById: { [id: string]: Part };
    audioLatency: number;
    monitor: boolean;
    mute: boolean;
    notes: MIDINote[];
    addPart: (part: Part) => void;
    addPartAt: (part: Part, type: [string, number]) => void;
    removeEvents: (events: Array<MIDIEvent>) => void;
    removeAllEvents: () => void;
    processMidiEvent: (event: MIDIEvent | Array<MIDIEvent>) => void;
    setMidiInput: (id: string, flag: boolean) => void;
    setMidiOutput: (id: string, flag: boolean) => void;
    setInstrument: (id: string) => void;
    removePart: (part: Part) => void;
    update: () => void;
  };

  export type InstrumentMapping = {
    [id: string]: {
      [id: string]: string;
    };
  };

  export interface Instrument {
    name: string;
    mapping: InstrumentMapping;
  }

  export interface AssetPack {
    instruments: Array<Instrument>;
    midifiles: Array<string>;
  }

  export interface MIDIPortsObject {
    [id: string]: WebMidi.MIDIPort;
  }

  export interface MIDIFileJSON {
    id: string;
    url: string;
    name: string;
    ppq: number;
    bpm: number;
    nominator: number;
    denominator: number;
    tracks: Track[];
    timeEvents: Array<MIDIEvent>;
  }

  export type MIDIFileDataTrack = {
    name: string;
    events: Array<MIDIEvent>;
  };

  export type MIDIFileData = {
    ppq: number;
    bpm: number;
    nominator: number;
    denominator: number;
    name: string;
    timeEvents: Array<MIDIEvent>;
    tracks: Array<MIDIFileDataTrack>;
  };

  // config file that gets loaded when the app starts
  export interface Config {
    midiFiles: Array<string>;
    assetPacks: Array<string>;
    instruments: Array<string>;
    tempoMin: number;
    tempoMax: number;
    granularity: number;
    granularityOptions: Array<number>;
  }

  export interface SongInfo {
    tracks: Array<any>;
    bars: number;
    ppq: number;
    nominator: number;
    denominator: number;
  }

  // export type MIDIPort = {
  //   id: string
  //   connection: string
  //   manufacturer: string
  //   name: string
  //   state: string
  //   type: string
  //   verions: string
  //   onstatechange: () => void
  //   addEventListener: (type: string, callback: (m: WebMidi.MIDIMessageEvent) => void) => void
  //   removeEventListener: (type: string, callback: (m: WebMidi.MIDIMessageEvent) => void) => void
  // }

  export type LineData = {
    x: number;
    y: number;
    bar: number;
    beat: number;
    sixteenth: number;
    type: string;
  };

  export type KeyEditor = {
    xToTicks: (x: number) => number;
    ticksToX: (ticks: number) => number;
    yToPitch: (y: number) => MIDINote;
    pitchToY: (noteNumber: number) => number;
    setPlayheadToX: (x: number) => void;
    getPlayheadX: () => number;
    setBarsPerPage: (bbp: number) => void;
    startMovePart: (part: Part, x: number, y: number) => void;
    stopMovePart: () => void;
    movePart: (x: number, y: number, updateSong?: boolean) => void;
    setViewport: (width: number, height: number) => void;
    setSnapX: (snap: number) => void;
    verticalLine: {
      next: (type: string) => LineData;
      hasNext: (type: string) => LineData;
      reset: () => void;
    };
    horizonalLine: {
      next: (type: string) => LineData;
      hasNext: (type: string) => LineData;
      reset: () => void;
    };
    selectedPart: Part;
    song: Song;
    getSnapshot: (id: string) => SnapShot;
  };

  export type SnapShot = {
    events: {
      active: MIDIEvent[];
      inActive: MIDIEvent[];
      recorded: MIDIEvent[];
      new: MIDIEvent[];
      changed: MIDIEvent[];
      removed: MIDIEvent[];
      stateChanged: MIDIEvent[];
    };

    notes: {
      active: MIDINote[];
      inActive: MIDINote[];
      recorded: MIDINote[];
      new: MIDINote[];
      changed: MIDINote[];
      removed: MIDINote[];
      stateChanged: MIDINote[];
    };

    parts: {
      active: Part[];
      inActive: Part[];
      recorded: Part[];
      new: Part[];
      changed: Part[];
      removed: Part[];
      stateChanged: Part[];
    };

    // activeEvents: { [id: string]: MIDIEvent },
    // activeNotes: { [id: string]: MIDINote },
    // activeParts: { [id: string]: Part },
  };

  export type AudioEvent = {
    buffer?: AudioBuffer;
    path?: string;
  };

  export type Sequencer = {
    createSong(config: any): Heartbeat.Song;
    createTrack(name: string): Heartbeat.Track;
    createPart(name?: string): Heartbeat.Part;
    createKeyEditor(song: Heartbeat.Song, config: any): Heartbeat.KeyEditor;
    getMidiFiles(): Heartbeat.MIDIFileJSON[];
    getAudioContext(): AudioContext;
    getMasterGainNode(): GainNode;
    createAudioEvent(config: any): Heartbeat.AudioEvent;
    addMidiFile(args: { url?: string; arraybuffer?: ArrayBuffer }, callback: (mf: Heartbeat.MIDIFileJSON) => void): void;
    createMidiFile(args: any): any;
    addAssetPack(ap: Heartbeat.AssetPack, callback: () => void): void;
    getInstruments(): Heartbeat.Instrument[];
    ready(): Promise<boolean>;
    getNoteNumber(step: string, octave: number): number;
    createMidiEvent(ticks: number, type: number, data1: number, data2?: number): Heartbeat.MIDIEvent;
    processEvent(event: Heartbeat.MIDIEvent, instrument: string): void;
    processEvent(event: Heartbeat.MIDIEvent[], instrument: string): void;
    stopProcessEvents(): void;
    getMidiFile(id: string): Heartbeat.MIDIFileJSON;
    getSnapshot(song: Heartbeat.Song, id?: string): Heartbeat.SnapShot;
    browser: string;
    midiInputs: WebMidi.MIDIInput[];
    midiOutputs: WebMidi.MIDIOutput[];
  };
}

export function createSong(config: any): Heartbeat.Song;
export function createTrack(name: string): Heartbeat.Track;
export function createPart(name?: string): Heartbeat.Part;
export function createKeyEditor(song: Heartbeat.Song, config: any): Heartbeat.KeyEditor;
export function getMidiFiles(): Heartbeat.MIDIFileJSON[];
export function getAudioContext(): AudioContext;
export function getMasterGainNode(): GainNode;
export function createAudioEvent(config: any): Heartbeat.AudioEvent;
export function addMidiFile(args: { url?: string; arraybuffer?: ArrayBuffer }, callback: (mf: Heartbeat.MIDIFileJSON) => void): void;
export function createMidiFile(args: any): any;
export function addAssetPack(ap: Heartbeat.AssetPack, callback: () => void): void;
export function getInstruments(): Heartbeat.Instrument[];
export function ready(): Promise<boolean>;
export function getNoteNumber(step: string, octave: number): number;
export function createMidiEvent(ticks: number, type: number, data1: number, data2?: number): Heartbeat.MIDIEvent;
export function processEvent(event: Heartbeat.MIDIEvent, instrument: string): void;
export function processEvent(event: Heartbeat.MIDIEvent[], instrument: string): void;
export function stopProcessEvents(): void;
export function getMidiFile(id: string): Heartbeat.MIDIFileJSON;
export function getSnapshot(song: Heartbeat.Song, id?: string): Heartbeat.SnapShot;
export const browser: string;
export const midiInputs: WebMidi.MIDIInput[];
export const midiOutputs: WebMidi.MIDIOutput[];

export default sequencer;
export declare var sequencer: Heartbeat.Sequencer;
