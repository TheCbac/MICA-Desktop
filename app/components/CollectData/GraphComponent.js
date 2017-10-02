/* @flow */
/* **********************************************************
* File: components/CollectData/GraphComponent.js
*
* Brief: Graph that displays the streaming data
*
* Authors: Craig Cheney
*
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
import { getDataPointDecimated, getLastDataPointsDecimated } from '../../utils/dataStreams/graphBuffer';
import {
  channelsToActiveNameList,
  getActiveDeviceList,
  getActiveSensorList
} from '../../utils/mica/parseDataPacket';
import type { idType } from '../../types/paramTypes';
import type { collectionStateType, devicesStateType } from '../../types/stateTypes';

type propsT = {
  collectionSettings: collectionStateType,
  devices: devicesStateType

};
// type stateType = {
//   startTime: Date,
//   time: Date,
//   events: *
// };
type deviceGraphStateT = {
  startTime: number,
  endTime: number,
  events: RingBuffer
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
/* Default axis for when there aren't any active devices */
const defaultAxis = (
  <YAxis
    key={0}
    id="default"
    label={''}
    min={-20}
    max={20}
    width="70"
    type="linear"
  />
);

type axisLimitT = {
  min: number,
  max: number
};
/* Returns the limits for a sensor */
function getChartLimits(deviceId: idType, sensorId: idType): axisLimitT {
  const min = -20;
  const max = 20;
  return {
    min,
    max
  }
}

