/* @flow */
/* **********************************************************
* File: components/CollectData/GraphComponent.js
*
* Brief: Graph that displays the streaming data
*
* Authors: Craig Cheney
*
* 2017.10.10 CC - High resolution recall support
* 2017.10.01 CC - Add multi device support
* 2017.09.27 CC - Add dynamic single device, single sensor chart
* 2017.09.14 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import {
  Charts, ChartContainer, ChartRow, YAxis, LineChart, Baseline,
  styler, Resizable, Legend
} from 'react-timeseries-charts';
import { TimeSeries, TimeRange } from 'pondjs';
import RingBuffer from 'ringbufferjs';
import update from 'immutability-helper';
import { constructStyles } from './GraphStyle';
import {
  getDataPointDecimated,
  getLastDataPointsDecimated,
  getDataSeries
} from '../../utils/dataStreams/graphBuffer';
import {
  channelsToActiveNameList,
  getActiveDeviceList,
  getActiveSensorList
} from '../../utils/mica/parseDataPacket';
import type { styleT } from './GraphStyle';
import type { idType, sensorParamType } from '../../types/paramTypes';
import type {
  collectionStateType,
  devicesStateType,
  devicesStateObjType
} from '../../types/stateTypes';

type propsT = {
  collectionSettings: collectionStateType,
  devices: devicesStateType

};
type deviceGraphStateT = {
  startTime: number,
  endTime: number,
  events: RingBuffer,
  highRes: TimeSeries
};

type stateT = {
  [deviceId: idType]: deviceGraphStateT
};

const sec2ms = 1000;
/* Number of data points to display on the screen */
const eventsSize = 200;
const sampleRate = 100; /* TODO: make dynamic */
/* Length of the window in ms */
const windowLength = 5000;

/* Graph refresh rate in Hz */
const refreshRate = 20;
/* Graph refresh period in ms */
const refreshPeriod = (1 / refreshRate) * sec2ms;
/* Default axis for when there aren't any active devices */
const defaultAxis = (
  <YAxis
    key={0}
    id='default'
    label=''
    min={-20}
    max={20}
    width='70'
    type='linear'
  />
);

type axisLimitT = {
  min: number,
  max: number
};

/* Returns the limits for a sensor */
function getChartLimits(channelNames: string[], eventSeries: TimeSeries): axisLimitT {
  const min = -15;
  const max = 15;
  const minVals = [min];
  const maxVals = [max];
  /* Calculate range and styles */
  for (let i = 0; i < channelNames.length; i++) {
    const channelName = channelNames[i];
    const eventMin = eventSeries.min(channelName);
    const eventMax = eventSeries.max(channelName);
    /* Ensure values exist */
    if (eventMin && eventMax) {
      minVals.push(eventMin);
      maxVals.push(eventMax);
    }
  }

  return {
    min: Math.min(...minVals),
    max: Math.max(...maxVals)
  };
}
/* Return the Y axes */
function constructYAxis(
  deviceId: idType, device: devicesStateObjType,
  sensorId: idType, sensor: sensorParamType,
  sensorCount: number, channelNames: string[],
  eventSeries: TimeSeries
): { leftAxis: *, rightAxis: * } {
  /* Push to left or right */
  const leftAxis = [];
  const rightAxis = [];
  /* Get the bounds */
  const { min, max } = getChartLimits(channelNames, eventSeries);
  /* Create the component */
  const axis = (
    <YAxis
      id={`${deviceId}-${sensorId}`}
      label={`${sensor.name} [${sensor.units}]`}
      min={min}
      max={max}
      width='70'
      type='linear'
      key={sensorCount}
    />
  );
  /* Push even axes to the left, odd to right */
  if (sensorCount % 2 === 0) {
    leftAxis.push(axis);
  } else {
    rightAxis.push(axis);
  }
  return {
    leftAxis,
    rightAxis
  };
}
/* Construct the legends */
function constructLegend(legendSensors) {
  const legendList = [];
  for (let l = 0; l < legendSensors.length; l++) {
    const { name, legend } = legendSensors[l];
    legendList.push(
      <Col md={4} key={l}>
        <span>{name}</span>
        <Legend
          key={l}
          type='line'
          style={styler(legend.stylesList)}
          categories={legend.categoriesList}
        />
      </Col>
    );
  }
  return (
    <Col md={12}>
      {legendList}
    </Col>
  );
}
/* Build the line charts */
function constructLineCharts(
  deviceCount: number, deviceId: idType, sensorId: idType,
  eventSeries: TimeSeries, channelNames: string[], style: styleT[]
): * {
  return (
    <LineChart
      key={deviceCount}
      axis={`${deviceId}-${sensorId}`}
      series={eventSeries}
      columns={channelNames}
      interpolation='curveLinear'
      breakLine
      style={styler(style)}
    />
  );
}

