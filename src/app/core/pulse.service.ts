import { Injectable, Inject, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app-state.model';
import { PULSE } from './actions';
import { TimeService } from './time.service';

const MetronomeWorker = require('worker!./metronome.worker');

@Injectable()
export class PulseService {
  private startTime: number;
  private metronome: Worker;
  private pulseCount = 1;

  constructor(@Inject('bpm') private bpm: number,
              private time: TimeService,
              private store: Store<AppState>,
              private zone: NgZone) {
  }

  onInit() {
    this.startTime = this.time.now();
    this.metronome = new MetronomeWorker();
    this.metronome.onmessage = (evt => this.zone.run(() => this.makePulses()));
    this.metronome.postMessage({
      command: 'start',
      interval: this.getBeatInterval() * 1000
    });
  }

  onDestroy() {
    this.metronome.terminate();
  }

  private makePulses() {
    while (this.getNextPulseTime() - this.time.now() < this.getBeatInterval() * 2) {
      this.pulseCount++;
      this.store.dispatch({type: PULSE, payload: {time: this.getNextPulseTime(), bpm: this.bpm}});
    }
  }

  private getBeatInterval() {
    return 60 / this.bpm;
  }

  private getNextPulseTime() {
    return this.startTime + this.pulseCount * this.getBeatInterval();
  }

}