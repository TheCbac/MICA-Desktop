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
  styler, Resizable, BarChart, ScatterChart, Legend
 } from 'react-timeseries-charts';
import { TimeSeries, TimeEvent, TimeRange, Pipeline, percentile, EventOut, Stream } from 'pondjs';
import RingBuffer from 'ringbufferjs';
import { getDataPoint, getLastDataPoint } from '../../utils/dataStreams/graphBuffer';
import type { collectionStateType } from '../../types/stateTypes';

type propsType = {
  collectionSettings: collectionStateType
};
type stateType = {
  startTime: Date,
  time: Date,
  events: *
};


// export function reportToGraph(event: TimeEvent) {
//   if (this.props.collectionSettings.collecting) {
//     const t = new Date(this.state.time.getTime() + increment);
//     /* Enqueue the event */
//     const newEvent = this.state.events;
//     newEvent.enq(event);
//     /* Update the state */
//     this.setState({ time: t, events: newEvent });
//     /* Let the aggregator process the event */
//     this.stream.addEvent(event);
//   }
// }

/* Create a new event  */
function getNewEvent(t: Date): TimeEvent {
  const base = (Math.sin(t.getTime() / 10000000) * 350) + 500;
  return new TimeEvent(t, parseInt(base + (Math.random() * 1000), 10));
}

const sec = 1000;
const minute = 60 * sec;
const hours = 60 * minute;
const rate = 30;
const increment = minute;
const eventsSize = 200;

export default class GraphComponent extends Component {
  /* Type defs */
  props: propsType;
  state: stateType;
  interval: number;
  /* Initial state */
  constructor(props: propsType) {
    super(props);
    this.state = {
      startTime: new Date(),
      time: new Date(),
      events: new RingBuffer(eventsSize),
    };
  }
  /* Setup once created */
  componentDidMount() {
    /* Simulate events */
    this.interval = setInterval(
      () => {
        if (this.props.collectionSettings.collecting) {
          const t = new Date();
          // const event = getNewEvent(t);
          // const event = getDataPoint();
          // const datum = getDataPoint();
          const datum = getLastDataPoint();
          if (datum) {
            const dummyEvent = new TimeEvent(t, 9.8);
            const dummy2 = new TimeEvent(t, datum.toPoint()[1]);
            // console.log('GraphComponent', data.toPoint(), event.toPoint());
            // console.log('datum:', datum, datum.toString(), datum.toPoint());
            // console.log('dummyEvent:', dummyEvent, dummyEvent.toString(), dummyEvent.toPoint());
            // console.log('dummy2:', dummy2, dummy2.toString(), dummy2.toPoint());
            /* Enqueue the event */
            const newEvent = this.state.events;
            const newTime = new Date(datum.timestamp());
            // newEvent.enq(datum);
            // newEvent.enq(dummyEvent);
            newEvent.enq(dummy2);
            // console.log('graphcomponent', newTime.getTime());
            /* Update the state */
            this.setState({ time: t, events: newEvent });
          }
        }
      },
      rate
    );
  }
  /* Clear Interval on unmount */
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  /* Render function */
  render() {
    const latestTime = this.state.time.toDateString();
    /* Styles */
    const scatterStyle = {
      value: {
        normal: {
          fill: 'steelblue',
          opacity: 0.5
        }
      }
    };
    /* Create the time series */
    const eventSeries = new TimeSeries({
      name: 'raw',
      events: this.state.events.peekN(this.state.events.size())
    });
    /* Time range */
    // const intitialBeginTime = this.state.startTime;
    // const timeWindow = 5 * sec;
    // let beginTime;
    // const endTime = new Date(this.state.time.getTime() + sec);
    // /* Wait until the window is full before moving */
    // if (endTime.getTime() - timeWindow < intitialBeginTime.getTime()) {
    //   beginTime = intitialBeginTime;
    // } else {
    //   beginTime = new Date(endTime.getTime() - timeWindow);
    // }
    const endTime = this.state.time.getTime();
    const timeRange = new TimeRange(endTime - (5 * sec), endTime);
    /* Charts */
    const charts = (
      <Charts>
        <ScatterChart axis="y" series={eventSeries} style={scatterStyle} />
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
