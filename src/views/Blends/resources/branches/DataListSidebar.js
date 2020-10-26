import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Select from "react-select";

const weekDays = [
  { value: "sun", label: "Sun" },
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
];

class DataListSidebar extends Component {
  state = {
    id: "",
    img: "",
    name: "",
    type: "",
    status: "Active",
    max_parallel_orders: "",
    working_days: [],
    opens_at: "",
    closes_at: "",
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.name !== prevState.name) {
        this.setState({ name: this.props.data.name });
      }
      if (this.props.data.type !== prevState.type) {
        this.setState({ type: this.props.data.type });
      }
      if (this.props.data.status !== prevState.status) {
        this.setState({ status: this.props.data.status });
      }
      if (this.props.data.opens_at !== prevState.opens_at) {
        this.setState({ opens_at: this.props.data.opens_at });
      }
      if (this.props.data.closes_at !== prevState.closes_at) {
        this.setState({ closes_at: this.props.data.closes_at });
      }
      if (this.props.data.working_days !== prevState.working_days) {
        this.setState({ working_days: this.props.data.working_days });
      }
      if (
        this.props.data.max_parallel_orders !== prevState.max_parallel_orders
      ) {
        this.setState({
          max_parallel_orders: this.props.data.max_parallel_orders,
        });
      }
      if (this.props.data.img !== prevState.img) {
        this.setState({ img: this.props.data.img });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        status: "Active",
        name: "",
        type: "",
        max_parallel_orders: "",
        working_days: [],
        opens_at: "",
        closes_at: "",
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        status: "Active",
        name: "",
        type: "",
        max_parallel_orders: "",
        working_days: [],
        opens_at: "",
        closes_at: "",
      });
    }
    this.addNew = false;
  }

  handleSubmit = (obj) => {
    if (this.props.data !== null) {
      //this.props.updateData(obj);
    } else {
      //this.addNew = true;
      //this.props.addData(obj);
    }
    //let params = Object.keys(this.props.dataParams).length
    //  ? this.props.dataParams
    //  : { page: 1, perPage: 4 };
    this.props.handleSidebar(false, true);
    //this.props.getData(params);
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let {
      name,
      status,
      type,
      max_parallel_orders,
      working_days,
      opens_at,
      closes_at,
      img,
    } = this.state;
    return (
      <div
        className={classnames("data-list-sidebar", {
          show: show,
        })}
      >
        <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
          <h4>{data !== null ? "UPDATE DATA" : "ADD NEW DATA"}</h4>
          <X size={20} onClick={() => handleSidebar(false, true)} />
        </div>
        <PerfectScrollbar
          className="data-list-fields px-2 mt-3"
          options={{ wheelPropagation: false }}
        >
          {this.props.thumbView && img.length ? (
            <FormGroup className="text-center">
              <img className="img-fluid" src={img} alt={name} />
              <div className="d-flex flex-wrap justify-content-between mt-2">
                <label
                  className="btn btn-flat-primary"
                  htmlFor="update-image"
                  color="primary"
                >
                  Upload Image
                  <input
                    type="file"
                    id="update-image"
                    hidden
                    onChange={(e) =>
                      this.setState({
                        img: URL.createObjectURL(e.target.files[0]),
                      })
                    }
                  />
                </label>
                <Button
                  color="flat-danger"
                  onClick={() => this.setState({ img: "" })}
                >
                  Remove Image
                </Button>
              </div>
            </FormGroup>
          ) : null}
          <FormGroup>
            <Label for="data-name">Branch Name</Label>
            <Input
              type="text"
              value={name}
              placeholder=""
              onChange={(e) => this.setState({ name: e.target.value })}
              id="data-name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-category">Type</Label>
            <Input
              type="select"
              id="data-category"
              value={type}
              onChange={(e) => this.setState({ type: e.target.value })}
            >
              <option>Dispatching Point</option>
              <option>Cafe</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="data-status">Branch Status</Label>
            <Input
              type="select"
              id="data-status"
              value={status}
              onChange={(e) => this.setState({ status: e.target.value })}
            >
              <option>Active</option>
              <option>Busy</option>
              <option>Closed</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Maximum Parallel Orders</Label>
            <Input
              type="number"
              value={max_parallel_orders}
              id="data-popularity"
              placeholder="0 - 100"
              onChange={(e) =>
                this.setState({ max_parallel_orders: e.target.value })
              }
            />
          </FormGroup>
          {data === null ? (
            <FormGroup>
              <Label for="data-popularity">Working Days</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                name="workingDays"
                options={weekDays}
                className="React"
                classNamePrefix="select"
              />
            </FormGroup>
          ) : (
            <FormGroup>
              <Label for="data-popularity">Working Days</Label>
              {working_days.length > 0 && (
                <Select
                  isMulti
                  defaultValue={working_days}
                  closeMenuOnSelect={false}
                  name="workingDays"
                  options={weekDays}
                  className="React"
                  classNamePrefix="select"
                />
              )}
            </FormGroup>
          )}
          <FormGroup>
            <Label for="data-popularity">Opens At</Label>
            <Input
              type="text"
              value={opens_at}
              placeholder="09:00"
              onChange={(e) => this.setState({ opens_at: e.target.value })}
              id="data-opens-at"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Closes At</Label>
            <Input
              type="text"
              value={closes_at}
              placeholder="15:00"
              onChange={(e) => this.setState({ closes_at: e.target.value })}
              id="data-closes-at"
            />
          </FormGroup>
          {this.props.thumbView && img.length <= 0 ? (
            <label
              className="btn btn-primary"
              htmlFor="upload-image"
              color="primary"
            >
              Upload Image
              <input
                type="file"
                id="upload-image"
                hidden
                onChange={(e) =>
                  this.setState({ img: URL.createObjectURL(e.target.files[0]) })
                }
              />
            </label>
          ) : null}
        </PerfectScrollbar>
        <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
          <Button color="primary" onClick={() => this.handleSubmit(this.state)}>
            {data !== null ? "Update" : "Submit"}
          </Button>
          <Button
            className="ml-1"
            color="danger"
            outline
            onClick={() => handleSidebar(false, true)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}
export default DataListSidebar;
