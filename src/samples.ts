import { audioCtx } from './audio-context';

// Extend TypeScript's built-in obsolete AudioContext definition
interface FixedAudioContext extends AudioContext {
  decodeAudioData(buf: ArrayBuffer): Promise<AudioBuffer>
}

const SAMPLE_URLS = {
  'tight-synth-bass': require('./soundfonts/tight-synth-bass-velocities-mono.mp3'),
  'piano-high': require('./soundfonts/piano-high-velocities.mp3'),
  'piano-low': require('./soundfonts/piano-low-velocities.mp3'),
  'piano-glass': require('./soundfonts/piano-glass-velocities.mp3'),
  'voice-micah': require('./soundfonts/voice-micah-velocities.mp3'),
  'convolution': require('./samples/minster1_000_ortf_48k.wav')
};


export const samples: Map<string, AudioBuffer>
  = new Map<string, AudioBuffer>();

export const samplesLoaded = Promise.all(
  Object.keys(SAMPLE_URLS)
    .map(key => loadSample(key, SAMPLE_URLS[key]))
).then(() => true);


function loadSample(key: string, url: string) {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(arrayBuffer => (<FixedAudioContext>audioCtx).decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      samples.set(key, audioBuffer);
    });
}
