import { readFileSync } from "fs"
import { parseMidi } from "midi-file"
import { join } from "path"
import { convertMidiToChords } from "./parser"

const midiBuffer = readFileSync(join(__dirname, "../data/length_test.mid"))

const midi = parseMidi(midiBuffer)

const chords = convertMidiToChords(midi)

console.log(chords)