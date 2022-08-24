import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener
} from '@angular/core';
import { PlayerState, canPlayerAdvance, isPlayerPlayingLast } from '../../model/player-state.model';
import { PlayerStats } from '../../model/player-stats.model';
import { PlayerService } from '../../player.service';

@Component({
  selector: 'in-c-advance-button',
  template: require('./advance-button.component.html'),
  styles: [require('./advance-button.component.css')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvanceButtonComponent {
  @Input() playerState: PlayerState;
  @Input() playerStats: PlayerStats;
  @Output() advance = new EventEmitter();

  @Input() index: number

  constructor(
    private playerService: PlayerService
  ) {}

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(this.playerState.player.index + 49 === event.keyCode) {
      this.advance.next();
    }
  }
  getState(): 'notStarted' | 'playing' | 'playingLast' {
    if (isPlayerPlayingLast(this.playerState)) {
      return 'playingLast';
    } else if (this.playerState.moduleIndex >= 0) {
      return 'playing';
    } else {
      return 'notStarted';
    }
  }

  canPlayerAdvance() {
    return canPlayerAdvance(this.playerState, this.playerStats) && this.index == this.playerState.player.index;
  }

  onClick(event: MouseEvent) {
    this.advance.next()
  }
}