/* *** Main Class *** */

export default class GraphComponent extends Component<propsT, stateT> {
  interval: IntervalID;
  /* Initial state */
  constructor(props: propsT) {
    super(props);
    /* TODO: make dynamic with sample rate */
    const activeDeviceIds = getActiveDeviceList(props.devices);
    const defaultStateObj = {};
    /* Default times */
    let startTime = new Date().getTime();
    let endTime = startTime;
    /* Iterate through each active device */
    for (let i = 0; i < activeDeviceIds.length; i++) {
      const deviceId = activeDeviceIds[i];
      /* Get the last events */
      const eventBuffer = new RingBuffer(eventsSize);
      const prevEvents = getLastDataPointsDecimated(deviceId, eventsSize, sampleRate / refreshRate);

      const allEvents = getDataSeries(deviceId);
      const highRes = new TimeSeries({
        name: deviceId,
        events: allEvents
      });

      /* Populate the buffer */
      for (let j = 0; j < prevEvents.length; j++) {
        eventBuffer.enq(prevEvents[j]);
      }
      if (prevEvents.length) {
        startTime = prevEvents[0].timestamp().getTime();
        endTime = prevEvents[prevEvents.length - 1].timestamp().getTime();
      }
      defaultStateObj[deviceId] = {
        startTime,
        endTime,
        events: eventBuffer,
        highRes
      };
    }
    this.state = defaultStateObj;
  }
  /* Setup once created */
  componentDidMount() {
    /* Simulate events */
    this.interval = setInterval(
      () => {
        const deviceIdList = getActiveDeviceList(this.props.devices);
        if (this.props.collectionSettings.collecting) {
          /* Iterate through each device */
          for (let i = 0; i < deviceIdList.length; i++) {
            const deviceId = deviceIdList[i];
            // const device = this.props.devices[deviceId];
            /* Get the latest point */
            const datum = getDataPointDecimated(deviceId, sampleRate / refreshRate);
            if (datum) {
              /* Get the time */
              const t = datum.timestamp().getTime();
              /* Enqueue the event */
              const newEvent = this.state[deviceId].events;
              newEvent.enq(datum);
              /* Update the state */
              // this.setState({ [deviceId]: { endTime: t, events: newEvent } });
              this.setState((prevState, props) => {
                /* Update the endTime and Events */
                const newState = update(prevState, {
                  [deviceId]: {
                    endTime: { $set: t },
                    events: { $set: newEvent }
                  }
                });
                return newState;
              });
            }
          }
        } else {
          /* Pull the high res - this really only needs to be done once */
          for (let i = 0; i < deviceIdList.length; i++) {
            const deviceId = deviceIdList[i];
            const allEvents = getDataSeries(deviceId);
            const highRes = new TimeSeries({
              name: deviceId,
              events: allEvents
            });
            /* Update the state */
            this.setState((prevState, props) => {
              const newState = update(prevState, {
                [deviceId]: {
                  highRes: { $set: highRes }
                }
              });
              return newState;
            });
          }
        }
      },
      /* Call function every refresh period */
      refreshPeriod
    );
  }
  /* Clear Interval on unmount */
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  /* Return the time range for the chart - use the latest time */
  getMultiDeviceTimeRange(): TimeRange {
    /* Find the latest time */
    const stateIdsList = Object.keys(this.state);
    const endTimesList = [];
    /* Iterate through the devices */
    for (let i = 0; i < stateIdsList.length; i++) {
      const deviceId = stateIdsList[i];
      const deviceState = this.state[deviceId];
      endTimesList.push(deviceState.endTime);
    }
    /* Get the latest time & assign defaults */
    let endTime = Math.max(...endTimesList);
    endTime = endTime > 0 ? endTime : windowLength;
    /* Get the start time and assign defaults */
    let startTime = (endTime - windowLength);
    startTime = startTime > 0 ? startTime : 0;
    /* return the range */
    return new TimeRange(startTime, endTime);
  }

