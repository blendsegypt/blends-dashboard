import React from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { User } from "react-feather";
import AccountTab from "./Account";
import "../../../../../assets/scss/pages/users.scss";
class UserEdit extends React.Component {
  state = {
    user: {},
    addNew: false,
    activeTab: "1",
  };

  componentDidMount() {
    const user = this.props.history.location.state;
    if (user.addNew) {
      this.setState({ addNew: true });
      return;
    }
    this.setState({
      user,
    });
  }

  toggle = (tab) => {
    this.setState({
      activeTab: tab,
    });
  };
  render() {
    return (
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: "1",
                    })}
                  >
                    <User size={16} />
                    <span className="align-middle ml-50">Account</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <AccountTab
                    user={this.state.user}
                    addNew={this.state.addNew}
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default UserEdit;
