// Procedural sound effects via the Web Audio API — no audio files.
let ctx = null;

function getContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function playBell() {
  const audioCtx = getContext();
  [880, 1100].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = audioCtx.currentTime + i * 0.18;
    gain.gain.setValueAtTime(i === 0 ? 0.32 : 0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    osc.start(t);
    osc.stop(t + 1.1);
  });
}

export function playTimerDone() {
  const audioCtx = getContext();
  [880, 1047, 1319].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = audioCtx.currentTime + i * 0.22;
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    osc.start(t);
    osc.stop(t + 0.7);
  });
}

export function playPurr() {
  const audioCtx = getContext();
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc1.type = "sawtooth";
  osc1.frequency.value = 35;
  osc2.type = "sine";
  osc2.frequency.value = 110;

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);

  const t = audioCtx.currentTime;
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.11, t + 0.12);
  gain.gain.setValueAtTime(0.11, t + 0.85);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

  osc1.start(t);
  osc2.start(t);
  osc1.stop(t + 1.2);
  osc2.stop(t + 1.2);
}
