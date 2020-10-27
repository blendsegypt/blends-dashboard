import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import { Plus, Minus } from "react-feather";

class DataListSidebar extends Component {
  state = {
    id: "",
    label: "",
    mandatory: false,
    active: false,
    options: [],
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.label !== prevState.label) {
        this.setState({ label: this.props.data.label });
      }
      if (this.props.data.mandatory !== prevState.mandatory) {
        this.setState({ mandatory: this.props.data.mandatory });
      }
      if (this.props.data.active !== prevState.active) {
        this.setState({ active: this.props.data.active });
      }
      if (this.props.data.options !== prevState.options) {
        this.setState({ options: this.props.data.options });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        label: "",
        mandatory: false,
        active: false,
        options: [],
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        label: "",
        mandatory: false,
        active: false,
        options: [],
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

  // Custom Options sub-options

  addOption = () => {
    const newOptions = this.state.options.concat({ label: "", price: "" });
    this.setState({
      options: newOptions,
    });
  };

  editOption = (label, price, index) => {
    const newOptions = this.state.options.map((option, optionIndex) => {
      if (optionIndex === index) {
        return {
          label,
          price,
        };
      }
      return option;
    });
    this.setState({
      options: newOptions,
    });
    console.log(newOptions);
  };

  removeOption = () => {
    const newOptions = this.state.options.slice(
      0,
      this.state.options.length - 1
    );
    this.setState({
      options: newOptions,
    });
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let { label, mandatory, active, options } = this.state;
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
            <Label for="data-label">Label</Label>
            <Input
              type="text"
              value={label}
              placeholder=""
              onChange={(e) => this.setState({ label: e.target.value })}
              id="data-label"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-mandatory">Mandatory</Label>
            <Input
              type="select"
              id="data-mandatory"
              value={mandatory}
              onChange={(e) => this.setState({ mandatory: e.target.value })}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="data-label">Active (In Application)</Label>
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
          <h4>Options</h4>
          <div>
            {options.map((option, index) => {
              return (
                <div
                  style={{ display: "flex", flexDirection: "row" }}
                  key={index}
                >
                  <FormGroup style={{ flex: 0.6, marginRight: "10px" }}>
                    <Label for="data-label">Label</Label>
                    <Input
                      type="text"
                      value={option.label}
                      placeholder=""
                      onChange={(e) =>
                        this.editOption(e.target.value, option.price, index)
                      }
                      id="data-label"
                    />
                  </FormGroup>
                  <FormGroup style={{ flex: 0.4 }}>
                    <Label for="data-label">Price (EGP)</Label>
                    <Input
                      type="text"
                      value={option.price}
                      placeholder=""
                      onChange={(e) =>
                        this.editOption(
                          option.label,
                          Number(e.target.value),
                          index
                        )
                      }
                      id="data-label"
                    />
                  </FormGroup>
                </div>
              );
            })}
          </div>
          <Button
            color="primary"
            style={{ padding: "5px 9px 5px 9px" }}
            onClick={() => this.addOption()}
          >
            <Plus size={16} />
          </Button>
          <Button
            color="light"
            style={{ marginLeft: "10px", padding: "5px 9px 5px 9px" }}
            onClick={() => this.removeOption()}
          >
            <Minus size={16} />
          </Button>
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
