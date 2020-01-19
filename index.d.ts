// Type definitions for webdaw-modules 1.0
// Project: webdaw.org
// Definitions by: abudaan <https://webdaw.org>

/// <reference types="webmidi" />


// start playing at position (in milliseconds)
declare function play(p: Playable, position: number): void;

declare function pause(p: Playable): void;

declare function stop(p: Playable): void;


export interface Playable {
  events: MIDIEvent[]
  notes: MIDINote[]
  ppq: number
  bpm: number
}

export interface Song extends Playable {
  useMetronome: boolean
  loop: boolean
  loops: {
    start: number
    end: number
  }[],
}

export interface Track extends Playable {
  output?: string
  instrument?: string
}

export interface MIDIEvent extends WebMidi.MIDIMessageEvent {
  data1: number
  data2: number
  command: number
  channel: number
  ticks: number
  time: number // the time in seconds that this event is scheduled
}

export interface NoteEvent extends MIDIEvent {
  frequency: number
  noteNumber: number
  noteName: number
  octave: number
}

export interface NoteOnEvent extends NoteEvent {
}

export interface NoteOffEvent extends NoteEvent {
}

export type MIDINote = {
  noteOn: NoteOnEvent
  noteOff?: NoteOffEvent
  endless: boolean // necessary for recording MIDI
}

export type AudioEvent = {
  sample: string
  data: ArrayBuffer
  start: number
  end: number
  volume: number
}