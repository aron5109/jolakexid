/**
 * Tiny Web Audio sound design: a crisp biscuit crack and a faint golden shimmer.
 * Nothing is loaded from the network and nothing plays unless the visitor turns sound on.
 */
type AudioContextCtor = typeof AudioContext;

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor: AudioContextCtor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    context ??= new Ctor();
    if (context.state === 'suspended') void context.resume();
    return context;
  } catch {
    return null;
  }
}

/** Call from a user gesture so browsers allow audio later. */
export function unlockAudio(): void {
  getContext();
}

function noiseBurst(ctx: AudioContext, start: number, duration: number, frequency: number, gain: number) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const decay = Math.pow(1 - i / length, 3);
    data[i] = (Math.random() * 2 - 1) * decay;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = frequency;
  filter.Q.value = 0.9;
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(gain, start);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter).connect(amp).connect(ctx.destination);
  source.start(start);
  source.stop(start + duration + 0.02);
}

export function playCrack(): void {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime + 0.01;
  noiseBurst(ctx, t, 0.07, 2600, 0.35);
  noiseBurst(ctx, t + 0.045, 0.12, 1500, 0.28);
  noiseBurst(ctx, t + 0.11, 0.05, 3400, 0.12);
}

export function playShimmer(): void {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime + 0.01;
  [1567.98, 2093, 2637].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const amp = ctx.createGain();
    const start = t + i * 0.07;
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.exponentialRampToValueAtTime(0.04, start + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
    osc.connect(amp).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 1);
  });
}
