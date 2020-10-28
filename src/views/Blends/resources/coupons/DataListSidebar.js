import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
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

class DataListSidebar extends Component {
  state = {
    id: "",
    code: "",
    type: "",
    start_date: new Date(),
    end_date: new Date(),
    max_usage_per_user: 0,
    minimum_order_value: 0,
    percentage_discount: 0,
    fixed_discount: 0,
    free_item_id: "",
    free_item: "",
    cashback_amount: 0,
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.code !== prevState.code) {
        this.setState({ code: this.props.data.code });
      }
      if (this.props.data.type !== prevState.type) {
        this.setState({ type: this.props.data.type });
      }
      if (this.props.data.start_date !== prevState.start_date) {
        this.setState({ start_date: this.props.data.start_date });
      }
      if (this.props.data.end_date !== prevState.end_date) {
        this.setState({ end_date: this.props.data.end_date });
      }
      if (this.props.data.max_usage_per_user !== prevState.max_usage_per_user) {
        this.setState({
          max_usage_per_user: this.props.data.max_usage_per_user,
        });
      }
      if (
        this.props.data.minimum_order_value !== prevState.minimum_order_value
      ) {
        this.setState({
          minimum_order_value: this.props.data.minimum_order_value,
        });
      }
      if (
        this.props.data.percentage_discount !== prevState.percentage_discount
      ) {
        this.setState({
          percentage_discount: this.props.data.percentage_discount,
        });
      }
      if (this.props.data.fixed_discount !== prevState.fixed_discount) {
        this.setState({ fixed_discount: this.props.data.fixed_discount });
      }
      if (this.props.data.free_item_id !== prevState.free_item_id) {
        this.setState({ free_item_id: this.props.data.free_item_id });
      }
      if (this.props.data.free_item !== prevState.free_item) {
        this.setState({ free_item: this.props.data.free_item });
      }
      if (this.props.data.cashback_amount !== prevState.cashback_amount) {
        this.setState({ cashback_amount: this.props.data.cashback_amount });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        code: "",
        type: "",
        start_date: new Date(),
        end_date: new Date(),
        max_usage_per_user: 0,
        minimum_order_value: 0,
        percentage_discount: 0,
        fixed_discount: 0,
        free_item_id: "",
        free_item: "",
        cashback_amount: 0,
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
      free_item_id,
      code,
      type,
      start_date,
      end_date,
      max_usage_per_user,
      minimum_order_value,
      percentage_discount,
      fixed_discount,
      cashback_amount,
    } = this.state;
    let selected_product = "";
    products.forEach((product, index) => {
      if (product.value === free_item_id) {
        selected_product = products[index];
      }
    });
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
            <Label for="data-popularity">Code</Label>
            <Input
              type="text"
              value={code}
              placeholder=""
              onChange={(e) => this.setState({ code: e.target.value })}
              id="data-opens-at"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Maximum Usage Per User</Label>
            <Input
              type="text"
              value={max_usage_per_user}
              placeholder=""
              onChange={(e) =>
                this.setState({ max_usage_per_user: e.target.value })
              }
              id="data-opens-at"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Minimum Order Value</Label>
            <Input
              type="text"
              value={minimum_order_value}
              placeholder=""
              onChange={(e) =>
                this.setState({ minimum_order_value: e.target.value })
              }
              id="data-opens-at"
            />
          </FormGroup>
          {/* Start Date is visible only when you're adding a new Coupon */}
          {data === null && (
            <FormGroup style={{ flex: 0.6, marginRight: "10px" }}>
              <Label for="data-purchased_quantity">Start Date</Label>
              <Flatpickr
                className="form-control"
                value={start_date}
                options={{
                  altInput: true,
                  altFormat: "F j, Y",
                  dateFormat: "Y-m-d",
                }}
                onChange={(date) => {
                  this.setState({ start_date: date });
                }}
              />
            </FormGroup>
          )}
          <FormGroup style={{ flex: 0.6, marginRight: "10px" }}>
            <Label for="data-purchased_quantity">End Date</Label>
            <Flatpickr
              className="form-control"
              value={end_date}
              options={{
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
              }}
              onChange={(date) => {
                this.setState({ end_date: date });
              }}
            />
          </FormGroup>
          <FormGroup style={{ flex: 0.6, marginRight: "10px" }}>
            <Label for="data-purchased_quantity">Type</Label>
            <Input
              type="select"
              name="status"
              id="status"
              value={type}
              onChange={(e) => this.setState({ type: e.target.value })}
            >
              <option value="not_selected">Select...</option>
              <option value="Fixed Discount">Fixed Discount</option>
              <option value="Percentage Discount">Percentage Discount</option>
              <option value="Free Item">Free Item</option>
              <option value="Cashback">Cashback in Balance</option>
            </Input>
          </FormGroup>
          {type === "Free Item" && (
            <FormGroup>
              <Label for="data-product">Free Product</Label>
              <Select
                className="React"
                classNamePrefix="select"
                value={selected_product}
                name="clear"
                options={products}
                onChange={(select) =>
                  this.setState({ free_item_id: select.value })
                }
              />
            </FormGroup>
          )}
          {type === "Fixed Discount" && (
            <FormGroup>
              <Label for="data-product">Fixed Discount (EGP)</Label>
              <Input
                type="text"
                value={fixed_discount}
                placeholder="20"
                onChange={(e) =>
                  this.setState({ fixed_discount: e.target.value })
                }
                id="data-opens-at"
              />
            </FormGroup>
          )}
          {type === "Percentage Discount" && (
            <FormGroup>
              <Label for="data-product">Percentage Discount (%)</Label>
              <Input
                type="text"
                value={percentage_discount}
                placeholder="50"
                onChange={(e) =>
                  this.setState({ percentage_discount: e.target.value })
                }
                id="data-opens-at"
              />
            </FormGroup>
          )}
          {type === "Cashback" && (
            <FormGroup>
              <Label for="data-product">Cashback Percentage (%)</Label>
              <Input
                type="text"
                value={cashback_amount}
                placeholder="15"
                onChange={(e) =>
                  this.setState({ cashback_amount: e.target.value })
                }
                id="data-opens-at"
              />
            </FormGroup>
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
