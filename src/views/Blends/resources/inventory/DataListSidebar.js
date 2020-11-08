import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import axios from "../../../../axios";

class DataListSidebar extends Component {
  state = {
    id: null,
    safe_stock: 0,
    min_stock: 0,
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.safe_stock !== prevState.safe_stock) {
        this.setState({ safe_stock: this.props.data.safe_stock });
      }
      if (this.props.data.min_stock !== prevState.min_stock) {
        this.setState({ min_stock: this.props.data.min_stock });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: null,
        safe_stock: 0,
        min_stock: 0,
      });
    }
    if (this.addNew) {
      this.setState({
        id: null,
        safe_stock: 0,
        min_stock: 0,
      });
    }
    this.addNew = false;
  }

  handleSubmit = async () => {
    try {
      await axios.put(`admin/inventory/${this.state.id}`, {
        safe_stock: Number(this.state.safe_stock),
        min_stock: Number(this.state.min_stock),
      });
    } catch (error) {
      console.log(error);
    }
    this.props.handleSidebar(false, true);
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let { safe_stock, min_stock } = this.state;
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
            <Label for="data-safe_stock">Safe Stock</Label>
            <Input
              type="text"
              value={safe_stock}
              placeholder=""
              onChange={(e) => this.setState({ safe_stock: e.target.value })}
              id="data-safe_stock"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-safe_stock">Minimum Stock</Label>
            <Input
              type="text"
              value={min_stock}
              placeholder=""
              onChange={(e) => this.setState({ min_stock: e.target.value })}
              id="data-min_stock"
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