export default class GraphComponent extends Component {
  /* Type defs */
  props: propsT;
  state: stateT;
  interval: number;
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
        events: eventBuffer
      };
    }

    // const deviceId = activeDeviceIds[0];
    // /* Default state */
    // let startTime = new Date();
    // let endTime = startTime;

    // if (deviceId) {
    //   /* Single device for now */
    //   const prevEvents = getLastDataPointsDecimated(activeDeviceIds[0], eventsSize, sampleRate / refreshRate);
    //   /* Populate the buffer */
    //   for (let i = 0; i < prevEvents.length; i++) {
    //     eventBuffer.enq(prevEvents[i]);
    //   }
    //   if (prevEvents.length) {
    //     startTime = new Date(prevEvents[0].timestamp());
    //     endTime = new Date(prevEvents[prevEvents.length - 1].timestamp());
    //   }
    // }
    /* Set the state */
    // this.state = {
    //   startTime,
    //   time: endTime,
    //   events: eventBuffer,
    // };
    this.state = defaultStateObj;
  }
  /* Setup once created */
  componentDidMount() {
    /* Simulate events */
    this.interval = setInterval(
      () => {
        if (this.props.collectionSettings.collecting) {
          const deviceIdList = getActiveDeviceList(this.props.devices);
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
              this.setState({ [deviceId]: { endTime: t, events: newEvent } });
            }
          }
        }
      },
      /* Call function every refresh period */
      refreshPeriod
    );
  // /* Setup once created */
  // componentDidMount() {
  //   /* Simulate events */
  //   this.interval = setInterval(
  //     () => {
  //       if (this.props.collectionSettings.collecting) {
  //         const t = new Date();
  //         /* Get the sample rate */
  //         const datum = getDataPointDecimated(sampleRate / refreshRate);
  //         if (datum) {
  //           /* Enqueue the event */
  //           const newEvent = this.state.events;
  //           newEvent.enq(datum);
  //           /* Update the state */
  //           this.setState({ time: t, events: newEvent });
  //         }
  //       }
  //     },
  //     /* Call function every refresh period */
  //     refreshPeriod
  //   );
  }
  /* Clear Interval on unmount */
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /* Get the charts */
  getCharts() {
    const activeDeviceIds = getActiveDeviceList(this.props.devices);
    /* Iterate through each device */
    for (let i = 0; i < activeDeviceIds.length; i++) {
      const deviceId = activeDeviceIds[i];
      const device = this.props.devices[deviceId];
      /* Time range */
      const { endTime } = this.state[deviceId];
      const timeRange = new TimeRange(endTime - (5 * sec2ms), endTime);
      const { events } = this.state[deviceId];
      /* Create the time series */
      const eventSeries = new TimeSeries({
        name: device.name,
        events: events.peekN(events.size())
      });
      /* Chart defaults */
      let chartMin = defaultMin;
      let chartMax = defaultMax;
      let lineChart = (<LineChart series={new TimeSeries()} axis="y" />);
      let legendStyle = {};
      const legendCategories = [];
      let label = 'value';
      let name = '';
      /* Get the sensors */
      const { sensors } = device.settings;
      if (sensors) {
      /* Iterate through each sensor */
        const activeSensorsIds = getActiveSensorList(sensors);
        for (let j = 0; j < activeSensorsIds.length; j++) {
          const sensor = sensors[activeSensorsIds[j]];
          const { channels } = sensor;
          if (channels) {
            /* Multi channel */
            const channelNames = channelsToActiveNameList(channels);
            /* Calculate the ranges */
            const minVals = [defaultMin];
            const maxVals = [defaultMax];
            /* Styles */
            const stylesArray = [];
            label = sensor.units;
            name = sensor.name;
            /* Calculate range and styles */
            for (let k = 0; k < channelNames.length; j++) {
              const channelName = channelNames[k];
              const eventMin = eventSeries.min(channelName);
              const eventMax = eventSeries.max(channelName);
              /* Ensure values exist */
              if (eventMin && eventMax) {
                minVals.push(eventMin);
                maxVals.push(eventMax);
              }
              /* Create the styles */
              stylesArray.push({
                key: channelName, color: getColor(k), width: 2
              });
              /* Crete the legend style */
              legendCategories.push({
                key: channelName, label: channelName
              });
            }
          }
        }
      }
    }

    // /* Single device for now */
    // const device = this.props.devices[activeDeviceIds[0]];
    // /* Time range */
    // const endTime = this.state.time.getTime();
    // const timeRange = new TimeRange(endTime - (5 * sec2ms), endTime);
    // /* Create the time series */
    // const eventSeries = new TimeSeries({
    //   name: 'raw',
    //   events: this.state.events.peekN(this.state.events.size())
    // });
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
  /* Return an array of axes based on the devices and sensors */
  getMultiDeviceYAxis() {
    const leftAxesList = [];
    const rightAxesList = [];
    const deviceIdList = getActiveDeviceList(this.props.devices);
    let axisKey = 0;
    /* Iterate through each device */
    for (let i = 0; i < deviceIdList.length; i++) {
      const deviceId = deviceIdList[i];
      const device = this.props.devices[deviceId];
      const { sensors } = device.settings;
      const sensorsIdList = getActiveSensorList(sensors);
      /* Iterate through each sensor */
      for (let j = 0; j < sensorsIdList.length; j++) {
        const sensorId = sensorsIdList[j];
        const sensor = sensors[parseInt(sensorId, 10)];
        const { min, max } = getChartLimits(deviceId, sensorId);
        const axis = (
          <YAxis
            id={`${deviceId}-${sensorId}`}
            label={`${sensor.name} [${sensor.units}]`}
            min={min}
            max={max}
            width="70"
            type="linear"
            key={axisKey}
          />
        );
        /* Push even axes to the left, odd to right */
        if (axisKey % 2 === 0) {
          leftAxesList.push(axis);
        } else {
          rightAxesList.push(axis);
        }
        /* Inc the key */
        axisKey += 1;
      }
    }
    /* Always have an axis */
    if (axisKey === 0) {
      leftAxesList.push(defaultAxis);
    }
    return {
      leftAxes: leftAxesList,
      rightAxes: rightAxesList
    };
  }
  /* Return the legend for the chart */
  getMultiDeviceLegend() {
    const legendSensors = [];
    let sensorCount = 0;
    let channelCount = 0;
    const deviceIdList = getActiveDeviceList(this.props.devices);
    /* Iterate through each device */
    for (let i = 0; i < deviceIdList.length; i++) {
      const deviceId = deviceIdList[i];
      const device = this.props.devices[deviceId];
      const { sensors } = device.settings;
      const sensorsIdList = getActiveSensorList(sensors);
      /* Iterate through each sensor */
      for (let j = 0; j < sensorsIdList.length; j++) {
        const sensorId = sensorsIdList[j];
        const sensor = sensors[parseInt(sensorId, 10)];
        /* Create a new legend and style for each sensor */
        legendSensors.push({
          name: `${device.name}: ${sensor.name}`,
          legend: {}
        });
        const channelNameList = channelsToActiveNameList(sensor.channels);
        /* iterate through each channel */
        const categories = [];
        const styles = [];
        for (let k = 0; k < channelNameList.length; k++) {
          const channelName = channelNameList[k];
          categories.push({ key: channelName, label: channelName });
          styles.push({ key: channelName, color: getColor(channelCount), width: 2 });
          /* Increment the channel count */
          channelCount += 1;
        }
        /* assign the categories and styles */
        legendSensors[sensorCount].legend = { categories, styles };
        /* Increment the sensor count */
        sensorCount += 1;
      }
    }
    /* Create the list of Legends */
    const legendList = [];
    for (let l = 0; l < legendSensors.length; l++) {
      const { name, legend } = legendSensors[l];
      legendList.push(
        <Col md={4} key={l}>
          <span>{name}</span>
          <Legend
            key={l}
            type={'line'}
            style={styler(legend.styles)}
            categories={legend.categories}
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
  /* Get the charts for multiple devices */
  getMultiDeviceCharts() {
    const chartList = [];
    const deviceIdList = getActiveDeviceList(this.props.devices);
    /* Iterate through each device */
    for (let i = 0; i < deviceIdList.length; i++) {
      const deviceId = deviceIdList[i];
      const device = this.props.devices[deviceId];
      const { sensors } = device.settings;
      /* Retrieve the events */
      const { events } = this.state[deviceId];
      /* Construct the time series */
      const eventSeries = new TimeSeries({
        name: device.name,
        events: events.peekN(events.size())
      });
      /* Iterate through the active sensors */
      const sensorIdList = getActiveSensorList(sensors);
      for (let j = 0; j < sensorIdList.length; j++) {
        const sensorId = sensorIdList[j];
        const sensor = sensors[parseInt(sensorId, 10)];
        const { channels } = sensor;
        /* Multi channel */
        const channelNames = channelsToActiveNameList(channels);
        /* Push the line chart */
        chartList.push(
          <LineChart
            key={i}
            axis={`${deviceId}-${sensorId}`}
            series={eventSeries}
            columns={channelNames}
            interpolation="curveLinear"
            breakLine
          />
        );
      }
    }
    return (
      <Charts>
        {chartList}
      </Charts>
    );
  }

  /* Get the charts for multiple devices */
  chartWrapper() {
    /* Get the time range for the chart(s) */
    const timeRange = this.getMultiDeviceTimeRange();
    const { leftAxes, rightAxes } = this.getMultiDeviceYAxis();
    return (
      <ChartContainer timeRange={timeRange}>
        <ChartRow height="385">
          {leftAxes}
          {this.getMultiDeviceCharts()}
          {rightAxes}
        </ChartRow>
      </ChartContainer>
    );
  }
  /* Render function */
  render() {
    return (
      <div style={{ backgroundColor: '#E0E5E8' }}>
        <Row>
          {this.getMultiDeviceLegend()}
        </Row>
        <hr />
        <div className="row">
          <div className="col-md-12">
            <Resizable>
              {this.chartWrapper()}
            </Resizable>
          </div>
        </div>
      </div>
    );
  }
}

/* [] - END OF FILE */
