import { Action } from '@ngrx/store';
import { AppState } from '../model/app-state.model';

export const PLAY = 'PLAY';
export const PULSE = 'PULSE';
export const ADVANCE = 'ADVANCE';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';

export function play(): Action {
  return {
    type: PLAY
  };
}

export function pulse(time: number, bpm: number): Action {
  return {
    type: PULSE,
    payload: {time, bpm}
  };
}

export function advance(instrument: string): Action {
  return {
    type: ADVANCE,
    payload: {instrument}
  }
}

export function setInitialState(state: AppState): Action {
  return {
    type: SET_INITIAL_STATE,
    payload: state
  }
}
