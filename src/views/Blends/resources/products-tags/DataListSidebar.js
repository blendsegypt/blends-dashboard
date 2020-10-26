import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";

class DataListSidebar extends Component {
  state = {
    id: "",
    value: "",
    color: "",
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.value !== prevState.value) {
        this.setState({ value: this.props.data.value });
      }
      if (this.props.data.color !== prevState.color) {
        this.setState({ color: this.props.data.color });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        value: "",
        color: "",
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        value: "",
        color: "",
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
    let { value, color } = this.state;
    console.log(Boolean(color));
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
          <div>
            <h5>Preview</h5>
            <div
              style={{
                backgroundColor: color,
                color: "white",
                padding: "4px 7px 3px 7px",
                borderRadius: 15,
                fontSize: "12px",
                display: "inline-block",
                marginBottom: "30px",
              }}
            >
              <span>{value}</span>
            </div>
          </div>
          <FormGroup>
            <Label for="data-value">Tag Text</Label>
            <Input
              type="text"
              value={value}
              placeholder=""
              onChange={(e) => this.setState({ value: e.target.value })}
              id="data-value"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-value">Background Color</Label>
            <Input
              type="text"
              value={color}
              placeholder=""
              onChange={(e) => this.setState({ color: e.target.value })}
              id="data-color"
            />
          </FormGroup>
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
