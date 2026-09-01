export class Sound {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.isSoundOn = true;
        this.isSoundInitialized = false;

        this.noteCount = [0, 0];
    }

    muteMusic() {
        this.isSoundOn = !this.isSoundOn;
    }

    initSound() {
        this.isSoundInitialized = true;
        this.ctx.resume();
        this.musicInternval = setInterval(() => this.playMusic(), 60000 / 240);
    }

    clickSound() {
        this.playSound("triangle", 174.6, 0.2, 0, 0.2);
    }

    moveSound() {
        this.playSound("triangle", 110, 0.2, 0, 0.1);
    }

    wrongSound() {
        this.playSound("square", 32.70, 0.12, 0, 0.1);
        this.playSound("square", 16.35, 0.25, 0.1, 0.2);
    }

    paySound() {
        this.playSound("square", 932.3, 0.1, 0, 0.1);
        this.playSound("square", 1865, 0.1, 0.1, 0.2);
    }

    gameOverSound() {
        this.playSound("square", 32.70, 0.3, 0, 0.1);
        this.playSound("square", 36.71, 0.2, 0.1, 0.2);
        this.playSound("square", 16.35, 0.3, 0.2, 0.1);
    }

    playSound(type, value, volume, start, end) {
        if (this.isSoundOn && this.isSoundInitialized) {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();

            o.type = type;
            o.frequency.value = value;

            g.gain.setValueAtTime(volume, this.ctx.currentTime + start);
            g.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + start + end);

            o.connect(g);
            g.connect(this.ctx.destination);
            o.start(this.ctx.currentTime + start);
            o.stop(this.ctx.currentTime + start + end);
        }
    }

    playMusic() {
        if (this.isSoundOn && this.isSoundInitialized && this.ctx.state == "running") {
            this.playSound("sine", mB[this.noteCount[0]], 0.3, 0, 0.8);
            this.updateNoteCount(0, mB);

            this.playSound("triangle", mR[this.noteCount[1]], 0.3, 0, 0.2);
            this.updateNoteCount(1, mR);
        }
    }

    updateNoteCount(pos, melodyArray) {
        this.noteCount[pos]++;
        if (this.noteCount[pos] >= melodyArray.length) this.noteCount[pos] = 0;
    }
}

const mB = [
    69.3, null, null, 69.3, 103.83, null, null, 92.5,
    null, null, null, 92.5, 69.3, null, 41.2, 46.25,
    61.74, null, null, 61.74, 92.5, null, null, 82.41,
    null, null, null, 82.41, 82.41, null, 61.74, 65.41,
];

const mR = [
    164.81, null, 164.81, null, null, 164.81, null, 138.59,
    null, 138.59, null, null, 138.59, null, 138.59, null,
    116.54, null, 116.54, null, null, 116.54, null, 103.83,
    null, 103.83, null, null, 103.83, null, 103.83, null,
];