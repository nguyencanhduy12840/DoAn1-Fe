import React, { Component } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface DonutProps {
  series: number[];
  labels: string[];
}

type DonutState = {
  options: ApexOptions;
};

class Donut extends Component<DonutProps, DonutState> {
  constructor(props: DonutProps) {
    super(props);
    this.state = {
      options: {
        chart: { type: "donut" },
        labels: props.labels,
      },
    };
  }

  componentDidUpdate(prevProps: DonutProps) {
    if (prevProps.labels !== this.props.labels) {
      this.setState((prevState) => ({
        options: {
          ...prevState.options,
          labels: this.props.labels,
        },
      }));
    }
  }

  render() {
    const { series } = this.props;

    if (!series?.length || !this.state.options.labels?.length) {
      return <div>No data provided for the chart</div>;
    }

    return (
      <div className="card bg-base-100 shadow-md border border-base-200 rounded-xl h-[360px]">
        <div className="card-body items-center justify-between">
          <h2 className="text-center font-semibold text-lg">
            Revenue by Category (USD)
          </h2>
          <div className="flex-grow flex items-center justify-center">
            <Chart
              options={this.state.options}
              series={series}
              type="donut"
              height={300}
              width={300}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Donut;
