// Temporary no-op audio. Replaced by the Web Audio chiptune engine in Milestone 5.
export function createAudio() {
  return { unlock() {}, playStage() {}, stop() {}, sfx() {}, setMuted() {} };
}
