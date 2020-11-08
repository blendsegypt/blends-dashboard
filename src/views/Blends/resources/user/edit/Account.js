import React from "react";
import {
  Media,
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import axios from "../../../../../axios";
import { history } from "../../../../../history";
import "../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import SweetAlert from "react-bootstrap-sweetalert";
import "flatpickr/dist/themes/light.css";
import bcrypt, { hash } from "bcryptjs";

class UserAccountTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      addNew: false,
      successAlert: false,
      noChangeAlert: false,
      errorAlert: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      Object.keys(prevProps.user).length === 0 &&
      Object.keys(this.props.user).length > 0
    ) {
      this.setState({ user: this.props.user });
    }
    if (prevProps.addNew !== this.props.addNew) {
      const newUser = {
        first_name: "",
        last_name: "",
        dob: null,
        gender: "male",
        email: "",
        email_verified: false,
        phone_number: "",
        platform: "other",
        password_hash: "HASH3",
        password_salt: "SALT3",
      };
      this.setState({ addNew: true, user: newUser });
      console.log("adding new");
    }
  }

  updateUser = async () => {
    const oldUser = this.props.user;
    const newUser = Object.assign({}, this.state.user);
    if (oldUser.first_name === newUser.first_name) {
      delete newUser.first_name;
    }
    if (oldUser.last_name === newUser.last_name) {
      delete newUser.last_name;
    }
    if (oldUser.gender === newUser.gender) {
      delete newUser.gender;
    }
    if (oldUser.dob === newUser.dob) {
      delete newUser.dob;
    }
    if (oldUser.email === newUser.email) {
      delete newUser.email;
    }
    if (oldUser.email_verified === newUser.email_verified) {
      delete newUser.email_verified;
    }
    if (oldUser.phone_number === newUser.phone_number) {
      delete newUser.phone_number;
    }
    delete newUser.platform;
    delete newUser.password_hash;
    delete newUser.password_salt;
    delete newUser.createdAt;
    delete newUser.updatedAt;
    delete newUser.id;

    if (Object.keys(newUser).length === 0) {
      //Nothing changed
      this.setState({ noChangeAlert: true });
    }

    try {
      await axios.put(`admin/users/${this.state.user.id}`, newUser);
      this.setState({
        successAlert: true,
        successMessage: "User updated Successfully!",
      });
    } catch (error) {
      this.setState({
        errorAlert: true,
        errorMessage: `${error}`,
      });
    }
  };

  hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return {
      salt,
      hash,
    };
  };

  createUser = async () => {
    const user = Object.assign({}, this.state.user);
    if (user.password !== user.password_confirmation) {
      this.setState({
        errorAlert: true,
        errorMessage: "Password doesn't match password confirmation",
      });
      return;
    } else if (user.phone_number === "") {
      this.setState({
        errorAlert: true,
        errorMessage: "Phone number is mandatory!",
      });
      return;
    }
    const hashObject = this.hashPassword(user.password);
    delete user.password;
    delete user.password_confirmation;
    user.password_hash = hashObject.hash;
    user.password_salt = hashObject.salt;

    try {
      await axios.post(`admin/users`, user);
      this.setState({
        successAlert: true,
        successMessage: "User created succesfully!",
      });
    } catch (error) {
      this.setState({
        errorAlert: true,
        errorMessage: `Error: ${error}`,
      });
    }
  };

  render() {
    const {
      first_name,
      last_name,
      dob,
      gender,
      email,
      email_verified,
      phone_number,
    } = this.state.user;
    let oldUser;
    if (this.state.addNew) {
      oldUser = {
        first_name: "",
        last_name: "",
        dob: null,
        gender: "male",
        email: "",
        email_verified: false,
        phone_number: "",
      };
    } else {
      oldUser = this.props.user;
    }
    return (
      <Row>
        <SweetAlert
          success
          title="Success"
          show={this.state.successAlert}
          onConfirm={() => history.push("/app/user/list")}
        >
          <p className="sweet-alert-text">{this.state.successMessage}</p>
        </SweetAlert>
        <SweetAlert
          danger
          title="Error"
          show={this.state.errorAlert}
          onConfirm={() => {
            this.setState({ errorAlert: false });
          }}
        >
          <p className="sweet-alert-text">{this.state.errorMessage}</p>
        </SweetAlert>
        <SweetAlert
          warning
          title="No Changes"
          show={this.state.noChangeAlert}
          onConfirm={() => history.push("/app/user/list")}
        >
          <p className="sweet-alert-text">You changed nothing!</p>
        </SweetAlert>
        <Col sm="12">
          <Media className="mb-2">
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                {first_name} {last_name}
              </Media>
            </Media>
          </Media>
        </Col>
        <Col sm="12">
          <Form onSubmit={(e) => e.preventDefault()}>
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="firstname">First Name</Label>
                  <Input
                    type="text"
                    style={
                      first_name !== oldUser.first_name
                        ? { borderColor: "#ffc34a" }
                        : {}
                    }
                    value={first_name}
                    id="firstName"
                    placeholder="First Name *"
                    onChange={(e) =>
                      this.setState({
                        user: {
                          ...this.state.user,
                          first_name: e.target.value,
                        },
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="lastname">Last Name</Label>
                  <Input
                    type="text"
                    style={
                      last_name !== oldUser.last_name
                        ? { borderColor: "#ffc34a" }
                        : {}
                    }
                    value={last_name}
                    id="lastname"
                    placeholder="Last Name *"
                    onChange={(e) =>
                      this.setState({
                        user: {
                          ...this.state.user,
                          last_name: e.target.value,
                        },
                      })
                    }
                  />
                </FormGroup>
              </Col>
              {this.state.addNew && (
                <>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="phonenumber">Password</Label>
                      <Input
                        type="password"
                        id="phonenumber"
                        placeholder="Password *"
                        onChange={(e) =>
                          this.setState({
                            user: {
                              ...this.state.user,
                              password: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="phonenumber">Password Confirmation</Label>
                      <Input
                        type="password"
                        id="phonenumber"
                        placeholder="Password Confirmation *"
                        onChange={(e) =>
                          this.setState({
                            user: {
                              ...this.state.user,
                              password_confirmation: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                </>
              )}
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="phonenumber">Phone Number</Label>
                  <Input
                    type="text"
                    style={
                      phone_number !== oldUser.phone_number
                        ? { borderColor: "#ffc34a" }
                        : {}
                    }
                    value={phone_number}
                    id="phonenumber"
                    placeholder="Phone Number *"
                    onChange={(e) =>
                      this.setState({
                        user: {
                          ...this.state.user,
                          phone_number: e.target.value,
                        },
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="text"
                    style={
                      email !== oldUser.email ? { borderColor: "#ffc34a" } : {}
                    }
                    value={email}
                    id="email"
                    placeholder="Email"
                    onChange={(e) =>
                      this.setState({
                        user: {
                          ...this.state.user,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="company">Data of Birth</Label>
                  <Flatpickr
                    className="form-control"
                    style={
                      dob !== oldUser.dob ? { borderColor: "#ffc34a" } : {}
                    }
                    value={dob}
                    onChange={(date) =>
                      this.setState({
                        user: {
                          ...this.state.user,
                          dob: date[0],
                        },
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="emailstatus">Email Status</Label>
                  <Input
                    type="select"
                    style={
                      email_verified !== oldUser.email_verified
                        ? { borderColor: "#ffc34a" }
                        : {}
                    }
                    name="status"
                    id="status"
                    value={email_verified}
                    onChange={(e) =>
                      this.setState({
                        user: {
                          ...this.state.user,
                          email_verified: e.target.value,
                        },
                      })
                    }
                  >
                    <option value={true}>Verified</option>
                    <option value={false}>Non-Verified</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <FormGroup check inline>
                    <Label for="company">Gender</Label>
                    <Label check>
                      <Input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === "male" ? true : false}
                        onChange={(e) =>
                          this.setState({
                            user: { ...this.state.user, gender: "male" },
                          })
                        }
                      />{" "}
                      Male
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === "female" ? true : false}
                        onChange={(e) =>
                          this.setState({
                            user: { ...this.state.user, gender: "female" },
                          })
                        }
                      />{" "}
                      Female
                    </Label>
                  </FormGroup>
                </FormGroup>
              </Col>
              <Col
                className="d-flex justify-content-end flex-wrap mt-2"
                sm="12"
              >
                <Button.Ripple
                  className="mr-1"
                  color="primary"
                  onClick={async () => {
                    if (this.state.addNew) {
                      await this.createUser();
                    } else {
                      await this.updateUser();
                    }
                  }}
                >
                  Save Changes
                </Button.Ripple>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    );
  }
}
export default UserAccountTab;
