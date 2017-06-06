// @flow
/* **********************************************************
* File: types/storeType.js
*
* Brief: Reducer for the storing scan page
*
* Author: Craig Cheney
* Date: 2017.04.28
*
**********************************************************/
import type {
  Store as ReduxStore,
  Dispatch as ReduxDispatch,
} from 'redux';
import type { Action } from './actionTypes';
import type { State } from './stateTypes';

export type Store = ReduxStore<State, Action>;
export type GetState = () => State;

export type Thunk<A> = ((Dispatch, GetState) => Promise<void> | void) => A;

export type Dispatch =
  & ReduxDispatch<Action>
  & Thunk<Action>;

/* [] - END OF FILE */
