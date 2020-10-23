import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { CreditCard } from "react-feather";
import { revenueGeneratedGraphOptions } from "./StatisticsData";

class RevenueGenerated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideChart: true,
      revenue: 0,
      revenueGraphData: [],
    };
  }
  componentDidMount() {
    this.setState({ revenue: this.props.revenue });
    if (this.props.revenueGraphData) {
      this.setState({
        revenueGraphData: this.props.revenueGraphData,
        hideChart: false,
      });
    }
  }
  render() {
    return (
      <StatisticsCard
        icon={<CreditCard className="success" size={22} />}
        iconBg="success"
        stat={this.state.revenue}
        statTitle="Revenue Generated"
        options={revenueGeneratedGraphOptions}
        series={this.state.revenueGraphData}
        type="area"
        hideChart={this.state.hideChart}
      />
    );
  }
}
export default RevenueGenerated;
