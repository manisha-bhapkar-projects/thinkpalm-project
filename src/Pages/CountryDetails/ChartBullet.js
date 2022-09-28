import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
//import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { toNumber, round } from "lodash";
am4core.useTheme(am4themes_animated);

class ChartBullet extends Component {
  constructor(props) {
    super(props);

    this.createChart = this.createChart.bind(this);
    this.createRange = this.createRange.bind(this);
    this.createBulletChart = this.createBulletChart.bind(this);
  }

  createChart(chartname, direction, logchart) {
    let container = am4core.create(chartname, am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = "vertical";

    this.createBulletChart(container, direction, logchart);
  }
  componentDidMount() {
    am4core.addLicense("CH281496465");
    this.createChart(
      `chartdiv1${this.props.divId}`,
      "",
      this.props.chartData.isLogChart
    );
    // this.createChart("chartdiv2","","");
    // this.createChart("chartdiv3","reverse","");
    // this.createChart("chartdiv4","","true");
  }
  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  createRange(axis, from, to, color) {
    let range = axis.axisRanges.create();
    range.value = from;
    range.endValue = to;
    range.axisFill.fill = color;
    
    range.axisFill.fillOpacity = 0.8;
    range.label.disabled = true;
    range.grid.disabled = true;
  }
  /* Create bullet chart with specified color type for background */
  createBulletChart(container, direction, logchart) {
    let divideByBillion = 1000000000;

    var colors = ["#F9B132","#F9B132","#75B685"];
    if (this.props.divId === 2||this.props.divId === 6||this.props.divId === 7) 
    colors = ["#75B685", "#F9B132","#F9B132"];

    /* Create chart instance */
    let chart = container.createChild(am4charts.XYChart);
    chart.paddingRight = 25;

    const getTitle = (data) => {
      if((data.value).toFixed(0) < 1 && (data.median).toFixed(0) > 0 && (data.average).toFixed(0) > 0) {
        data.category += '**';
      }
      return data;
    }
    /* Add data */
    if (logchart === "true") {
      chart.data = [
        getTitle({
          category: this.props.chartData.category,
          value: this.props.chartData.value / divideByBillion,
          median: this.props.chartData.median / divideByBillion,
          average: this.props.chartData.average / divideByBillion,
        }),
      ];
    }else if(this.props.chartData.isKdollar==="true"){
      chart.data = [
        getTitle({
          category: this.props.chartData.category,
          value: this.props.chartData.value/ 1000,
          median: this.props.chartData.median/ 1000,
          average: this.props.chartData.average / 1000,
        }),
      ];
    }
    
    else {
      chart.data = [
        getTitle({
          category: this.props.chartData.category,
          value: this.props.chartData.value,
          median: this.props.chartData.median,
          average: this.props.chartData.average,
        }),
      ];
    }

    /* Create axes */
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.tooltip.getFillFromObject = false;
   categoryAxis.tooltip.background.fill = am4core.color("#104378");
   categoryAxis.tooltip.background.cornerRadius = 3;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.grid.template.disabled = true;
    if (this.props.divId === 0) categoryAxis.paddingRight = 36;
    if (this.props.divId === 1) categoryAxis.paddingRight = 21;
    if (this.props.divId === 2) categoryAxis.paddingRight = 54;
    if (this.props.divId === 3) categoryAxis.paddingRight = 36;
    if (this.props.divId === 4) categoryAxis.paddingRight = 37;
    if (this.props.divId === 5) categoryAxis.paddingRight = 18;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minGridDistance = 147;
    if(this.props.chartData.isPercent==="true"){
      valueAxis.renderer.minGridDistance = 80;
    }
    if(this.props.chartData.isEmp==="true"){
      valueAxis.renderer.minGridDistance = 150;
    }
    valueAxis.renderer.grid.template.disabled = true;

    if (logchart === "true") {
      valueAxis.treatZeroAs = 1;
      valueAxis.value = 1;
      valueAxis.logarithmic=true
      valueAxis.startValue=1
      valueAxis.endValue = Math.pow(10,Math.ceil(Math.log10((this.props.chartData.maxValue / divideByBillion)))) ;
      valueAxis.min = 1;
      valueAxis.max = Math.pow(10,Math.ceil(Math.log10((this.props.chartData.maxValue / divideByBillion)))) ;
    } else if(this.props.chartData.isKdollar==="true") {
      valueAxis.min = 0;
      valueAxis.max = 150000/ 1000
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.disabled = true;
    }else if(this.props.chartData.isPercent==="true"){
      valueAxis.min = 0;
      valueAxis.max = 40;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.labels.template.disabled = true;
    }
    valueAxis.strictMinMax = true;
    valueAxis.numberFormatter.numberFormat = "'$'#";
    if (this.props.divId === 0) valueAxis.numberFormatter.numberFormat = "'$'#'B'";
    if (this.props.divId === 2) valueAxis.numberFormatter.numberFormat = "#'%'";
    if(this.props.chartData.isKdollar==="true") valueAxis.numberFormatter.numberFormat = "'$'#'K'"
    valueAxis.renderer.baseGrid.disabled = true;
   

    {
      var gradient = new am4core.LinearGradient();
      for (var i = 0; i <=2; ++i) {
        // add each color that makes up the gradient
        gradient.addColor(am4core.color(colors[i]));
      }
      if (logchart === "true") {
        this.createRange(
          valueAxis,
          1,
          Math.pow(10,Math.ceil(Math.log10((this.props.chartData.maxValue / divideByBillion)))) ,
          gradient
        );
      } else if(this.props.chartData.isKdollar==="true"){
        this.createRange(valueAxis, 0, 150, gradient);
      }else if(this.props.chartData.isPercent==="true"){
        this.createRange(valueAxis, 0, 40, gradient);
      }
    }
    const numberFormat = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumSignificantDigits: 3
    }).format(value);
    /* Create series */
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "value";
    series.dataFields.categoryY = "category";
    series.columns.template.fill = am4core.color("#44546A");
    series.columns.template.stroke = am4core.color("#44546A");
    series.columns.template.strokeWidth = 1;
    series.columns.template.strokeOpacity = 0.5;
    series.columns.template.height = am4core.percent(25);
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color("#0F1B2B");
    if(logchart==="true"){
      series.tooltipText = `
      ${this.props.chartData.value && `Country Value :${numberFormat(parseInt(this.props.chartData.value /  divideByBillion))}B`}
      ${this.props.chartData.value && `Global Median :${numberFormat(parseInt(this.props.chartData.median /  divideByBillion))}B`}
      ${this.props.chartData.value && `Global Average :${numberFormat(parseInt(this.props.chartData.average /  divideByBillion))}B`}
      `;
    }else if(this.props.chartData.isKdollar==="true"){
      series.tooltipText = `
      ${this.props.chartData.value && `Country Value :${numberFormat((this.props.chartData.value / 1000).toFixed(1))}K`}
      ${this.props.chartData.value && `Global Median :${numberFormat((this.props.chartData.median / 1000).toFixed(1))}K`}
      ${this.props.chartData.value && `Global Average :${numberFormat((this.props.chartData.average / 1000).toFixed(1))}K`}
      `;
    }else if(this.props.chartData.isPercent==="true"){
      series.tooltipText = `
      ${this.props.chartData.value && `Country Value :${((this.props.chartData.value ).toFixed(2))}%,`}
      ${this.props.chartData.value && `Global Median :${((this.props.chartData.median ).toFixed(2))}%`}
      ${this.props.chartData.value && `Global Average :${((this.props.chartData.average ).toFixed(2))}%`}
      `;
    }
    else{
      series.tooltipText = `
      ${this.props.chartData.value && `Country Value :${this.props.chartData.value}`}
      ${this.props.chartData.value && `Global Median :${this.props.chartData.median}`}
      ${this.props.chartData.value && `Global Average :${this.props.chartData.average}`}
      `;
    }
   

