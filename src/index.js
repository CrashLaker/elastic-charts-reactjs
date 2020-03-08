import React, {Component} from "react";

import { render } from "react-dom";
import {
    Axis,
    Chart,
    CurveType,
    LineSeries,
    niceTimeFormatByDay,
    Position,
    ScaleType,
    Settings,
    timeFormatter
} from "@elastic/charts";

import '@elastic/charts/dist/theme_light.css';

//import { KIBANA_METRICS } from "@elastic/charts/dist/utils/data_samples/test_dataset_kibana";

const dateFormatter = timeFormatter(niceTimeFormatByDay(1));
var gdata;

const App = () => (
    <Chart className="story-chart">
        <Settings showLegend showLegendExtra legendPosition={Position.Right} />
        <Axis
            id="bottom"
            position={Position.Bottom}
            showOverlappingTicks={true}
            tickFormat={dateFormatter}
        />
        <Axis
            id="left"
            title="Perc"
            position={Position.Left}
            tickFormat={d => `${Number(d).toFixed(0)}%`}
        />

        <LineSeries
            id="CPU"
            xScaleType={ScaleType.Time}
            yScaleType={ScaleType.Linear}
            xAccessor={0}
            yAccessors={[1]}
            seriesPointStyle={false}
            data={gdata[0]}
            curve={CurveType.LINEAR}
        />
        <LineSeries
            id="MEM"
            xScaleType={ScaleType.Time}
            yScaleType={ScaleType.Linear}
            //xAccessor={0}
            //yAccessors={[1]}
            data={gdata[1]}
            curve={CurveType.LINEAR}
        />
        <LineSeries
            id="TCP Out"
            xScaleType={ScaleType.Time}
            yScaleType={ScaleType.Linear}
            //xAccessor={0}
            //yAccessors={[1]}
            data={gdata[2]}
            curve={CurveType.LINEAR}
        />
    </Chart>
)

function round2(val) {
    return Math.round(val * 100) / 100;
}

function round3(val) {
    return Math.round(val * 1000) / 1000;
}

function prepData(packed) {
    console.time("prep");

    // epoch,idl,recv,send,read,writ,used,free

    const numFields = packed[0];

    packed = packed.slice(numFields + 1);

    // 55,550 data points x 3 series = 166,650
    let limit = 1000
    let data = [
        [Array(packed.length / numFields).slice(0,limit)],
        [Array(packed.length / numFields).slice(0,limit)],
        [Array(packed.length / numFields).slice(0,limit)]
    ];

    for (let i = 0, j = 0; i < packed.length; i += numFields, j++) {
        let t = packed[i] * 60 * 1000
        data[0][j] = [t, round3(100 - packed[i + 1])];
        data[1][j] = [t, round2(100 * packed[i + 5] / (packed[i + 5] + packed[i + 6]))];
        data[2][j] = [t, packed[i + 3]];
        if (j == limit) break
    }
    /*
      function filter(d) {
        return d.filter((d, i) => Math.round(i/1000) % 5 != 2);
      }
  
      data[0] = filter(data[0]);
      data[1] = filter(data[1]);
      data[2] = filter(data[2]);
      data[3] = filter(data[3]);
    */
    /*
      data[0] = data[0].slice(0, 1000);
      data[1] = data[1].slice(0, 1000);
      data[2] = data[2].slice(0, 1000);
      data[3] = data[3].slice(0, 1000);
  
      data[1][35] = null;
      data[1][36] = null;
      data[2][730] = null;
    */
    console.timeEnd("prep");

    return data;
}

function makeChart() {
    console.time("chart");

    render(<App />, document.getElementById("app"));

    wait.textContent = "Done!";
    console.timeEnd("chart");
}

let wait = document.getElementById("wait");
wait.textContent = "Fetching data.json (2.07MB)....";
fetch('https://leeoniya.github.io/uPlot/bench/data.json').then(r => r.json()).then(packed => {
    wait.textContent = "Rendering...";
    gdata = prepData(packed);
    setTimeout(() => makeChart(), 0);
});