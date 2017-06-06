// @flow
/* **********************************************************
* File: stateTypes.js
*
* Brief: Export a state type see:
* https://blog.callstack.io/type-checking-react-and-redux-thunk-with-flow-part-2-206ce5f6e705
*
* Author: Craig Cheney
* Date: 2017.06.06
*
**********************************************************/
import type { Reducers } from '../reducers/index';
 // eslint-disable-next-line flowtype/no-weak-types
type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;

export type State = $ObjMap<Reducers, $ExtractFunctionReturn>;

/* [] - END OF FILE */
