import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Select from "react-select";
import axios from "../../../../axios";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

class DataListSidebar extends Component {
  state = {
    id: "",
    active: true,
    busy_threshold: 0,
    img: "",
    name: "",
    type: "type1",
    status: "open",
    max_parallel_orders: "",
    working_hours: [{}],
    Areas: [],
  };

  addNew = false;

  async componentDidMount() {
    try {
      const areasList = await axios.get("admin/areas");
      this.setState({
        areasList: areasList.data.data,
      });
    } catch (error) {
      alert("Error: Couldnt retrieve internal categories / " + error);
    }
  }

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
      if (this.props.data.working_hours !== prevState.working_hours) {
        this.setState({ working_hours: this.props.data.working_hours });
      }
      if (this.props.data.Areas !== prevState.Areas) {
        this.setState({ Areas: this.props.data.Areas });
      }
      if (this.props.data.busy_threshold !== prevState.busy_threshold) {
        this.setState({ busy_threshold: this.props.data.busy_threshold });
      }
      if (this.props.data.active !== prevState.active) {
        this.setState({ active: this.props.data.active });
      }
      if (
        this.props.data.max_parallel_orders !== prevState.max_parallel_orders
      ) {
        this.setState({
          max_parallel_orders: this.props.data.max_parallel_orders,
        });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        active: true,
        busy_threshold: 0,
        status: "open",
        name: "",
        type: "type1",
        max_parallel_orders: "",
        working_hours: [{}],
        Areas: [],
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        active: true,
        busy_threshold: 0,
        status: "open",
        name: "",
        type: "type1",
        max_parallel_orders: "",
        working_hours: [{}],
        Areas: [],
      });
    }
    this.addNew = false;
  }

  handleSubmit = async () => {
    let SupportedAreas = [];
    if (this.state.Areas !== null) {
      SupportedAreas = this.state.Areas.map((area) => {
        return area.id;
      });
    }
    const newBranch = {
      id: this.state.id,
      status: this.state.status,
      name: this.state.name,
      busy_threshold: this.state.busy_threshold,
      type: this.state.type,
      active: this.state.active,
      max_parallel_orders: Number(this.state.max_parallel_orders),
      working_hours: this.state.working_hours,
      SupportedAreas,
    };
    if (this.props.data !== null) {
      try {
        delete newBranch.working_hours[0].id;
        await axios.put(`admin/branches/${this.state.id}`, newBranch);
      } catch (error) {
        alert(error);
      }
    } else {
      try {
        delete newBranch.id;
        await axios.post(`admin/branches/`, newBranch);
      } catch (error) {
        alert(error);
      }
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
      working_hours,
      opens_at,
      closes_at,
      img,
      Areas,
      active,
      busy_threshold,
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
              <option value="type1">Dispatching Point</option>
              <option value="type2">type2</option>
              <option value="type3">type3</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="data-active">Active (In Service)</Label>
            <Input
              type="select"
              id="data-active"
              value={active}
              onChange={(e) => this.setState({ active: e.target.value })}
            >
              <option value={true}>Active</option>
              <option value={false}>Not Active</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Supported Areas</Label>
            <Select
              isMulti
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              closeMenuOnSelect={false}
              name="workingDays"
              value={Areas}
              options={this.state.areasList}
              className="React"
              classNamePrefix="select"
              onChange={(Areas) =>
                this.setState({
                  Areas,
                })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-status">Branch Status</Label>
            <Input
              type="select"
              id="data-status"
              value={status}
              onChange={(e) => this.setState({ status: e.target.value })}
            >
              <option value="open">Open</option>
              <option value="busy">Busy</option>
              <option value="closed">Closed</option>
              <option value="under_maintenance">Under Maintenance</option>
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
          <FormGroup>
            <Label for="data-popularity">Busy threshold (Orders)</Label>
            <Input
              type="number"
              value={busy_threshold}
              id="data-popularity"
              placeholder="0 - 100"
              onChange={(e) =>
                this.setState({ busy_threshold: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Working Days</Label>
            <Select
              isMulti
              getOptionLabel={(option) => option}
              getOptionValue={(option) => option}
              closeMenuOnSelect={false}
              name="workingDays"
              value={working_hours[0].days}
              options={weekDays}
              className="React"
              classNamePrefix="select"
              onChange={(days) =>
                this.setState({
                  working_hours: [{ ...this.state.working_hours[0], days }],
                })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Opens At</Label>
            <Input
              type="text"
              value={opens_at}
              placeholder="09:00"
              onChange={(e) =>
                this.setState({
                  working_hours: [
                    {
                      ...this.state.working_hours[0],
                      opens_at: e.target.value,
                    },
                  ],
                })
              }
              id="data-opens-at"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Closes At</Label>
            <Input
              type="text"
              value={closes_at}
              placeholder="15:00"
              onChange={(e) =>
                this.setState({
                  working_hours: [
                    {
                      ...this.state.working_hours[0],
                      closes_at: e.target.value,
                    },
                  ],
                })
              }
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
