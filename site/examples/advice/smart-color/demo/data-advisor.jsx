import React from 'react';

import ReactDOM from 'react-dom';
import { ChartView } from 'antv-site-demo-rc';
import { colorSimulation, colorToHex, COLOR_BLINDNESS_SIMULATION_TYPES } from '@antv/smart-color';
import { Advisor } from '@antv/ava';

const myAdvisor = new Advisor();

// contants

const defaultData = [
  { year: '2007', sales: 28 },
  { year: '2008', sales: 55 },
  { year: '2009', sales: 43 },
  { year: '2010', sales: 91 },
  { year: '2011', sales: 81 },
  { year: '2012', sales: 53 },
  { year: '2013', sales: 19 },
  { year: '2014', sales: 87 },
  { year: '2015', sales: 52 },
];

const initColor = {
  model: 'rgb',
  value: { r: 239, g: 137, b: 56 },
};

const SIMULATION_TYPES = [...COLOR_BLINDNESS_SIMULATION_TYPES, 'grayscale'];

const initSimMethod = SIMULATION_TYPES[0];

const simulatedColor = colorSimulation(initColor, initSimMethod);

const themeColor = {
  /**
   * `primaryColor`: color in Hex string
   * such as '#ff5733'
   * specify color for ChartAdvisor
   */
  primaryColor: colorToHex(simulatedColor),
};

const App = () => {
  const currentAdvice = 0;
  const advices = myAdvisor.advise({
    data: defaultData,
    options: {
      theme: themeColor,
    },
  });

  return (
    <>
      <p>Render chart with specified color theme.</p>

      <div className="vis-content" style={{ height: 'calc(100% - 80px)' }}>
        <div id="vis" key="plot" style={{ flex: 5, height: '100%' }}>
          <ChartView chartRef={React.createRef()} spec={advices[currentAdvice].spec}></ChartView>
        </div>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('container'));
