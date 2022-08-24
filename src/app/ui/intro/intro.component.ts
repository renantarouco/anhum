import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import 'rxjs/operator/take';
import 'rxjs/operator/map';
import { PlayerService } from '../../player.service';

const firebaseConfig = {
  apiKey: "AIzaSyA6bcCG4lHw5dsS5Epg7SPCVZZM_FX0DOU",
  authDomain: "anhum-1db51.firebaseapp.com",
  projectId: "anhum-1db51",
  storageBucket: "anhum-1db51.appspot.com",
  messagingSenderId: "624920659938",
  appId: "1:624920659938:web:53d58f6f48aafb9c321bbb"
};

const getTokenOptions = {
  vapidKey: 'BK5Dqjfh3iQpw3MLNtk8O1F-4C31RqXJo8bvYxKCcAeItxrpoy-LUH3Upb59GXgLG6P8f8XsNhYL64vVft6hHdw'
};

@Component({
  selector: 'in-c-intro',
  template: require('./intro.component.html'),
  styles: [require('./intro.component.css')]
})
export class IntroComponent {
  @Input() samplesLoaded: boolean;
  @Output() play = new EventEmitter();

  constructor() {}

  onPlay() {
    this.play.emit();
  }
}