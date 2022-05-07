import { MidiData } from "midi-file"
import { Chord, midiNoteToName, processChord } from "./notes"

type MidiSimpleData = {
    ticksPerBeat: number,
    length: number,
    notes: {
        note: number,
        start: number,
        end: number,
        closed: boolean
    }[]
}

type RawChord = {
    start: number,
    length: number,
    notes: number[]
}

type NamedChord = {
    start: number,
    length: number,
    chord: Chord
}

function simplifyMidiData(midi: MidiData) {
    const data: MidiSimpleData = {
        ticksPerBeat: midi.header.ticksPerBeat ?? 96,
        length: 0,
        notes: []
    }

    midi.tracks.forEach(track => {
        let time = 0

        track.forEach(event => {
            time += event.deltaTime

            if (event.type === "noteOn") {
                data.notes.push({
                    note: event.noteNumber,
                    start: time,
                    end: 0,
                    closed: false
                })
            } else if (event.type === "noteOff") {
                const note = data.notes.find(
                    note => note.note === event.noteNumber && !note.closed
                )
                if (note) {
                    note.end = time
                    note.closed = true
                }
            } else if (event.type === "endOfTrack") {
                data.length = Math.max(data.length, time)
            }
        })
    })

    return data
}

function collectChords(data: MidiSimpleData) {
    const chords: RawChord[] = []

    data.notes.forEach(note => {
        const start = Math.floor(note.start / data.ticksPerBeat)
        const length = Math.floor((note.end - note.start) / data.ticksPerBeat)

        const chord = chords.find(
            chord => chord.start === start && chord.length === length
        )

        if (chord) {
            chord.notes.push(note.note)
        } else {
            chords.push({
                start, length, notes: [note.note]
            })
        }
    })

    return chords
}

function nameChords(chords: RawChord[]): NamedChord[] {
    return chords.map(chord => ({
        start: chord.start,
        length: chord.length,
        chord: processChord(chord.notes)
    }))
}

export function convertMidiToChords(midi: MidiData) {
    const state = simplifyMidiData(midi)
    const chords = collectChords(state)
    const namedChords = nameChords(chords)

    return {
        // TODO: scale detection
        scale: "",
        chords: namedChords
    }
}
