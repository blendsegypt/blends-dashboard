import React from "react";
import { Row, Col } from "reactstrap";
import NewUsers from "../../ui-elements/cards/statistics/NewUsers";
import RevenueGenerated from "../../ui-elements/cards/statistics/RevenueGenerated";
import OrdersReceived from "../../ui-elements/cards/statistics/OrdersReceived";
import axios from "../../../axios";

import "../../../assets/scss/plugins/charts/apex-charts.scss";

class EcommerceDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: {
        today: 0,
        yesterday: 0,
        this_month: {
          total: 0,
          weeks: [0, 0, 0, 0],
        },
        previous_month: {
          total: 0,
          weeks: [0, 0, 0, 0],
        },
      },
      revenue: {
        today: "0 EGP",
        yesterday: "0 EGP",
        this_month: {
          total: 0,
          weeks: [0, 0, 0, 0],
        },
        previous_month: {
          total: 0,
          weeks: [0, 0, 0, 0],
        },
      },
      newUsers: {
        today: 0,
        yesterday: 0,
        this_month: {
          total: 0,
          weeks: [0, 0, 0, 0],
        },
        previous_month: {
          total: 0,
          weeks: [0, 0, 0, 0],
        },
      },
      appDownloads: {
        today: 0,
        yesterday: 0,
        this_month: {
          total: 0,
          weeks: [0, 0, 0, 0],
        },
        previous_month: {
          total: 0,
          weeks: [0, 0, 0, 0],
        },
      },
    };
  }
  async componentDidMount() {
    await this.getOrdersStats();
    await this.getRevenueStats();
    await this.getUsersStats();
  }
  getOrdersStats = async () => {
    try {
      const ordersStats = await axios.get("admin/statistics/delivered-orders");
      this.setState({
        orders: ordersStats.data.data,
      });
    } catch (error) {
      alert("An error occured while fetching order statistics!");
    }
  };
  getRevenueStats = async () => {
    try {
      const revenueStats = await axios.get("admin/statistics/revenue");
      this.setState({
        revenue: revenueStats.data.data,
      });
    } catch (error) {
      alert("An error occured while fetching revenue statistics!");
    }
  };
  getUsersStats = async () => {
    try {
      const usersStats = await axios.get("admin/statistics/created-users");
      this.setState({
        newUsers: usersStats.data.data,
      });
    } catch (error) {
      alert("An error occured while fetching users statistics!");
    }
  };
  render() {
    return (
      <React.Fragment>
        <Row style={{ marginLeft: 5 }}>
          <h2>Today</h2>
        </Row>
        {/* Today's Statistics */}
        <Row className="match-height">
          <Col lg="4" md="6" sm="6">
            <OrdersReceived orders={this.state.orders.today} />
          </Col>
          <Col lg="4" md="6" sm="6">
            <RevenueGenerated revenue={this.state.revenue.today} />
          </Col>
          <Col lg="4" md="6" sm="6">
            <NewUsers newUsers={this.state.newUsers.today} />
          </Col>
        </Row>
        <Row style={{ marginLeft: 5 }}>
          <h2>Yesterday</h2>
        </Row>
        {/* Yesterday's Statistics */}
        <Row className="match-height">
          <Col lg="4" md="6" sm="6">
            <OrdersReceived orders={this.state.orders.yesterday} />
          </Col>
          <Col lg="4" md="6" sm="6">
            <RevenueGenerated revenue={this.state.revenue.yesterday} />
          </Col>
          <Col lg="4" md="6" sm="6">
            <NewUsers newUsers={this.state.newUsers.yesterday} />
          </Col>
        </Row>
        <Row style={{ marginLeft: 5 }}>
          <h2>This Month</h2>
        </Row>
        {/* This Month's Statistics */}
        <Row className="match-height">
          <Col lg="4" md="6" sm="6">
            <OrdersReceived
              orders={this.state.orders.this_month.total}
              ordersGraphData={[
                {
                  name: "Orders(Week)",
                  data: this.state.orders.this_month.weeks,
                },
              ]}
            />
          </Col>
          <Col lg="4" md="6" sm="6">
            <RevenueGenerated
              revenue={this.state.revenue.this_month.total}
              revenueGraphData={[
                {
                  name: "Revenue(Week)",
                  data: this.state.revenue.this_month.weeks,
                },
              ]}
            />
          </Col>
          <Col lg="4" md="6" sm="6">
            <NewUsers
              newUsers={this.state.newUsers.this_month.total}
              newUsersGraphData={[
                {
                  name: "New Users (Week)",
                  data: this.state.newUsers.this_month.weeks,
                },
              ]}
            />
          </Col>
        </Row>
        <Row style={{ marginLeft: 5 }}>
          <h2>Last Month</h2>
        </Row>
        {/* Last Month's Statistics */}
        <Row className="match-height">
          <Col lg="4" md="6" sm="6">
            <OrdersReceived
              orders={this.state.orders.previous_month.total}
              ordersGraphData={[
                {
                  name: "Orders",
                  data: this.state.orders.previous_month.weeks,
                },
              ]}
            />
          </Col>
          <Col lg="4" md="6" sm="6">
            <RevenueGenerated
              revenue={this.state.revenue.previous_month.total}
              revenueGraphData={[
                {
                  name: "Revenue",
                  data: this.state.revenue.previous_month.weeks,
                },
              ]}
            />
          </Col>
          <Col lg="4" md="6" sm="6">
            <NewUsers
              newUsers={this.state.newUsers.previous_month.total}
              newUsersGraphData={[
                {
                  name: "New Users",
                  data: this.state.newUsers.previous_month.weeks,
                },
              ]}
            />
          </Col>
        </Row>
        <Row style={{ marginLeft: 5 }}>
          <h2>All Time</h2>
        </Row>
        {/* All time Statistics */}
        <Row className="match-height">
          <Col lg="4" md="6" sm="6">
            <OrdersReceived orders={this.state.orders.since_launch} />
          </Col>
          <Col lg="4" md="6" sm="6">
            <RevenueGenerated revenue={this.state.revenue.since_launch} />
          </Col>
          <Col lg="4" md="6" sm="6">
            <NewUsers newUsers={this.state.newUsers.since_launch} />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default EcommerceDashboard;
