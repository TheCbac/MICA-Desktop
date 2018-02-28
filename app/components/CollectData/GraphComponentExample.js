/* @flow */
/* **********************************************************
* File: components/CollectData/GraphComponentExample.js
*
* Brief: Graph that displays a mock up of data, generated
*   pseudo-randomly.
*
* Authors: Craig Cheney
*
* 2017.09.27 CC - Renamed GraphComponentExample from
*   GraphComponent, to preserve example
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
import type { collectionStateType } from '../../types/stateTypes';

type propsType = {
  collectionSettings: collectionStateType
};
type stateType = {
  time: Date,
  events: *,
  percentile50Out: *,
  percentile90Out: *
};


export function reportToGraph(a: string) {
  console.log('GraphComponent:', a);
}

/* Create a new event  */
function getNewEvent(t: Date): TimeEvent {
  const base = (Math.sin(t.getTime() / 10000000) * 350) + 500;
  return new TimeEvent(t, parseInt(base + (Math.random() * 1000), 10));
}

const sec = 1000;
const minute = 60 * sec;
const hours = 60 * minute;
const rate = 80;
const increment = minute;
const eventsSize = 200;
const percentileSize = 100;

export default class GraphComponent extends Component<propsType, stateType> {
  stream: typeof Stream;
  interval: number;
  /* Initial state */
  constructor(props: propsType) {
    super(props);
    this.state = {
      time: new Date(2015, 0, 1),
      events: new RingBuffer(eventsSize),
      percentile50Out: new RingBuffer(percentileSize),
      percentile90Out: new RingBuffer(percentileSize)
    };
  }
  /* Setup once created */
  componentDidMount() {
    this.stream = new Stream();
    /* Configure the pipeline for the 50 % */
    Pipeline()
      .from(this.stream)
      .windowBy('5m')
      .emitOn('discard')
      .aggregate({
        value: { value: percentile(50) }
      })
      .to(EventOut, event => {
        const events = this.state.percentile50Out;
        events.enq(event);
        this.setState({ percentile50Out: events });
      });
    /* Pipeline for th 90 %  */
    Pipeline()
      .from(this.stream)
      .windowBy('5m')
      .emitOn('discard')
      .aggregate({
        value: { value: percentile(90) }
      })
      .to(EventOut, event => {
        const events = this.state.percentile90Out;
        events.enq(event);
        this.setState({ percentile90Out: events });
      });

    /* Simulate events */
    this.interval = setInterval(
      () => {
        if (this.props.collectionSettings.collecting) {
          const t = new Date(this.state.time.getTime() + increment);
          const event = getNewEvent(t);
          /* Enqueue the event */
          const newEvent = this.state.events;
          newEvent.enq(event);
          /* Update the state */
          this.setState({ time: t, events: newEvent });
          /* Let the aggregator process the event */
          this.stream.addEvent(event);
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
    const fiveMinuteStyle = {
      value: {
        normal: { fill: '#619F3A', opacity: 0.2 },
        highlight: { fill: '619F3A', opacity: 0.5 },
        selected: { fill: '619F3A', opacity: 0.5 }
      }
    };
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
    /* Create the percentile series */
    const perc50Series = new TimeSeries({
      name: 'Five Minute perc50',
      events: this.state.percentile50Out.peekN(this.state.percentile50Out.size())
    });
    const perc90Series = new TimeSeries({
      name: 'Five Minute perc90',
      events: this.state.percentile90Out.peekN(this.state.percentile90Out.size())
    });
    /* Time range */
    const intitialBeginTime = new Date(2015, 0, 1);
    const timeWindow = 3 * hours;
    let beginTime;
    const endTime = new Date(this.state.time.getTime() + minute);
    /* Wait until the window is full before moving */
    if (endTime.getTime() - timeWindow < intitialBeginTime.getTime()) {
      beginTime = intitialBeginTime;
    } else {
      beginTime = new Date(endTime.getTime() - timeWindow);
    }
    const timeRange = new TimeRange(beginTime, endTime);

    /* Charts */
    const charts = (
      <Charts>
        <BarChart
          axis='y'
          series={perc90Series}
          style={fiveMinuteStyle}
          column={['value']}
        />
        <BarChart
          axis='y'
          series={perc50Series}
          style={fiveMinuteStyle}
          column={['value']}
        />
        <ScatterChart axis='y' series={eventSeries} style={scatterStyle} />
      </Charts>
    );
    /* Styler */
    const dateStyle = {
      fontSize: 12,
      color: '#AAA',
      borderWidth: 1,
      borderColor: '#F4F4F4'
    };

    const style = styler([
      { key: 'perc50', color: '#C5DCB7', width: 1, dashed: true },
      { key: 'perc90', color: '#DFECD7', width: 2 }
    ]);


    return (
      <div style={{ backgroundColor: '#E0E5E8' }}>
        <div className='row'>
          <div className='col-md-4'>
            <Legend
              type='swatch'
              style={style}
              categories={[
                {
                  key: 'perc50',
                  label: '50th Percentile',
                  style: { fill: '#C5DCB7' }
                },
                {
                  key: 'perc90',
                  label: '90th Percentile',
                  style: { fill: '#DFECD7' }
                }
              ]}
            />
          </div>
          <div className='col-md-8'>
            <span style={dateStyle}>{latestTime}</span>
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className='col-md-12'>
            <Resizable>
              <ChartContainer timeRange={timeRange}>
                <ChartRow height='385'>
                  <YAxis
                    id='y'
                    label='Value'
                    min={0}
                    max={1500}
                    width='70'
                    type='linear'
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
