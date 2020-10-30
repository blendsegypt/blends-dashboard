import React, { Component } from "react";
import { Label, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Select from "react-select";

const usersList = [
  {
    label: "01149050646",
    value: 1, //User_ID
    addresses: [
      {
        label: "Home",
        value: "Home",
      },
      {
        label: "Work",
        value: "Work",
      },
    ],
  },
  {
    label: "01142323021",
    value: 2,
    addresses: [
      {
        label: "home",
        value: "home",
      },
    ],
  },
];

const products = [
  {
    value: 1,
    label: "Latte",
    customOptions: [
      {
        label: "Cup Size",
        value: "",
        options: [
          {
            label: "Small",
            value: "sm",
          },
          {
            label: "Large",
            value: "lg",
          },
        ],
      },
      {
        label: "Milk Type",
        value: "",
        options: [
          {
            label: "Skimmed",
            value: "skm",
          },
          {
            label: "Full Cream",
            value: "fc",
          },
        ],
      },
    ],
  },
  {
    value: 2,
    label: "Espresso",
    customOptions: [
      {
        label: "Cup Size",
        value: "sm",
        options: [
          {
            label: "Small",
            value: "sm",
          },
          {
            label: "Large",
            value: "lg",
          },
        ],
      },
    ],
  },
];

const orderStatusList = [
  {
    label: "Received",
    value: "Received",
  },
  {
    label: "Brewing",
    value: "Brewing",
  },
  {
    label: "Delivering",
    value: "Delivering",
  },
  {
    label: "Delivered",
    value: "Delivered",
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

const coupons = [
  {
    label: "FREELOT",
    value: "FREELOT",
  },
  {
    label: "FORDER",
    value: "FORDER",
  },
];

class DataListSidebar extends Component {
  state = {
    id: "",
    order_number: "",
    order_status: "",
    user_id: "",
    user_phone_number: "",
    delivery_location: "",
    branch: "",
    subtotal: "",
    total: "",
    coupon: "",
    order_items: [{}],
    assigned_driver: "",
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.order_number !== prevState.order_number) {
        this.setState({ order_number: this.props.data.order_number });
      }
      if (this.props.data.order_status !== prevState.order_status) {
        this.setState({ order_status: this.props.data.order_status });
      }
      if (this.props.data.user_id !== prevState.user_id) {
        this.setState({ user_id: this.props.data.user_id });
      }
      if (this.props.data.user_phone_number !== prevState.user_phone_number) {
        this.setState({ user_phone_number: this.props.data.user_phone_number });
      }
      if (this.props.data.delivery_location !== prevState.delivery_location) {
        this.setState({ delivery_location: this.props.data.delivery_location });
      }
      if (this.props.data.branch !== prevState.branch) {
        this.setState({ branch: this.props.data.branch });
      }
      if (this.props.data.order_items !== prevState.order_items) {
        this.setState({ order_items: this.props.data.order_items });
      }
      if (this.props.data.subtotal !== prevState.subtotal) {
        this.setState({ subtotal: this.props.data.subtotal });
      }
      if (this.props.data.total !== prevState.total) {
        this.setState({ total: this.props.data.total });
      }
      if (this.props.data.coupon !== prevState.coupon) {
        this.setState({ coupon: this.props.data.coupon });
      }
      if (this.props.data.assigned_driver !== prevState.assigned_driver) {
        this.setState({ assigned_driver: this.props.data.assigned_driver });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        order_number: "",
        order_status: "",
        user_id: "",
        user_phone_number: "",
        delivery_location: "",
        branch: "",
        subtotal: "",
        total: "",
        order_items: [],
        coupon: "",
        assigned_driver: "",
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        order_number: "",
        order_status: "",
        user_id: "",
        user_phone_number: "",
        delivery_location: "",
        branch: "",
        subtotal: "",
        order_items: [],
        total: "",
        coupon: "",
        assigned_driver: "",
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
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let {
      order_status,
      user_id,
      user_phone_number,
      delivery_location,
      branch,
      order_items,
      coupon,
    } = this.state;
    let selectedOrderStatus = "";
    let selected_user = "";
    let selected_delivery_location = "";
    let selectedBranch = "";
    let selectedCoupon = "";

    orderStatusList.forEach((status, index) => {
      if (status.value === order_status) {
        selectedOrderStatus = orderStatusList[index];
      }
    });
    usersList.forEach((user, index) => {
      if (user.value === user_id) {
        selected_user = usersList[index];
        user.addresses.forEach((address, index) => {
          if (address.value === delivery_location) {
            selected_delivery_location = user.addresses[index];
          }
        });
      }
    });
    branches.forEach((branchItem, index) => {
      if (branchItem.value === branch) {
        selectedBranch = branches[index];
      }
    });
    coupons.forEach((couponObject, index) => {
      if (couponObject.value === coupon) {
        selectedCoupon = coupons[index];
      }
    });
    console.log(selected_delivery_location);
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
            <Label for="data-status">Order Status</Label>
            <Select
              className="React"
              classNamePrefix="select"
              name="clear"
              value={selectedOrderStatus}
              options={orderStatusList}
              onChange={(status) =>
                this.setState({ order_status: status.value })
              }
              isClearable={true}
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-status">User's Phone Number</Label>
            <Select
              className="React"
              classNamePrefix="select"
              name="clear"
              value={selected_user}
              options={usersList}
              onChange={(user) => {
                this.setState({
                  user_id: user.value ? user.value : null, //Check if selected is null or not
                  user_phone_number: Number(user.label),
                  delivery_location: "", //Clear Delivery Location from previous selections
                });
              }}
              isClearable={true}
            />
          </FormGroup>
          {/* Render User's Address selection if a user is selected */}
          {user_id && user_phone_number && (
            <FormGroup>
              <Label for="data-status">User's Address</Label>
              <Select
                className="React"
                classNamePrefix="select"
                name="clear"
                value={selected_delivery_location}
                options={
                  usersList.find((user) => user.value === user_id).addresses
                }
                onChange={(address) => {
                  this.setState({ delivery_location: address.value });
                }}
                isClearable={true}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label for="data-status">Branch</Label>
            <Select
              className="React"
              classNamePrefix="select"
              name="clear"
              value={selectedBranch}
              options={branches}
              onChange={(branch) => this.setState({ branch: branch.value })}
              isClearable={true}
            />
          </FormGroup>
          {/* Products Selection Area */}
          <h4>Ordered Products</h4>
          {order_items.map((item, index) => {
            let selected_product = "";
            // Check if product is selected or not
            if (Object.keys(item).length === 0) {
              selected_product = "";
            } else {
              selected_product = products.find(
                (product) => item.value === product.value
              );
            }
            return (
              <div
                style={{
                  borderColor: "#e9e9e9",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "10px",
                }}
              >
                {/* Choose / Delete Product */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FormGroup
                    style={{
                      flex: 0.8,
                      marginRight: "10px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Label for="data-status">Product</Label>
                    <Select
                      className="React"
                      classNamePrefix="select"
                      name="clear"
                      value={selected_product}
                      options={products}
                      onChange={(product) => {
                        // Change Product through changing order_item
                        const newOrderedItems = [...this.state.order_items];
                        newOrderedItems[index] = JSON.parse(
                          JSON.stringify(product)
                        );
                        this.setState({ order_items: newOrderedItems });
                      }}
                    />
                  </FormGroup>
                  <div style={{ flex: 0.2 }}>
                    <Button
                      disabled={order_items.length === 1 ? true : false} //Disabled remove button if there's only 1 item
                      color="primary"
                      style={{
                        paddingTop: "14px",
                        paddingBottom: "14px",
                        fontSize: "13px",
                        marginTop: "12px",
                      }}
                      onClick={() => {
                        // Remove item from order_items array
                        const newOrderedItems = [...this.state.order_items];
                        newOrderedItems.splice(index, 1);
                        this.setState({
                          order_items: newOrderedItems,
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {/* Product Custom Options */}
                {selected_product !== "" && // If no product is selected then don't show custom options
                  products
                    .find((product) => product.value === item.value) // Find product in products list
                    .customOptions.map((customOption) => {
                      // Get option object from order_items item object
                      const currentOption = item.customOptions.find(
                        (option) => option.label === customOption.label
                      );
                      let currentValue = {};
                      if (currentOption.value !== "") {
                        currentValue.value = currentOption.value;
                        currentValue.label = customOption.options.find(
                          (option) => {
                            return option.value === currentOption.value;
                          }
                        ).label;
                      }
                      return (
                        <FormGroup style={{ marginBottom: "0.5rem" }}>
                          <Label for="data-status">{customOption.label}</Label>
                          <Select
                            className="React"
                            classNamePrefix="select"
                            name="clear"
                            value={currentValue}
                            options={
                              selected_product.customOptions.find(
                                (option) => option.label === customOption.label
                              ).options
                            }
                            onChange={(option) => {
                              const newOrderedItems = [
                                ...this.state.order_items,
                              ];
                              const currentItem = newOrderedItems[index];
                              const currentOption = currentItem.customOptions.find(
                                (option) => option.label === customOption.label
                              );
                              currentOption.value = option.value;
                              this.setState({
                                ordered_items: newOrderedItems,
                              });
                            }}
                          />
                        </FormGroup>
                      );
                    })}
              </div>
            );
          })}
          <Button
            color="success"
            onClick={() => {
              let newOrderItems = [...order_items];
              newOrderItems = newOrderItems.concat({});
              this.setState({ order_items: newOrderItems });
            }}
          >
            Add Product
          </Button>
          <h4 style={{ marginTop: "20px" }}>Offers & Coupons</h4>
          <FormGroup>
            <Label for="data-status">Coupon</Label>
            <Select
              className="React"
              classNamePrefix="select"
              name="clear"
              value={selectedCoupon}
              options={coupons}
              onChange={(coupon) => this.setState({ coupon: coupon.value })}
              isClearable={true}
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
