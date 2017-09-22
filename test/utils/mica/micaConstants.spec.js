// @flow
/* **********************************************************
* File: test/utils/mica/micaConstants.spec.js
*
* Brief: Snapshot test for the Mica constants
*
* Authors: George Whitfield, Craig Cheney
*
* 2017.09.07 CC - Add helper function tests
* 2017.08.18 GW - Document created
*
********************************************************* */
import { micaServiceUuid, micaCharUuids,
  moduleToName, nameToId, CMD_START, DATA_CLOCK_FREQ
} from '../../../app/utils/mica/micaConstants';

/* Test suite */
describe('MicaConstants', () => {
  /* Snapshot tests are great for cases like these where we have a big list of constants */
  it('Service and Char UUIDs match snapshots', () => {
    expect(micaServiceUuid).toMatchSnapshot();
    expect(micaCharUuids).toMatchSnapshot();
  });
  /* Module and ID to Name */
  it('moduleToName returns the correct values', () => {
    expect(moduleToName('actuation', 1)).toEqual('Signal Voltage');
    expect(moduleToName('actuation', 4)).toEqual('Power Current');
    expect(moduleToName('energy', 1)).toEqual('LiPo');
    expect(moduleToName('energy', 2)).toEqual('LiFePO');
    expect(moduleToName('energy', 4)).toEqual('Unknown');
    expect(moduleToName('power', 1)).toEqual('Linear Regulator');
    expect(moduleToName('power', 2)).toEqual('Buck Converter');
    expect(moduleToName('sensing', 1)).toEqual('Accelerometer');
    expect(moduleToName('sensing', 2)).toEqual('Gyroscope');
    expect(moduleToName('sensing', 6)).toEqual('Load Cell');
    expect(moduleToName('communication', 1)).toEqual('Internal I2C');
    expect(moduleToName('communication', 6)).toEqual('External SPI');
    expect(moduleToName('control', 1)).toEqual('LEDs');
    expect(moduleToName('control', 2)).toEqual('Digital Port');
    expect(moduleToName('control', 4)).toEqual('Bootloader');
  });
  /* Name to Id  */
  it('nameToId returns the correct values', () => {
    expect(nameToId('Accelerometer')).toEqual({ id: 1, module: 'sensing' });
    expect(nameToId('accelerometer')).toEqual({ id: 1, module: 'sensing' });
    expect(nameToId('AccELerOmeTer')).toEqual({ id: 1, module: 'sensing' });
    expect(nameToId('Gyroscope')).toEqual({ id: 2, module: 'sensing' });
    expect(nameToId('LiPo')).toEqual({ id: 1, module: 'energy' });
    expect(nameToId('Power Current')).toEqual({ id: 4, module: 'actuation' });
    expect(nameToId('Internal SPI')).toEqual({ id: 3, module: 'communication' });
    expect(nameToId('Bootloader')).toEqual({ id: 4, module: 'control' });
    expect(nameToId('iDontExist')).toEqual({ id: undefined, module: undefined });
    expect(nameToId('')).toEqual({ id: undefined, module: undefined });
  });
  describe('Commands', () => {
    it('Start command should be 1', () => {
      expect(CMD_START).toEqual(0x01);
    });
    it('Clock frequency should be 100 kHz', () => {
      expect(DATA_CLOCK_FREQ).toEqual(100000);
    })
  });
});
