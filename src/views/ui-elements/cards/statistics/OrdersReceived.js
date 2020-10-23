import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Package } from "react-feather";
import { ordersReceived } from "./StatisticsData";

class OrdersReceived extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideChart: true,
      orders: 0,
      ordersGraphData: [],
    };
  }
  componentDidMount() {
    this.setState({ orders: this.props.orders });
    if (this.props.ordersGraphData) {
      this.setState({
        ordersGraphData: this.props.ordersGraphData,
        hideChart: false,
      });
    }
  }
  render() {
    return (
      <StatisticsCard
        icon={<Package className="warning" size={22} />}
        iconBg="warning"
        stat={this.state.orders}
        statTitle="Orders Received"
        options={ordersReceived}
        series={this.state.ordersGraphData}
        type="area"
        hideChart={this.state.hideChart}
      />
    );
  }
}
export default OrdersReceived;
