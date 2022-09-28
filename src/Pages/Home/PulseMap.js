import React, { Component } from "react";
//import logo from './logo.svg';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";

//import * as am4charts from "@amcharts/amcharts4/charts";

import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
//import am4geodata_data_countries2 from "@amcharts/amcharts4-geodata/data/countries2";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);
class PulseMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minCol: "#fe9d5d",
      maxCol: "#6db5e1",
      mapData: [],
      gdpData: [],
      eobData: [],
      lfData: this.props.activePulseTabContent||[],
      mapDataLegend: "",
    };
  }

  componentDidMount() {
    // Create map instance
    am4core.addLicense("MP281496465");
    let chart = am4core.create("chartdiv", am4maps.MapChart);
    
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText ="{name}: ${value.value.formatNumber('#.0a')}";
    if(this.props.activePulseTab==="unemployment") polygonTemplate.tooltipText ="{name}: {value.value.formatNumber('#.0')}%";
    if(this.props.activePulseTab==="easeOfDoingBusiness") polygonTemplate.tooltipText = "{name}: {value.value.formatNumber('#.0')}";
    
    if(this.props.activePulseTab==="gdp"||this.props.activePulseTab==="easeOfDoingBusiness"){
      polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: am4core.color(this.state.minCol),
        max: am4core.color(this.state.maxCol),
      });
    }
    
    if(this.props.activePulseTab==="unemployment") {
      polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: am4core.color(this.state.maxCol),
        max: am4core.color(this.state.minCol),
      });
      
    }
    
    // polygonSeries.tooltip.adapter.add("disabled", function(disabled, target) {
    //   // alternatively use this:
    //   console.log("target",target.dataItem.values.value.value);
    //   if ( target.dataItem.values.value.value === undefined) {
    //     return true;
    //   }
    //   return disabled;
    // });
    polygonSeries.useGeodata = true;
    polygonSeries.exclude = ["AQ"];
    // add heat legend
    var heatLegend = chart.chartContainer.createChild(am4maps.HeatLegend);
    heatLegend.valign = "bottom";
    heatLegend.align = "left";
    heatLegend.width = am4core.percent(100);
    heatLegend.series = polygonSeries;
    heatLegend.orientation = "horizontal";
    heatLegend.padding(20, 20, 20, 20);
    heatLegend.valueAxis.renderer.labels.template.fontSize = 10;
    heatLegend.valueAxis.renderer.minGridDistance = 40;
    heatLegend.minValue = 0;
    heatLegend.markerContainer.height = 2
    if(this.props.activePulseTab==="gdp") {
      heatLegend.maxValue=150
      heatLegend.numberFormatter.numberFormat = "'$'#a'"
    }
    if(this.props.activePulseTab==="easeOfDoingBusiness") {
      heatLegend.minValue = 20;
      heatLegend.maxValue=85
      heatLegend.numberFormatter.numberFormat = "#"
    }
    if(this.props.activePulseTab==="unemployment") {
      heatLegend.maxValue=20
      heatLegend.numberFormatter.numberFormat = "#'%'"
    }

    if(this.props.activePulseTab==="unemployment")  heatLegend.numberFormatter.numberFormat = "#'%'"
    polygonSeries.mapPolygons.template.events.on("over", (event) => {
      if(this.props.activePulseTab==="gdp"){
      handleHover(event.target,1000);
      }
      if(this.props.activePulseTab==="unemployment"){
        handleHover(event.target,1);
        }
        if(this.props.activePulseTab==="easeOfDoingBusiness"){
          handleHover(event.target,1);
          }

    });

    polygonSeries.mapPolygons.template.events.on("hit", (event) => {
      handleHover(event.target);
    });

    function handleHover(mapPolygon,divide) {
      if (!isNaN(mapPolygon.dataItem.value)) {
        heatLegend.valueAxis.showTooltipAt((mapPolygon.dataItem.value/ divide));
      } else {
        heatLegend.valueAxis.hideTooltip();
      }
    }
    
    polygonSeries.mapPolygons.template.strokeOpacity = 0.4;
    polygonSeries.mapPolygons.template.events.on("out", (event) => {
      heatLegend.valueAxis.hideTooltip();
    });

    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.valign = "bottom";

    polygonSeries.data = this.state.lfData;
    // Zoom control
    chart.zoomControl = new am4maps.ZoomControl();

    let homeButton = new am4core.Button();
    homeButton.events.on("hit", function () {
      polygonSeries.show();
      // countrySeries.hide();
      chart.goHome();
    });

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path =
      "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.marginBottom = 3;
    chart.zoomControl.marginBottom=60
    chart.zoomControl.marginLeft=60
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);
    chart.homeZoomLevel =1
     chart.homeGeoPoint = {
       latitude: 15,
     longitude: 11
     };
    this.chart = chart;
  }
  
  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() 
  
  {
    am4core.addLicense("CH281496465");
    return (
      <div id="chartdiv" style={{ width: "600px", height: "600px" }}></div>
    );
  }
}

export default PulseMap;
