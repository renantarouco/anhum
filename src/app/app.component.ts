import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';
import { Store } from '@ngrx/store';

import { advance, play, setInitialState } from './core/actions';
import { AppState } from './model/app-state.model';
import { AudioPlayerService } from './audio/audio-player.service';
import { SamplesService } from './audio/samples.service';
import { InitialResponse, Message, PlayerService } from './player.service';
import { PlayerState } from './model/player-state.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'in-c-app',
  template: `
    <in-c-container [samplesLoaded]="samples.samplesLoaded | async"
                    [isPlaying]="isPlaying$ | async"
                    [playerStates]="playerStates$ | async"
                    [nowPlaying]="nowPlaying$ | async"
                    [stats]="stats$ | async"
                    [width]="width"
                    [height]="height"
                    [index]="index"
                    (play)="play()"
                    (advancePlayer)="advancePlayer($event)">
    </in-c-container>
  `
})
export class AppComponent implements OnInit {
  isPlaying$ = this.store.select(state => state.playing).distinctUntilChanged();
  playerStates$ = this.store.select(state => state.players);
  nowPlaying$ = this.store.select(state => state.nowPlaying);
  stats$ = this.store.select(state => state.stats);

  width = 0;
  height = 0;

  index: number;
  token: string;
  instrument: string;

  stateWS: WebSocket;
  advanceWS: WebSocket;

  stateSubscription: Subscription;
  currentState: AppState;
  playerState: PlayerState;

  constructor(private store: Store<AppState>,
              private audioPlayer: AudioPlayerService,
              private samples: SamplesService,
              private playerService: PlayerService) {
  }

  ngOnInit() {
    this.setSize();
  }

  @HostListener('window:resize')
  setSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  play() {
    this.audioPlayer.enableAudioContext();

    this.playerService.initialState.take(1).subscribe((res: InitialResponse) => {
      console.log('INITIAL RESPONSE:', res);
      this.index = res.index;
      this.token = res.token;

      if (res.state !== undefined) {
        this.store.dispatch(setInitialState(res.state))
      }

      this.stateWS = new WebSocket(`ws://localhost:8081/state-ws?token=${this.token}`);

      this.stateWS.onopen = (evt: MessageEvent) => {
        this.store.subscribe(state => {
          this.stateWS.send(JSON.stringify({
            index: this.index,
            order: state.beat,
            state: state
          }));
        })
      }

      this.stateWS.onclose = (evt) => {
          this.stateWS = null;
      }

      this.stateWS.onmessage = (evt: MessageEvent) => {}

      this.stateWS.onerror = (evt) => {
          console.log("STATE ERROR:",  evt);
      }

      this.store.subscribe((state) => {

      });

      this.advanceWS = new WebSocket(`ws://localhost:8081/advance-ws?token=${this.token}`);

      this.advanceWS.onopen = (evt: MessageEvent) => {
          this.store.dispatch(play());
      }

      this.advanceWS.onclose = (evt) => {
          this.advanceWS = null;
      }

      this.advanceWS.onmessage = (evt: MessageEvent) => {
          const message: Message  = JSON.parse(evt.data);
          this.store.dispatch(advance(message.instrument));
      }

      this.advanceWS.onerror = (evt) => {
          console.log("ADVANCE ERROR:",  evt);
      }
    });

    this.isPlaying$.subscribe(isPlaying => {
      console.log('ISPLAYING:', isPlaying);
      if (!isPlaying) {
        if (this.stateWS && (this.stateWS.readyState !== WebSocket.CLOSING && this.stateWS.readyState !== WebSocket.CLOSED)) {
          this.stateWS.close();
        }
        if (this.advanceWS && (this.advanceWS.readyState !== WebSocket.CLOSING && this.advanceWS.readyState !== WebSocket.CLOSED)) {
          this.advanceWS.close();
        }
      }
    })
  }

  advancePlayer(instrument: string) {
    this.advanceWS.send(JSON.stringify({
      index: this.index,
      token: this.token,
      instrument
    }));
  }

}
