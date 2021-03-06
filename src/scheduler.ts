import { Song } from "./createSong";
import { MIDIEvent, NoteOnEvent } from "./MIDIEvent";
import { NOTE_ON, NOTE_OFF } from "./util/midi";

type Args = {
  song: Song;
  millis: number;
  index: number;
  outputs?: WebMidi.MIDIOutputMap;
};
export const schedule = ({
  song,
  index,
  millis,
  outputs,
}: Args): { millis: number; index: number; scheduled: MIDIEvent[] } => {
  const ts = performance.now();
  const { events } = song;
  const scheduled = [];
  // let lastNoteNumber: number = -1;
  // let lastNoteType: number = -1;
  while (index < events.length) {
    const event = events[index];
    if (!event.millis || !event.trackId) {
      // break;
      index++;
    } else if (event.millis < millis + song.bufferTime) {
      scheduled.push(event);
      // console.log(event.ticks, event.descr, (event as NoteOnEvent).noteNumber);
      const track = song.tracksById[event.trackId];
      track.outputs.forEach(id => {
        if (event.descr === NOTE_ON || event.descr === NOTE_OFF) {
          const e = event as NoteOnEvent;
          if (event.millis) {
            // console.log(event.type, event.channel, event.noteNumber);
            let time = ts + song.latency + track.latency + (event.millis - millis);
            // console.log(event["noteNumber"], event.descr, event.millis, millis, time, ts, time - ts);
            // console.log(e.noteNumber, lastNoteNumber, lastNoteType);
            // if (e.noteNumber === lastNoteNumber && lastNoteType === 0x90) {
            //   if (e.descr === NOTE_ON) {
            //     console.log("repeating notes");
            //     time += 1;
            //   }
            // }
            // lastNoteNumber = e.noteNumber;
            // lastNoteType = e.type;
            // console.log(event.type + event.channel, event.noteNumber, event.velocity);
            // quick fix for repeating notes
            if (e.descr === NOTE_ON) {
              time += 1;
            }
            outputs
              ?.get(id)
              ?.send([event.type + event.channel, event.noteNumber, event.velocity], time);
          }
        }
      });
      index++;
    } else {
      break;
    }
  }
  // console.log('[SCHEDULED]', scheduled.map(e => [e.ticks, e.millis]));
  return { millis, index, scheduled };
};
