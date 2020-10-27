import React, { Component } from "react";
import { Label, Input, FormGroup, Button, Alert } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "flatpickr/dist/themes/light.css";

const products = [
  {
    value: 1,
    label: "Lay's Tomatoes Chips (30g)",
  },
  {
    value: 2,
    label: "Lay's Chicken Chips (30g)",
  },
  {
    value: 3,
    label: "Lambada Biscuit (15g)",
  },
  {
    value: 4,
    label: "Lotus Biscuit (10g)",
  },
  {
    value: 5,
    label: "Shamedan Biscuit (30g)",
  },
];

const branches = [
  {
    value: "Fleming",
    label: "Fleming",
  },
  {
    value: "Smouha",
    label: "Smouha",
  },
];

class DataListSidebar extends Component {
  state = {
    product_id: "",
    branch: "",
    purchased_quantity: "",
    new_expiry_date: new Date(),
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.product_id !== prevState.product_id) {
        this.setState({ product_id: this.props.data.product_id });
      }
      if (this.props.data.branch !== prevState.branch) {
        this.setState({ branch: this.props.data.branch });
      }
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
    let { product_id, branch, purchased_quantity } = this.state;
    let selected_product = "";
    let selected_branch = "";
    if (data !== null) {
      products.forEach((product, index) => {
        if (product.value === product_id) {
          selected_product = products[index];
        }
      });
      branches.forEach((branchItem, index) => {
        if (branchItem.value === branch) {
          selected_branch = branches[index];
        }
      });
    }
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
            <Label for="data-product">Product</Label>
            <Select
              className="React"
              classNamePrefix="select"
              value={selected_product}
              name="clear"
              options={products}
              onChange={(e) => this.setState({ product_id: e.target.event })}
              isClearable={true}
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-branch">Branch</Label>
            <Select
              className="React"
              classNamePrefix="select"
              value={selected_branch}
              name="clear"
              options={branches}
              onChange={(e) => this.setState({ branch: e.target.event })}
              isClearable={true}
            />
          </FormGroup>
          {data === null && (
            <>
              <Alert color="primary">
                Purchased Quantity cannot be changed latter!
              </Alert>
              <FormGroup style={{ flex: 0.6, marginRight: "10px" }}>
                <Label for="data-purchased_quantity">Purchased Quantity</Label>
                <Input
                  type="text"
                  value={purchased_quantity}
                  placeholder=""
                  onChange={(e) =>
                    this.setState({ purchased_quantity: e.target.value })
                  }
                  id="data-label"
                />
              </FormGroup>
              <FormGroup style={{ flex: 0.6, marginRight: "10px" }}>
                <Label for="data-purchased_quantity">Expiry Date</Label>
                <Flatpickr
                  className="form-control"
                  value={this.state.new_expiry_date}
                  options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "Y-m-d",
                  }}
                  onChange={(date) => {
                    this.setState({ new_expiry_date: date });
                  }}
                />
              </FormGroup>
            </>
          )}
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
