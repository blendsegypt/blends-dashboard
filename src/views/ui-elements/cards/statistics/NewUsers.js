import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Users } from "react-feather";
import { newUsersGraphOptions } from "./StatisticsData";

class NewUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideChart: true,
      newUsers: 0,
      newUsersGraphData: [],
    };
  }
  componentDidMount() {
    this.setState({ newUsers: this.props.newUsers });
    if (this.props.newUsersGraphData) {
      this.setState({
        newUsersGraphData: this.props.newUsersGraphData,
        hideChart: false,
      });
    }
  }
  render() {
    return (
      <StatisticsCard
        icon={<Users color="#7367f0" size={22} />}
        iconBg="secondary"
        stat={this.state.newUsers}
        statTitle="New Users"
        options={newUsersGraphOptions}
        series={this.state.newUsersGraphData}
        type="area"
        hideChart={this.state.hideChart}
      />
    );
  }
}
export default NewUsers;
