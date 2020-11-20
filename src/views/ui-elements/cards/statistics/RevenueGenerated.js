import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { CreditCard } from "react-feather";
import { revenueGeneratedGraphOptions } from "./StatisticsData";

class RevenueGenerated extends React.Component {
  render() {
    return (
      <StatisticsCard
        icon={<CreditCard className="success" size={22} />}
        iconBg="success"
        stat={this.props.revenue + " EGP"}
        statTitle="Revenue Generated"
        options={revenueGeneratedGraphOptions}
        series={this.props.revenueGraphData}
        type="area"
        hideChart={this.props.revenueGraphData ? false : true}
      />
    );
  }
}
export default RevenueGenerated;
