import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X, Plus, Minus } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import axios from "../../../../axios";

class DataListSidebar extends Component {
  state = {
    id: "",
    name: "",
    area_fence: [],
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
      if (this.props.data.area_fence !== prevState.area_fence) {
        this.setState({ area_fence: this.props.data.area_fence });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        name: "",
        area_fence: [],
      });
    }
  }

  handleSubmit = async (obj) => {
    if (this.props.data !== null) {
      //Update Areas
      try {
        await axios.put(`admin/areas/${this.state.id}`, {
          name: this.state.name,
          area_fence: this.state.area_fence,
        });
      } catch (error) {
        alert("Error: " + error);
      }
    } else {
      // Add new Areas
      try {
        await axios.post(`admin/areas/`, {
          name: this.state.name,
          area_fence: this.state.area_fence,
        });
      } catch (error) {
        alert("Error: " + error);
      }
    }
    this.props.handleSidebar(false, true);
  };

  addCoordinate = () => {
    let newFence = [...this.state.area_fence];
    newFence = newFence.concat("");
    this.setState({ area_fence: newFence });
  };

  removeCoordinate = () => {
    let newFence = [...this.state.area_fence];
    newFence = newFence.slice(0, -1);
    this.setState({ area_fence: newFence });
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let { name, area_fence } = this.state;
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
            <Label for="data-name">Area Name</Label>
            <Input
              type="text"
              value={name}
              placeholder=""
              onChange={(e) => this.setState({ name: e.target.value })}
              id="data-name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-name">Area Fence (lng,lat)</Label>
            {area_fence.map((coordinate, index) => {
              return (
                <Input
                  type="text"
                  style={{ marginTop: "5px" }}
                  value={coordinate}
                  placeholder=""
                  onChange={(e) => {
                    const newFence = [...this.state.area_fence];
                    newFence[index] = e.target.value;
                    this.setState({ area_fence: newFence });
                  }}
                  id="data-name"
                />
              );
            })}
          </FormGroup>
          <Button
            color="primary"
            style={{ padding: "5px 9px 5px 9px" }}
            onClick={() => this.addCoordinate()}
          >
            <Plus size={16} />
          </Button>
          <Button
            color="light"
            style={{ marginLeft: "10px", padding: "5px 9px 5px 9px" }}
            onClick={() => this.removeCoordinate()}
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
