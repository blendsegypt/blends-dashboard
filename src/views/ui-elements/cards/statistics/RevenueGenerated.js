import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { CreditCard } from "react-feather";
import { revenueGeneratedGraphOptions } from "./StatisticsData";

class RevenueGenerated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      revenueGeneratedToday: "220 EGP",
      newUsersGraphData: [
        {
          name: "Revenue",
          data: [10, 10, 10, 10],
        },
      ],
    };
  }
  render() {
    return (
      <StatisticsCard
        icon={<CreditCard className="success" size={22} />}
        iconBg="success"
        stat={this.state.revenueGeneratedToday}
        statTitle="Revenue Generated (Today)"
        options={revenueGeneratedGraphOptions}
        series={this.state.newUsersGraphData}
        type="area"
      />
    );
  }
}
export default RevenueGenerated;