    var series2 = chart.series.push(new am4charts.StepLineSeries());
    series2.dataFields.valueX = "median";
    series2.dataFields.categoryY = "category";
    series2.strokeWidth = 15;
    series2.noRisers = true;
    series2.startLocation = 0.15;
    series2.endLocation = 0.85;
    // series2.tooltipText = "{valueX}";
    series2.stroke = am4core.color("#DCE1E3");

    var series3 = chart.series.push(new am4charts.StepLineSeries());
    series3.dataFields.valueX = "average";
    series3.dataFields.categoryY = "category";
    series3.strokeWidth = 15;
    series3.noRisers = true;
    series3.startLocation = 0.15;
    series3.endLocation = 0.85;
    // series3.tooltipText = "{valueX}";
    series3.stroke = am4core.color("#40659E");

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

    valueAxis.cursorTooltipEnabled = false;
    chart.arrangeTooltips = false;

    function createGrid(value) {
      var range = valueAxis.axisRanges.create();
      range.value = value;
      range.label.text = "{value}";
      range.axisFill.fillOpacity = 0.002;
      range.grid.strokeOpacity = 0;
    }
    if(this.props.chartData.isKdollar==="true") {
    createGrid(0);
    createGrid(25);
    createGrid(50);
    createGrid(75);
    createGrid(100);
    createGrid(125);
    createGrid(150);
    }
    if(this.props.chartData.isPercent==="true"){
    createGrid(0);
    createGrid(4);
    createGrid(8);
    createGrid(12);
    createGrid(16);
    createGrid(20);
    createGrid(24);
    createGrid(28);
    createGrid(32);
    createGrid(36);
    createGrid(40);
    }
  }

  render() {
    return (
      <div data-test="ChartBullet">
        <div
          className="chartdiv"
          id={`chartdiv1${this.props.divId}`}
          style={{ width: "100%", height: "120px" }}
        ></div>
      </div>
    );
  }
}

export default ChartBullet;
