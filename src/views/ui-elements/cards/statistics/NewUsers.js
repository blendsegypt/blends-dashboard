import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Users } from "react-feather";
import { newUsersGraphOptions } from "./StatisticsData";

class NewUsers extends React.Component {
  render() {
    return (
      <StatisticsCard
        icon={<Users color="#7367f0" size={22} />}
        iconBg="secondary"
        stat={this.props.newUsers}
        statTitle="New Users"
        options={newUsersGraphOptions}
        series={this.props.newUsersGraphData}
        type="area"
        hideChart={this.props.newUsersGraphData ? false : true}
      />
    );
  }
}
export default NewUsers;
