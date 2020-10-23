import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Users } from "react-feather";
import { newUsersGraphOptions } from "./StatisticsData";

class NewUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsersThisMonth: 32,
      newUsersGraphData: [
        {
          name: "New Users (Week)",
          data: [10, 11, 0, 0],
        },
      ],
    };
  }
  render() {
    return (
      <StatisticsCard
        icon={<Users className="primary" size={22} />}
        stat={this.state.newUsersThisMonth}
        statTitle="New Users (This Month)"
        options={newUsersGraphOptions}
        series={this.state.newUsersGraphData}
        type="area"
      />
    );
  }
}
export default NewUsers;
