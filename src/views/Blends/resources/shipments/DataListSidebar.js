import React, { Component } from "react";
import { Label, Input, FormGroup, Button, Alert } from "reactstrap";
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
    product_id: "",
    branch_id: "",
    purchased_quantity: 0,
    expiry_date: new Date(),
    products_list: [],
    branches_list: [],
  };

  async componentDidMount() {
    try {
      const products_list = await axios.get("admin/products");
      const branches_list = await axios.get("admin/branches");
      const retailProducts = products_list.data.data.filter(
        (product) => product.retail
      );
      this.setState({
        products_list: retailProducts,
        branches_list: branches_list.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleSubmit = async () => {
    const shipment = {
      product_id: this.state.product_id,
      branch_id: this.state.branch_id,
      purchased_quantity: this.state.purchased_quantity,
      expiry_date: this.state.expiry_date,
      remaining_quantity: this.state.purchased_quantity,
      expired: false,
    };
    try {
      await axios.post("admin/shipments", shipment);
    } catch (error) {
      alert("An error occured: " + error);
    }
    this.props.handleSidebar(false, true);
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let {
      purchased_quantity,
      expiry_date,
      products_list,
      branches_list,
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
          <Alert color="primary">Shipment cannot be modified latter!</Alert>
          <FormGroup>
            <Label for="data-product">Product</Label>
            <Select
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              className="React"
              classNamePrefix="select"
              //value={selected_product}
              name="clear"
              options={products_list}
              onChange={(product) => this.setState({ product_id: product.id })}
              isClearable={true}
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-branch">Branch</Label>
            <Select
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              className="React"
              classNamePrefix="select"
              //value={}
              name="clear"
              options={branches_list}
              onChange={(branch) => this.setState({ branch_id: branch.id })}
              isClearable={true}
            />
          </FormGroup>
          <FormGroup style={{ flex: 0.6, marginRight: "10px" }}>
            <Label for="data-purchased_quantity">Purchased Quantity</Label>
            <Input
              type="text"
              value={purchased_quantity}
              placeholder=""
              onChange={(e) =>
                this.setState({ purchased_quantity: Number(e.target.value) })
              }
              id="data-label"
            />
          </FormGroup>
          <FormGroup style={{ flex: 0.6, marginRight: "10px" }}>
            <Label for="data-purchased_quantity">Expiry Date</Label>
            <Flatpickr
              className="form-control"
              value={expiry_date}
              options={{
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
              }}
              onChange={(date) => {
                this.setState({ expiry_date: date });
              }}
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
