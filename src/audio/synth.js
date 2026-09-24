export class GameAudio {
  constructor() {
    this.enabled = true;
    this.context = null;
    this.master = null;
  }

  ensure() {
    if (!this.enabled) return null;
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.18;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') this.context.resume();
    return this.context;
  }

  setEnabled(value) {
    this.enabled = value;
    if (this.master) this.master.gain.value = value ? 0.18 : 0;
  }

  tone(frequency, duration = 0.12, type = 'sine', volume = 0.2, delay = 0) {
    const context = this.ensure();
    if (!context) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  click() {
    this.tone(540, 0.07, 'triangle', 0.09);
  }

  hover() {
    this.tone(730, 0.045, 'sine', 0.035);
  }

  dice() {
    this.tone(180, 0.08, 'square', 0.09, 0);
    this.tone(260, 0.08, 'square', 0.08, 0.07);
    this.tone(360, 0.16, 'triangle', 0.12, 0.14);
  }

  coin() {
    this.tone(880, 0.08, 'sine', 0.14);
    this.tone(1320, 0.16, 'sine', 0.11, 0.06);
  }

  buy() {
    [392, 523, 659].forEach((note, index) => this.tone(note, 0.18, 'triangle', 0.1, index * 0.07));
  }

  bad() {
    this.tone(190, 0.18, 'sawtooth', 0.08);
    this.tone(140, 0.28, 'sawtooth', 0.07, 0.08);
  }

  win() {
    [523, 659, 784, 1047, 1319].forEach((note, index) => this.tone(note, 0.28, 'triangle', 0.12, index * 0.1));
  }

  jail() {
    this.tone(150, 0.1, 'square', 0.08);
    this.tone(120, 0.22, 'square', 0.08, 0.12);
  }
}
