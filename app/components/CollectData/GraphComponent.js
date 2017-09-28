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
import {
  Charts, ChartContainer, ChartRow, YAxis, LineChart, Baseline,
  styler, Resizable, BarChart, Legend
 } from 'react-timeseries-charts';
import { TimeSeries, TimeEvent, TimeRange } from 'pondjs';
import RingBuffer from 'ringbufferjs';
import { getDataPointDecimated, getLastDataPointsDecimated } from '../../utils/dataStreams/graphBuffer';
import type { collectionStateType } from '../../types/stateTypes';

type propsType = {
  collectionSettings: collectionStateType
};
type stateType = {
  startTime: Date,
  time: Date,
  events: *
};

const sec2ms = 1000;
/* Number of data points to display on the screen */
const eventsSize = 200;
const axes = ['x'];
const sampleRate = 100; /* TODO: make dynamic */

/* Graph refresh rate in Hz */
const refreshRate = 20;
/* Graph refresh period in ms */
const refreshPeriod = (1 / refreshRate) * sec2ms;

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
            // const dummyEvent = new TimeEvent(t, 9.8);
            // const dummy2 = new TimeEvent(t, datum.toPoint()[1]);
            // console.log('GraphComponent', data.toPoint(), event.toPoint());
            // console.log('datum:', datum, datum.toString(), datum.toPoint());
            // console.log('dummyEvent:', dummyEvent, dummyEvent.toString(), dummyEvent.toPoint());
            // console.log('dummy2:', dummy2, dummy2.toString(), dummy2.toPoint());
            /* Enqueue the event */
            const newEvent = this.state.events;
            // const newTime = new Date(datum.timestamp());
            newEvent.enq(datum);
            // newEvent.enq(dummyEvent);
            // newEvent.enq(dummy2);
            // console.log('graphcomponent', newTime.getTime());
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
  /* Render function */
  render() {
    const latestTime = this.state.time.toDateString();
    /* Create the time series */
    const eventSeries = new TimeSeries({
      name: 'raw',
      events: this.state.events.peekN(this.state.events.size())
    });
    /* Time range */
    const endTime = this.state.time.getTime();
    const timeRange = new TimeRange(endTime - (5 * sec2ms), endTime);
    /* Styles */
    const lineStyle = {
      x: {
        stroke: 'steelblue',
        strokeWidth: 2,
        opacity: 0.5
      }
    };
    /* Charts */
    const charts = (
      <Charts>
        <LineChart
          axis="y"
          series={eventSeries}
          style={lineStyle}
          columns={axes}
          interpolation="curveLinear"
          breakLine
        />
      </Charts>
    );
    /* Styler */
    const dateStyle = {
      fontSize: 12,
      color: '#AAA',
      borderWidth: 1,
      borderColor: '#F4F4F4'
    };
    return (
      <div style={{ backgroundColor: '#E0E5E8' }}>
        <div className="row">
          <div className="col-md-8">
            <span style={dateStyle}>{latestTime}</span>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-12">
            <Resizable>
              <ChartContainer timeRange={timeRange}>
                <ChartRow height="385">
                  <YAxis
                    id="y"
                    label="Value"
                    min={-20}
                    max={20}
                    width="70"
                    type="linear"
                  />
                  {charts}
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
