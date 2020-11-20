import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Package } from "react-feather";
import { ordersReceived } from "./StatisticsData";

class OrdersReceived extends React.Component {
  render() {
    return (
      <StatisticsCard
        icon={<Package className="warning" size={22} />}
        iconBg="warning"
        stat={this.props.orders}
        statTitle="Delivered Orders"
        options={ordersReceived}
        series={this.props.ordersGraphData}
        type="area"
        hideChart={this.props.ordersGraphData ? false : true}
      />
    );
  }
}
export default OrdersReceived;
