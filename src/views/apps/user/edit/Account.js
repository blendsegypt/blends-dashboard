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
class UserAccountTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dob: new Date(),
    };
  }
  render() {
    return (
      <Row>
        <Col sm="12">
          <Media className="mb-2">
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                Khalid Khalil
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
                    defaultValue="Khalid"
                    id="firstName"
                    placeholder="First Name"
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="lastname">Last Name</Label>
                  <Input
                    type="text"
                    defaultValue="Khalil"
                    id="lastname"
                    placeholder="Last Name"
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="phonenumber">Phone Number</Label>
                  <Input
                    type="text"
                    defaultValue="01149050646"
                    id="phonenumber"
                    placeholder="Phone Number"
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="phonenumberstatus">Phone Number Status</Label>
                  <Input type="select" name="status" id="status">
                    <option>Verified</option>
                    <option>Non-Verified</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="text"
                    defaultValue=""
                    id="email"
                    placeholder="Email"
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="emailstatus">Email Status</Label>
                  <Input type="select" name="status" id="status">
                    <option>Non-Verified</option>
                    <option>Verified</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="company">Data of Birth</Label>
                  <Flatpickr
                    className="form-control"
                    value={this.state.dob}
                    onChange={(date) => {
                      this.setState({ dob: date });
                    }}
                  />
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
                        defaultChecked
                      />{" "}
                      Male
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input type="radio" name="gender" value="female" /> Female
                    </Label>
                  </FormGroup>
                </FormGroup>
              </Col>
              <Col
                className="d-flex justify-content-end flex-wrap mt-2"
                sm="12"
              >
                <Button.Ripple className="mr-1" color="primary">
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
