import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import "flatpickr/dist/themes/light.css";
import axios from "../../../../axios";

class DataListSidebar extends Component {
  state = {
    id: "",
    code: "",
    active: true,
    type: "",
    start_date: new Date(),
    end_date: new Date(),
    max_usage_per_user: 1,
    limited: false,
    max_usage_per_code: null,
    min_order_value: 0,
    percentage_discount: 0,
    fixed_amount: 0,
    free_product: "",
    free_product_quantity: 1,
    cashback: 0,
  };

  async componentDidMount() {
    try {
      const products = await axios.get("admin/products");
      this.setState({
        products_list: products.data.data,
      });
    } catch (error) {
      alert(`An error occured ${error}`);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.code !== prevState.code) {
        this.setState({ code: this.props.data.code });
      }
      if (this.props.data.active !== prevState.active) {
        this.setState({ active: this.props.data.active });
      }
      if (this.props.data.limited !== prevState.limited) {
        this.setState({ limited: this.props.data.limited });
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
      if (this.props.data.max_usage_per_code !== prevState.max_usage_per_code) {
        this.setState({
          max_usage_per_code: this.props.data.max_usage_per_code,
        });
      }
      if (this.props.data.min_order_value !== prevState.min_order_value) {
        this.setState({
          min_order_value: this.props.data.min_order_value,
        });
      }
      if (
        this.props.data.percentage_discount !== prevState.percentage_discount
      ) {
        this.setState({
          percentage_discount: this.props.data.percentage_discount,
        });
      }
      if (this.props.data.fixed_amount !== prevState.fixed_amount) {
        this.setState({ fixed_amount: this.props.data.fixed_amount });
      }
      if (this.props.data.free_product !== prevState.free_product) {
        this.setState({ free_product: this.props.data.free_product });
      }
      if (
        this.props.data.free_product_quantity !==
        prevState.free_product_quantity
      ) {
        this.setState({
          free_product_quantity: this.props.data.free_product_quantity,
        });
      }
      if (this.props.data.cashback !== prevState.cashback) {
        this.setState({ cashback: this.props.data.cashback });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        code: "",
        active: true,
        type: "",
        start_date: new Date(),
        end_date: new Date(),
        max_usage_per_user: 1,
        limited: false,
        max_usage_per_code: null,
        min_order_value: 0,
        percentage_discount: 0,
        fixed_amount: 0,
        free_product: "",
        free_product_quantity: 1,
        cashback: 0,
      });
    }
    this.addNew = false;
  }

  handleSubmit = async () => {
    const promocode = {
      code: this.state.code,
      active: this.state.active,
      type: this.state.type,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
      max_usage_per_user: this.state.max_usage_per_user,
      limited: this.state.limited,
      max_usage_per_code: null,
      min_order_value: this.state.min_order_value,
      free_product: null,
      fixed_amount: null,
      cashback: null,
      percentage_discount: null,
    };
    if (promocode.limited) {
      promocode.max_usage_per_code = this.state.max_usage_per_code;
    }
    if (promocode.type === "fixed") {
      promocode.fixed_amount = this.state.fixed_amount;
    } else if (promocode.type === "percentage") {
      promocode.percentage_discount = this.state.percentage_discount;
    } else if (promocode.type === "free_item") {
      promocode.free_product = this.state.free_product.id;
      promocode.free_product_quantity = this.state.free_product_quantity;
    } else if (promocode.type === "cashback") {
      promocode.cashback = this.state.cashback;
    }
    if (this.props.data !== null) {
      // Update Promocode
      try {
        await axios.put(`admin/promo-codes/${this.state.id}`, promocode);
      } catch (error) {
        alert("Error: " + error);
      }
    } else {
      // Add new Promocode
      try {
        await axios.post(`admin/promo-codes`, promocode);
      } catch (error) {
        alert("Error: " + error);
      }
    }
    this.props.handleSidebar(false, true);
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let {
      code,
      active,
      type,
      start_date,
      end_date,
      max_usage_per_user,
      max_usage_per_code,
      limited,
      min_order_value,
      percentage_discount,
      fixed_amount,
      cashback,
      free_product,
      free_product_quantity,
      products_list,
    } = this.state;
    let selected_product = free_product;
    if (products_list) {
      products_list.forEach((product, index) => {
        if (product.id === free_product) {
          selected_product = products_list[index];
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
            <Label for="data-active">Active</Label>
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
            <Label for="data-limited">Limited</Label>
            <Input
              type="select"
              id="data-limited"
              value={limited}
              onChange={(e) => this.setState({ limited: e.target.value })}
            >
              <option value={true}>Limited</option>
              <option value={false}>Not Limited</option>
            </Input>
          </FormGroup>
          {limited && (
            <FormGroup>
              <Label for="data-popularity">Maximum Usage Per Code</Label>
              <Input
                type="text"
                value={max_usage_per_code}
                placeholder=""
                onChange={(e) =>
                  this.setState({ max_usage_per_code: e.target.value })
                }
                id="data-opens-at"
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label for="data-popularity">Minimum Order Value (EGP)</Label>
            <Input
              type="text"
              value={min_order_value}
              placeholder=""
              onChange={(e) =>
                this.setState({ min_order_value: e.target.value })
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
              <option value="fixed">Fixed Discount</option>
              <option value="percentage">Percentage Discount</option>
              <option value="free_item">Free Item</option>
              <option value="free_delivery">Free Delivery</option>
              <option value="cashback">Cashback</option>
            </Input>
          </FormGroup>
          {type === "free_item" && (
            <>
              <FormGroup>
                <Label for="data-product">Free Product</Label>
                <Select
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  className="React"
                  classNamePrefix="select"
                  value={selected_product}
                  name="clear"
                  options={products_list}
                  onChange={(product) =>
                    this.setState({ free_product: product })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label for="data-product">Quantity</Label>
                <Input
                  type="text"
                  value={free_product_quantity}
                  placeholder="1"
                  onChange={(e) =>
                    this.setState({ free_product_quantity: e.target.value })
                  }
                  id="data-opens-at"
                />
              </FormGroup>
            </>
          )}
          {type === "fixed" && (
            <FormGroup>
              <Label for="data-product">Fixed Discount (EGP)</Label>
              <Input
                type="text"
                value={fixed_amount}
                placeholder="20"
                onChange={(e) =>
                  this.setState({ fixed_amount: e.target.value })
                }
                id="data-opens-at"
              />
            </FormGroup>
          )}
          {type === "percentage" && (
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
          {type === "cashback" && (
            <FormGroup>
              <Label for="data-product">Cashback Percentage (%)</Label>
              <Input
                type="text"
                value={cashback}
                placeholder="15"
                onChange={(e) => this.setState({ cashback: e.target.value })}
                id="data-opens-at"
              />
            </FormGroup>
          )}
        </PerfectScrollbar>
        <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
          <Button color="primary" onClick={() => this.handleSubmit()}>
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
