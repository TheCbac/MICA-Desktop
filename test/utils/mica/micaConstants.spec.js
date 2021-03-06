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
  moduleToName, nameToId, CMD_START, CMD_STOP, DATA_CLOCK_FREQ,
  getMicaHandleFromUuid
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
    it('Stop command should be 0', () => {
      expect(CMD_STOP).toEqual(0x00);
    });
    it('Clock frequency should be 100 kHz', () => {
      expect(DATA_CLOCK_FREQ).toEqual(100000);
    });
  });
  describe('getMicaHandleFromUuid', () => {
    test('values match', () => {
      expect(getMicaHandleFromUuid(micaCharUuids.energyMetadata)).toBe(0x1B);
      expect(getMicaHandleFromUuid(micaCharUuids.energyCommands)).toBe(0x1E);
      expect(getMicaHandleFromUuid(micaCharUuids.actuationMetadata)).toBe(0x22);
      expect(getMicaHandleFromUuid(micaCharUuids.actuationCommands)).toBe(0x25);
      expect(getMicaHandleFromUuid(micaCharUuids.powerMetadata)).toBe(0x29);
      expect(getMicaHandleFromUuid(micaCharUuids.powerCommands)).toBe(0x2C);
      expect(getMicaHandleFromUuid(micaCharUuids.sensorMetadata)).toBe(0x30);
      expect(getMicaHandleFromUuid(micaCharUuids.sensorCommands)).toBe(0x33);
      expect(getMicaHandleFromUuid(micaCharUuids.communicationMetadata)).toBe(0x37);
      expect(getMicaHandleFromUuid(micaCharUuids.communicationCommands)).toBe(0x3A);
      expect(getMicaHandleFromUuid(micaCharUuids.controlMetadata)).toBe(0x3E);
      expect(getMicaHandleFromUuid(micaCharUuids.controlCommands)).toBe(0x41);
      expect(getMicaHandleFromUuid('unknown')).toBe(0);
      expect(getMicaHandleFromUuid('')).toBe(0);
    });
  });
});
