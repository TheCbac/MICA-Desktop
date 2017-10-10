// @flow
/* **********************************************************
* File: components/modals/Modals.js
*
* Brief: Component that determines which modals are present
*
* Authors: Craig Cheney
*
* 2017.10.10 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import UpdateModal from './UpdateModal';
import SettingsModal from './SettingsModal';
import type {
  showUserSettingsActionT,
  enableDeveloperActionT
} from '../../types/appWideActionTypes';


type PropsType = {
  update: {
    pending: boolean,
    version: string
  },
  userSettings: {
    show: boolean,
    developer: boolean
  },
  /* Functions */
  showUserSettings: (boolean) => showUserSettingsActionT,
  enableDeveloper: (boolean) => enableDeveloperActionT
};
export default class Modals extends Component {
  /* Type defs */
  props: PropsType;

  render() {
    const { pending, version } = this.props.update;
    const { show, developer } = this.props.userSettings;
    return (
      <div>
        <UpdateModal pending={pending} version={version} />
        <SettingsModal
          show={show}
          developer={developer}
          showUserSettings={this.props.showUserSettings}
          enableDeveloper={this.props.enableDeveloper}
        />
      </div>
    );
  }
}

/* [] - END OF FILE */
