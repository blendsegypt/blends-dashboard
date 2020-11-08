import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import { Plus, Minus } from "react-feather";
import axios from "../../../../axios";

class DataListSidebar extends Component {
  state = {
    id: "",
    label: "",
    mandatory: false,
    active: false,
    product_id: null,
    custom_options: [],
    products_list: [],
  };

  addNew = false;

  async componentDidMount() {
    const products = await axios.get("admin/products");
    this.setState({
      products_list: products.data.data,
    });
  }

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
      if (this.props.data.custom_options !== prevState.custom_options) {
        this.setState({ custom_options: this.props.data.custom_options });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        label: "",
        mandatory: false,
        active: false,
        product_id: null,
        custom_options: [],
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        label: "",
        mandatory: false,
        active: false,
        product_id: null,
        custom_options: [],
      });
    }
    this.addNew = false;
  }

  handleSubmit = async () => {
    // Generate value property on custom options
    const custom_options = [...this.state.custom_options];
    custom_options.forEach((option) => {
      option.value = option.label.toLowerCase();
      if (this.props.data !== null)
        option.product_custom_option_id = this.state.id;
    });
    if (this.props.data !== null) {
      // Update Custom Options
      try {
        await axios.put(`admin/products-custom-options/${this.state.id}`, {
          id: this.state.id,
          label: this.state.label,
          mandatory: this.state.mandatory,
          active: this.state.active,
          custom_options: custom_options,
        });
      } catch (error) {
        alert("Error: " + error);
      }
    } else {
      // Add new custom option
      if (this.state.label === "") {
        alert("You didn't enter a label");
        return;
      }
      if (this.state.product_id === null) {
        alert("You didn't choose a product");
        return;
      }
      try {
        await axios.post(`admin/products-custom-options/`, {
          label: this.state.label,
          mandatory: this.state.mandatory,
          active: this.state.active,
          product_id: this.state.product_id,
          custom_options: custom_options,
        });
      } catch (error) {
        alert("Error: " + error);
      }
    }
    this.props.handleSidebar(false, true);
  };

  // Custom Options sub-options

  addOption = () => {
    const newOptions = this.state.custom_options.concat({
      label: "",
      price: "",
      active: false,
    });
    this.setState({
      custom_options: newOptions,
    });
  };

  editOption = (label, price, active, index) => {
    const newOptions = this.state.custom_options.map((option, optionIndex) => {
      if (optionIndex === index) {
        if (option.id) {
          return {
            id: option.id,
            label,
            price,
            active,
          };
        }
        return {
          label,
          price,
          active,
        };
      }
      return option;
    });
    this.setState({
      custom_options: newOptions,
    });
  };

  removeOption = () => {
    const newOptions = this.state.custom_options.slice(
      0,
      this.state.custom_options.length - 1
    );
    this.setState({
      custom_options: newOptions,
    });
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let { label, mandatory, active, product_id, custom_options } = this.state;
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
            <Label for="data-mandatory">Product</Label>
            <Input
              type="select"
              id="data-mandatory"
              value={product_id}
              onChange={(e) => {
                this.setState({ product_id: Number(e.target.value) });
              }}
            >
              <option value="INVALID">Select..</option>
              {this.state.products_list.map((product) => {
                return <option value={product.id}>{product.name}</option>;
              })}
            </Input>
          </FormGroup>
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
            {custom_options.map((option, index) => {
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
                        this.editOption(
                          e.target.value,
                          option.price,
                          option.active,
                          index
                        )
                      }
                      id="data-label"
                    />
                  </FormGroup>
                  <FormGroup style={{ flex: 0.3 }}>
                    <Label for="data-label">Price (EGP)</Label>
                    <Input
                      type="text"
                      value={option.price}
                      placeholder=""
                      onChange={(e) =>
                        this.editOption(
                          option.label,
                          Number(e.target.value),
                          option.active,
                          index
                        )
                      }
                      id="data-label"
                    />
                  </FormGroup>
                  <FormGroup style={{ flex: 0.1 }}>
                    <Label for="data-active">Active</Label>
                    <input
                      type="checkbox"
                      name="active"
                      checked={option.active}
                      onChange={(e) => {
                        if (e.target.checked)
                          this.editOption(
                            option.label,
                            option.price,
                            true,
                            index
                          );
                        else
                          this.editOption(
                            option.label,
                            option.price,
                            false,
                            index
                          );
                      }}
                      style={{ marginLeft: "13px", marginTop: "10px" }}
                    ></input>
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