  /* Optimization of multidevices */
  getMultiDeviceChartObj() {
    let sensorCount = 0;
    let channelCount = 0;
    /* Store the charts */
    const chartList = [];
    /* Store the YAxes */
    const leftAxesList = [];
    const rightAxesList = [];
    /* Store the Legends */
    const legendSensors = [];
    /* Iterate through each device */
    const deviceIdList = getActiveDeviceList(this.props.devices);
    for (let i = 0; i < deviceIdList.length; i++) {
      const deviceId = deviceIdList[i];
      const device = this.props.devices[deviceId];
      const { sensors } = device.settings;
      /* Retrieve the events */
      const { events } = this.state[deviceId];
      /* Construct the time series */
      let eventSeries;
      if (!this.props.collectionSettings.collecting) {
        eventSeries = this.state[deviceId].highRes;
      } else {
        eventSeries = new TimeSeries({
          name: device.name,
          events: events.peekN(events.size())
        });
      }
      /* Iterate through each sensor */
      const sensorsIdList = getActiveSensorList(sensors);
      for (let j = 0; j < sensorsIdList.length; j++) {
        const sensorId = sensorsIdList[j];
        const sensor = sensors[parseInt(sensorId, 10)];
        /* Create a new legend and style for each sensor */
        legendSensors.push({
          name: `${device.name}: ${sensor.name}`,
          legend: {}
        });
        const categoriesList = [];
        const stylesList = [];
        /* Iterate through the channels */
        const channelNameList = channelsToActiveNameList(sensor.channels);
        for (let k = 0; k < channelNameList.length; k++) {
          const channelName = channelNameList[k];
          /* Store the styles for the line and legend */
          const { style, category } = constructStyles(sensor.name, channelName, channelCount);
          categoriesList.push(category);
          stylesList.push(style);
          /* Increment the channel count */
          channelCount += 1;
        }
        /* construct the Y Axes */
        const { leftAxis, rightAxis } = constructYAxis(
          deviceId, device, sensorId, sensor,
          sensorCount, channelNameList, eventSeries
        );
        /* Push to their lists */
        leftAxesList.push(...leftAxis);
        rightAxesList.push(...rightAxis);
        /* Construct and store the line chart */
        chartList.push(constructLineCharts(
          i, deviceId, sensorId, eventSeries,
          channelNameList, stylesList
        ));
        /* Simple default axis */
        if (i === 0) {
          chartList.push(<Baseline key={0} axis={`${deviceId}-${sensorId}`} value={0} />);
        }
        /* assign the categories and styles */
        legendSensors[sensorCount].legend = { categoriesList, stylesList };
        /* increment sensor count */
        sensorCount += 1;
      }
    }
    /* Ensure there is always an axis */
    if (sensorCount === 0) {
      leftAxesList.push(defaultAxis);
      chartList.push(<Baseline key={0} axis='default' value={0} />);
    }
    /* Construct the legend */
    const legend = constructLegend(legendSensors);
    /* Return the object */
    return {
      leftAxesList,
      rightAxesList,
      legend,
      chartList
    };
  }
  /* Render function */
  render() {
    const {
      leftAxesList,
      rightAxesList,
      legend,
      chartList
    } = this.getMultiDeviceChartObj();
    const timeRange = this.getMultiDeviceTimeRange();
    return (
      <div style={{ backgroundColor: '#E0E5E8' }}>
        <Row>
          {legend}
        </Row>
        <hr />
        <div className='row'>
          <div className='col-md-12'>
            <Resizable>
              <ChartContainer
                timeRange={timeRange}
                enablePanZoom
              >
                <ChartRow height='385'>
                  {leftAxesList}
                  <Charts>
                    {chartList}
                  </Charts>
                  {rightAxesList}
                </ChartRow>
              </ChartContainer>
            </Resizable>
          </div>
        </div>
      </div>
    );
  }
}

/* [] - END OF FILE */
