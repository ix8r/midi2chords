type Note = "C" | "C#"| "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B"

type ChordType = "maj" | "min" | "dim"
type ChordInversion = "" | "inv1" | "inv2"

export type Chord = `${Note}${ChordType}${ChordInversion}`

const noteNames = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
]

const notesToChords: {
    [key: string]: Chord
} = {}

generateNoteToChordMappings()

function registerNoteToChordMapping(indices: number[], chord: Chord) {
    const notes = indices.map(i => noteNames[i % 12])

    notesToChords[notes.join("")] = chord
}

function generateNoteToChordMappings() {
    noteNames.forEach((root, i) => {
        registerNoteToChordMapping([i, i + 4, i + 7], `${root}maj` as Chord)
        registerNoteToChordMapping([i + 4, i + 7, i], `${root}majinv1` as Chord)
        registerNoteToChordMapping([i + 7, i, i + 4], `${root}majinv2` as Chord)

        registerNoteToChordMapping([i, i + 3, i + 7], `${root}min` as Chord)
        registerNoteToChordMapping([i + 3, i + 7, i], `${root}mininv1` as Chord)
        registerNoteToChordMapping([i + 7, i, i + 3], `${root}mininv2` as Chord)

        registerNoteToChordMapping([i, i + 3, i + 6], `${root}dim` as Chord)
    })
}

export function midiNoteToName(note: number) {
    const index = (note - 24) % 12

    return noteNames[index]
}

export function processChord(notes: number[]) {
    const names = notes.sort((n1, n2) => n1 - n2).map(note => midiNoteToName(note))

    return notesToChords[names.join("")]
}