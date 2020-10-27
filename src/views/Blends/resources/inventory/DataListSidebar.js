import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";

class DataListSidebar extends Component {
  state = {
    product_id: "",
    branch: "",
    safe_stock: 0,
    min_stock: 0,
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.product_id !== prevState.product_id) {
        this.setState({ product_id: this.props.data.product_id });
      }
      if (this.props.data.branch !== prevState.branch) {
        this.setState({ branch: this.props.data.branch });
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
        product_id: "",
        branch: "",
        safe_stock: 0,
        min_stock: 0,
      });
    }
    if (this.addNew) {
      this.setState({
        product_id: "",
        branch: "",
        safe_stock: 0,
        min_stock: 0,
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
