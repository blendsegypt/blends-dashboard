import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Button,
  TabContent,
  CardBody,
} from "reactstrap";
import loginImg from "../../../../assets/img/pages/login.png";
import logo from "../../../../assets/img/logo/blends.png";
import "../../../../assets/scss/pages/authentication.scss";
import { loginWithJWT } from "../../../../redux/actions/auth/loginActions";
import { connect } from "react-redux";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
  };

  onSubmit = () => {
    const { email, password } = this.state;
    this.props.login(email, password);
  };
  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-1 py-0"
              >
                <img src={loginImg} alt="loginImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2 login-tabs-container">
                  <CardHeader className="pb-1">
                    <CardTitle>
                      <img
                        src={logo}
                        alt="loginImg"
                        style={{ marginTop: "30px" }}
                      />
                      <h4 className="mb-0" style={{ marginTop: "40px" }}>
                        Login
                      </h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                    Welcome back, please login to your account.
                  </p>
                  <CardBody className="pt-1 pb-0">
                    <FormGroup className="form-label-group">
                      <Input
                        type="text"
                        placeholder="Email"
                        required
                        value={this.state.email}
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            email: e.target.value,
                          })
                        }
                      />
                      <Label>Email</Label>
                    </FormGroup>
                    <FormGroup className="form-label-group">
                      <Input
                        type="password"
                        placeholder="Password"
                        required
                        value={this.state.password}
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            password: e.target.value,
                          })
                        }
                      />
                      <Label>Password</Label>
                    </FormGroup>
                    <Button
                      color="primary"
                      className="ml-1"
                      onClick={this.onSubmit}
                    >
                      Login
                    </Button>
                  </CardBody>
                  <TabContent activeTab={this.state.activeTab}></TabContent>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (email, password) => dispatch(loginWithJWT(email, password)),
});

export default connect(null, mapDispatchToProps)(Login);
