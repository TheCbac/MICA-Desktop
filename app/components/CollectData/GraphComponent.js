/* @flow */
/* **********************************************************
* File: components/CollectData/GraphComponent.js
*
* Brief: Graph that displays the streaming data
*
* Authors: Craig Cheney
*
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
import { getDataPointDecimated, getLastDataPointsDecimated } from '../../utils/dataStreams/graphBuffer';
import {
  channelsToActiveNameList,
  getActiveDeviceList,
  getActiveSensorList
} from '../../utils/mica/parseDataPacket';
import type { collectionStateType, devicesStateType } from '../../types/stateTypes';

type propsType = {
  collectionSettings: collectionStateType,
  devices: devicesStateType

};
type stateType = {
  startTime: Date,
  time: Date,
  events: *
};

const sec2ms = 1000;
/* Number of data points to display on the screen */
const eventsSize = 200;
const sampleRate = 100; /* TODO: make dynamic */

/* Graph refresh rate in Hz */
const refreshRate = 20;
/* Graph refresh period in ms */
const refreshPeriod = (1 / refreshRate) * sec2ms;

function getColor(idx: number): string {
  const colorArray = [
    '#e41a1c',
    '#377eb8',
    '#4daf4a',
    '#984ea3',
    '#ff7f00',
    '#ffff33',
    '#a65628',
    '#f781bf',
    '#999999'
  ];
  const len = colorArray.length;
  const index = idx > (len - 1) ? Math.floor(Math.random() * (len - 1)) : idx;
  return colorArray[index];
}

export default class GraphComponent extends Component {
  /* Type defs */
  props: propsType;
  state: stateType;
  interval: number;
  /* Initial state */
  constructor(props: propsType) {
    super(props);
    /* Get the last events */
    const eventBuffer = new RingBuffer(eventsSize);
    /* TODO: make dynamic with sample rate */
    const prevEvents = getLastDataPointsDecimated(eventsSize, sampleRate / refreshRate);
    /* Populate the buffer */
    for (let i = 0; i < prevEvents.length; i++) {
      eventBuffer.enq(prevEvents[i]);
    }
    /* Get the start time */
    let startTime = new Date();
    let endTime = startTime;
    if (prevEvents.length) {
      startTime = new Date(prevEvents[0].timestamp());
      endTime = new Date(prevEvents[prevEvents.length - 1].timestamp());
    }
    this.state = {
      startTime,
      time: endTime,
      events: eventBuffer,
    };
  }
  /* Setup once created */
  componentDidMount() {
    /* Simulate events */
    this.interval = setInterval(
      () => {
        if (this.props.collectionSettings.collecting) {
          const t = new Date();
          /* Get the sample rate */
          const datum = getDataPointDecimated(sampleRate / refreshRate);
          if (datum) {
            /* Enqueue the event */
            const newEvent = this.state.events;
            newEvent.enq(datum);
            /* Update the state */
            this.setState({ time: t, events: newEvent });
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
  /* Get the charts */
  getCharts() {
    const activeDeviceIds = getActiveDeviceList(this.props.devices);
    /* Single device for now */
    const device = this.props.devices[activeDeviceIds[0]];
    /* Time range */
    const endTime = this.state.time.getTime();
    const timeRange = new TimeRange(endTime - (5 * sec2ms), endTime);
    /* Create the time series */
    const eventSeries = new TimeSeries({
      name: 'raw',
      events: this.state.events.peekN(this.state.events.size())
    });
    const defaultMin = -20;
    const defaultMax = 20;
    /* Get the range */
    let chartMin = defaultMin;
    let chartMax = defaultMax;
    let lineChart = (<LineChart series={new TimeSeries()} axis="y" />);
    let legendStyle = {};
    const legendCategories = [];
    let label = 'value';
    let name = '';
    /* Make sure a device is present */
    if (device) {
      /* Single sensor for now */
      const { sensors } = device.settings;
      if (sensors) {
        const activeSensorsIds = getActiveSensorList(sensors);
        const sensor = sensors[activeSensorsIds[0]];
        if (sensor && sensor.channels) {
          /* Multi channel */
          const channelNames = channelsToActiveNameList(sensor.channels);
          /* Calculate the ranges */
          const minVals = [defaultMin];
          const maxVals = [defaultMax];
          /* Styles */
          const stylesArray = [];
          label = sensor.units;
          name = sensor.name;
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
            /* Create the styles */
            stylesArray.push({
              key: channelName, color: getColor(i), width: 2
            });
            /* Crete the legend style */
            legendCategories.push({
              key: channelName, label: channelName
            });
          }
          chartMin = Math.min(...minVals);
          chartMax = Math.max(...maxVals);
          /* Create the style */
          const style = styler(stylesArray);
          legendStyle = style;
          /* Create the line chart */
          lineChart = (
            <LineChart
              axis="y"
              series={eventSeries}
              style={style}
              columns={channelNames}
              interpolation="curveLinear"
              breakLine
            />
          );
        }
      }
    }
    /* Return the charts */
    return {
      chart: (
        <ChartContainer timeRange={timeRange}>
          <ChartRow height="385">
            <YAxis
              id="y"
              label={label}
              min={chartMin}
              max={chartMax}
              width="70"
              type="linear"
            />
            <Charts>
              {lineChart}
              <Baseline axis="y" value={-20} />
              <Baseline axis="y" value={-10} />
              <Baseline axis="y" value={0} />
              <Baseline axis="y" value={10} />
              <Baseline axis="y" value={20} />
            </Charts>
          </ChartRow>
        </ChartContainer>
      ),
      legend: (
        <div>
          <span>{name}</span>
          <Legend
            type={'line'}
            style={legendStyle}
            categories={legendCategories}
          />
        </div>
      )
    };
  }
  /* Render function */
  render() {
    /* Styler */
    const { chart, legend } = this.getCharts();
    return (
      <div style={{ backgroundColor: '#E0E5E8' }}>
        <Row>
          <Col md={12}>
            <Col md={3} mdOffset={1}>
              {legend}
            </Col>
          </Col>
        </Row>
        <hr />
        <div className="row">
          <div className="col-md-12">
            <Resizable>
              {chart}
            </Resizable>
          </div>
        </div>
      </div>
    );
  }
}

/* [] - END OF FILE */
