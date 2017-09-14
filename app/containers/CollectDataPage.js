/* @flow */
/* **********************************************************
* File: containers/CollectDataPage.js
*
* Brief: Actions for the scanning devices
*
* Authors: Craig Cheney
*
* 2017.09.14 CC - Document created
*
********************************************************* */
import React, { Component } from 'react';
import {
  Charts, ChartContainer, ChartRow, YAxis, LineChart, Baseline,
  styler
 } from 'react-timeseries-charts';
import { TimeSeries } from 'pondjs';
import { Col, Row } from 'react-bootstrap';


const testStyle = styler([
  { key: 'AUD', color: '#edf8b1', width: '3px' },
  { key: 'SMD', color: '#7fcdbb', width: '3px' },
  { key: 'USD', color: '2c7fb8', width: '3px' }
]);

const schemeName = ['YlGnBu'];
const columnNames = ['AUD', 'USD', 'SMD'];
const testStyle2 = styler(columnNames, schemeName);

const data = {
  name: 'Amounts',
  columns: ['time', 'AUD', 'SMD'],
  points: [
      [1400425940000, 1.5221321, 0.98329],
      [1400425948000, 1.18095384, 0.9032432],
      [1400425949000, 1.2664435, 0.7832904],
      [1400425950000, 1.93432543, 0.32423]
  ]
};

const data2 = {
  name: 'Amounts',
  columns: ['time', 'USD'],
  points: [
      [1400425940000, 1.938242],
      [1400425948000, 1.3241435234],
      [1400425949000, 1.4322435],
      [1400425950000, 1.2223541]
  ]
};

const series1 = new TimeSeries(data);
const series2 = new TimeSeries(data2);


export default class CollectDataPage extends Component {
  render() {
    return (
      <div>
        <Col md={4} lg={4}>
          <Col style={{ backgroundColor: '#E0E5E8', minHeight: '240px', marginBottom: '20px' }}>
            Controls
          </Col>
          <Row />
          <Col style={{ backgroundColor: '#E0E5E8', minHeight: '240px', fontFamily: 'Abel' }}>
            Graphs
          </Col>
        </Col>
        <Col md={8} lg={8}>
          <div style={{ backgroundColor: '#D4DDE1' }}>
            <ChartContainer timeRange={series1.timerange()} showGrid showGridPosition={'under'}>
              <ChartRow height="465">
                <YAxis id="axis1" label="AUD" min={0} max={2.5} width="60" type="linear" format="$,.2f" />
                <Charts>
                  <LineChart axis="axis1" interpolation={'curveMonotoneX'} columns={['AUD', 'SMD']} series={series1} style={testStyle} />
                  <LineChart axis="axis2" interpolation={'curveMonotoneX'} columns={['USD']} series={series2} style={testStyle} />
                  <Baseline
                    axis="axis1"
                    value={1.0}
                    label="USD Baseline"
                    position="right"
                  />
                </Charts>
                <YAxis id="axis2" label="USD" min={0} max={2.5} width="60" type="linear" format="$,.2f" />
              </ChartRow>
            </ChartContainer>
          </div>
        </Col>
      </div>
    );
  }
}

/* [] - END OF FILE */

