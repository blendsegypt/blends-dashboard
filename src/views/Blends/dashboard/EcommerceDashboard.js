import React from "react";
import { Row, Col } from "reactstrap";
import NewUsers from "../../ui-elements/cards/statistics/NewUsers";
import RevenueGenerated from "../../ui-elements/cards/statistics/RevenueGenerated";
import AppDownloads from "../../ui-elements/cards/statistics/AppDownloads";
import OrdersReceived from "../../ui-elements/cards/statistics/OrdersReceived";

import "../../../assets/scss/plugins/charts/apex-charts.scss";

class EcommerceDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: {
        today: 4,
        yesterday: 19,
        thisMonth: {
          value: 232,
          series: [40, 50, 20, 82],
        },
        lastMonth: {
          value: 424,
          series: [50, 144, 102, 130],
        },
      },
      revenue: {
        today: "232 EGP",
        yesterday: "923 EGP",
        thisMonth: {
          value: 2499,
          series: [300, 242, 502, 1023],
        },
        lastMonth: {
          value: 1992,
          series: [230, 144, 420, 310],
        },
      },
      newUsers: {
        today: 3,
        yesterday: 1,
        thisMonth: {
          value: 42,
          series: [12, 10, 8, 12],
        },
        lastMonth: {
          value: 34,
          series: [10, 9, 12, 3],
        },
      },
      appDownloads: {
        today: 8,
        yesterday: 4,
        thisMonth: {
          value: 32,
          series: [2, 14, 5, 9],
        },
        lastMonth: {
          value: 53,
          series: [3, 23, 14, 9],
        },
      },
    };
  }
  render() {
    return (
      <React.Fragment>
        <Row style={{ marginLeft: 5 }}>
          <h2>Today</h2>
        </Row>
        {/* Today's Statistics */}
        <Row className="match-height">
          <Col lg="3" md="6" sm="6">
            <OrdersReceived orders={this.state.orders.today} />
          </Col>
          <Col lg="3" md="6" sm="6">
            <RevenueGenerated revenue={this.state.revenue.today} />
          </Col>
          <Col lg="3" md="6" sm="6">
            <NewUsers newUsers={this.state.newUsers.today} />
          </Col>
          <Col lg="3" md="6" sm="6">
            <AppDownloads appDownloads={this.state.appDownloads.today} />
          </Col>
        </Row>
        <Row style={{ marginLeft: 5 }}>
          <h2>Yesterday</h2>
        </Row>
        {/* Yesterday's Statistics */}
        <Row className="match-height">
          <Col lg="3" md="6" sm="6">
            <OrdersReceived orders={this.state.orders.yesterday} />
          </Col>
          <Col lg="3" md="6" sm="6">
            <RevenueGenerated revenue={this.state.revenue.yesterday} />
          </Col>
          <Col lg="3" md="6" sm="6">
            <NewUsers newUsers={this.state.newUsers.yesterday} />
          </Col>
          <Col lg="3" md="6" sm="6">
            <AppDownloads appDownloads={this.state.appDownloads.yesterday} />
          </Col>
        </Row>
        <Row style={{ marginLeft: 5 }}>
          <h2>This Month (March)</h2>
        </Row>
        {/* This Month's Statistics */}
        <Row className="match-height">
          <Col lg="3" md="6" sm="6">
            <OrdersReceived
              orders={this.state.orders.lastMonth.value}
              ordersGraphData={[
                {
                  name: "Orders(Week)",
                  data: this.state.orders.lastMonth.series,
                },
              ]}
            />
          </Col>
          <Col lg="3" md="6" sm="6">
            <RevenueGenerated
              revenue={this.state.revenue.lastMonth.value}
              revenueGraphData={[
                {
                  name: "Revenue(Week)",
                  data: this.state.revenue.lastMonth.series,
                },
              ]}
            />
          </Col>
          <Col lg="3" md="6" sm="6">
            <NewUsers
              newUsers={this.state.newUsers.lastMonth.value}
              newUsersGraphData={[
                {
                  name: "New Users (Week)",
                  data: this.state.newUsers.lastMonth.series,
                },
              ]}
            />
          </Col>
          <Col lg="3" md="6" sm="6">
            <AppDownloads
              appDownloads={this.state.appDownloads.lastMonth.value}
              appDownloadsGraphData={[
                {
                  name: "App Downloads (Week)",
                  data: this.state.appDownloads.lastMonth.series,
                },
              ]}
            />
          </Col>
        </Row>
        <Row style={{ marginLeft: 5 }}>
          <h2>Last Month (February)</h2>
        </Row>
        {/* Last Month's Statistics */}
        <Row className="match-height">
          <Col lg="3" md="6" sm="6">
            <OrdersReceived
              orders={this.state.orders.thisMonth.value}
              ordersGraphData={[
                { name: "Orders", data: this.state.orders.thisMonth.series },
              ]}
            />
          </Col>
          <Col lg="3" md="6" sm="6">
            <RevenueGenerated
              revenue={this.state.revenue.thisMonth.value}
              revenueGraphData={[
                { name: "Revenue", data: this.state.revenue.thisMonth.series },
              ]}
            />
          </Col>
          <Col lg="3" md="6" sm="6">
            <NewUsers
              newUsers={this.state.newUsers.thisMonth.value}
              newUsersGraphData={[
                {
                  name: "New Users",
                  data: this.state.newUsers.thisMonth.series,
                },
              ]}
            />
          </Col>
          <Col lg="3" md="6" sm="6">
            <AppDownloads
              appDownloads={this.state.appDownloads.thisMonth.value}
              appDownloadsGraphData={[
                {
                  name: "App Downloads",
                  data: this.state.appDownloads.thisMonth.series,
                },
              ]}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default EcommerceDashboard;
