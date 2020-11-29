import React, { Component } from "react";
import { Label, FormGroup, Button, Input } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Select from "react-select";
import axios from "../../../../axios";

const orderStatusList = [
  {
    label: "Received",
    value: "Received",
  },
  {
    label: "Preparing",
    value: "Preparing",
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

class DataListSidebar extends Component {
  state = {
    id: null,
    order_status: "",
    delivery_charges: 5,
    user_id: "",
    delivery_address_id: "",
    OrderItems: [{ quantity: 1 }],
    promocode_id: "",
  };

  async componentDidMount() {
    try {
      // get data that order depends on
      const users = await axios.get("admin/users");
      const products = await axios.get("admin/products");
      const promocodes = await axios.get("admin/promo-codes");
      const product_custom_options = await axios.get(
        "admin/products-custom-options"
      );
      // add custom options array to each product
      products.data.data.forEach((product) => (product.custom_options = []));
      product_custom_options.data.data.forEach((option) => {
        const product = products.data.data.find(
          (product) => product.id === option.product_id
        );
        product.custom_options.push({
          label: option.label,
          options: option.custom_options,
        });
      });
      this.setState({
        users_list: users.data.data,
        products_list: products.data.data,
        promocodes_list: promocodes.data.data,
        custom_options_list: product_custom_options.data.data,
      });
    } catch (error) {
      alert("Error: Couldnt data / " + error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.order_status !== prevState.order_status) {
        this.setState({ order_status: this.props.data.order_status });
      }
      if (this.props.data.user_id !== prevState.user_id) {
        this.setState({ user_id: this.props.data.user_id });
      }
      if (
        this.props.data.delivery_address_id !== prevState.delivery_address_id
      ) {
        this.setState({
          delivery_address_id: this.props.data.delivery_address_id,
        });
      }
      if (this.props.data.delivery_charges !== prevState.delivery_charges) {
        this.setState({ delivery_charges: this.props.data.delivery_charges });
      }
      if (this.props.data.OrderItems !== prevState.OrderItems) {
        this.setState({ OrderItems: this.props.data.OrderItems });
      }
      if (this.props.data.promocode_id !== prevState.promocode_id) {
        this.setState({ promocode_id: this.props.data.promocode_id });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: null,
        order_status: "",
        delivery_charges: 5,
        user_id: "",
        delivery_address_id: "",
        sub_total: "",
        total: "",
        OrderItems: [{ quantity: 1 }],
        promocode_id: "",
      });
    }
    if (this.props.data !== null && prevProps.data === null) {
      //order status
      const current_order_status = orderStatusList.find(
        (status) => status.value === this.props.data.order_status
      );
      //user id
      const current_user_id = this.state.users_list.find(
        (user) => user.id === this.props.data.user_id
      );
      this.getUserAddresses(this.props.data.user_id);
      //ordered items
      const current_order_items = this.props.data.OrderItems.map((item) => {
        const product = this.state.products_list.find(
          (product) => product.id === item.Product.id
        );
        // stringify options JSON object from database
        const selectedOptions = JSON.parse(item.options);
        // add custom options array to each product
        item.custom_options = [];
        this.state.custom_options_list.forEach((option) => {
          //cup size, flavor....
          let appendedOption = Object.assign({}, option);
          appendedOption.options = appendedOption.custom_options;
          delete appendedOption.custom_options;
          // check if option is selected
          selectedOptions.forEach((selectedOption) => {
            if (selectedOption.label === option.label) {
              appendedOption.value = option.custom_options.find(
                (option) => option.label === selectedOption.value
              );
            }
          });
          // push whatever relates to the product
          if (option.product_id === item.Product.id)
            item.custom_options.push(appendedOption);
        });
        console.log(item);
        return {
          ...product,
          quantity: item.quantity,
          custom_options: item.custom_options,
        };
      });
      //promocodes
      const current_promocode = this.state.promocodes_list.find(
        (promocode) => promocode.id === this.props.data.promocode_id
      );
      this.setState({
        order_status: current_order_status,
        user_id: current_user_id,
        OrderItems: current_order_items,
        promocode_id: current_promocode,
      });
    }
  }

  getUserAddresses = async (id) => {
    this.setState({ addresses_list: [] }, async () => {
      const user_addresses = await axios.get(`admin/users/${id}/addresses`);
      this.setState({ addresses_list: user_addresses.data.data });
      if (this.props.data !== null) {
        const current_address_id = this.state.addresses_list.find(
          (address) => address.user_id === this.props.data.user_id
        );
        this.setState({ delivery_address_id: current_address_id });
      }
    });
  };

  handleSubmit = async () => {
    // Format Order Items array
    const orderItems = this.state.OrderItems.map((item) => {
      let options = [];
      if (item.custom_options) {
        options = item.custom_options.map((option) => {
          return {
            label: option.label,
            value: option.value ? option.value.label : null,
          };
        });
      }
      return {
        product_id: item.id,
        quantity: item.quantity,
        options: JSON.stringify(options),
        price: item.price,
      };
    });
    // Calculate sub_total and total
    let sub_total = 0;
    this.state.OrderItems.forEach((item) => {
      sub_total +=
        (item.sale_price ? item.sale_price : item.price) * item.quantity;
      if (item.custom_options) {
        item.custom_options.forEach((option) => {
          sub_total += option.value ? option.value.price : 0;
        });
      }
    });
    let total = sub_total + this.state.delivery_charges;
    const order = {
      sub_total,
      total,
      delivery_charges: this.state.delivery_charges,
      user_id: this.state.user_id.id,
      delivery_address_id: this.state.delivery_address_id.id,
      area_id: this.state.delivery_address_id.area_id,
      OrderItems: orderItems,
    };
    if (this.props.data !== null) {
      try {
        order.OrderItems.forEach((item) => {
          item.order_id = this.state.id;
        });
        order.order_status = this.state.order_status.value;
        await axios.put(`admin/orders/${this.state.id}`, order);
      } catch (error) {
        alert("Error! " + error);
      }
    } else {
      try {
        await axios.post(`admin/orders`, order);
      } catch (error) {
        alert("Error! " + error);
      }
    }
    this.props.handleSidebar(false, true);
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let {
      order_status,
      user_id,
      delivery_address_id,
      OrderItems,
      promocode_id,
      users_list,
      products_list,
      promocodes_list,
      addresses_list,
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
          {this.props.data !== null && (
            <FormGroup>
              <Label for="data-status">Order Status</Label>
              <Select
                className="React"
                classNamePrefix="select"
                name="clear"
                value={order_status}
                options={orderStatusList}
                onChange={(status) => this.setState({ order_status: status })}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label for="data-status">User's Phone Number</Label>
            <Select
              getOptionLabel={(option) => option.phone_number}
              getOptionValue={(option) => option.id}
              className="React"
              classNamePrefix="select"
              name="clear"
              value={user_id}
              options={users_list}
              onChange={(user) => {
                this.setState({
                  user_id: user,
                });
                this.getUserAddresses(user.id);
              }}
            />
          </FormGroup>
          {/* Render User's Address selection if a user is selected */}
          {user_id && (
            <FormGroup>
              <Label for="data-status">User's Address</Label>
              <Select
                getOptionLabel={(option) => option.nickname}
                getOptionValue={(option) => option.id}
                className="React"
                classNamePrefix="select"
                name="clear"
                value={delivery_address_id}
                options={addresses_list}
                onChange={(address) => {
                  this.setState({ delivery_address_id: address });
                }}
              />
            </FormGroup>
          )}
          {/* Products Selection Area */}
          <h4>Ordered Products</h4>
          {OrderItems.map((item, productIndex) => {
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
                      flex: 0.7,
                      marginRight: "10px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Label for="data-status">Product</Label>
                    <Select
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      className="React"
                      classNamePrefix="select"
                      name="clear"
                      value={item}
                      options={products_list}
                      onChange={(product) => {
                        // Change Product through changing order_item
                        product.quantity = 1;
                        const newOrderedItems = [...this.state.OrderItems];
                        newOrderedItems[productIndex] = JSON.parse(
                          JSON.stringify(product)
                        );
                        this.setState({ OrderItems: newOrderedItems });
                      }}
                    />
                  </FormGroup>
                  <FormGroup
                    style={{
                      flex: 0.2,
                      marginTop: "10px",
                      marginRight: "10px",
                    }}
                  >
                    <Label for="data-purchased_quantity">Quantity</Label>
                    <Input
                      type="text"
                      placeholder=""
                      value={item.quantity}
                      onChange={(e) => {
                        // Change Product through changing order_item
                        const newOrderedItems = [...this.state.OrderItems];
                        newOrderedItems[productIndex].quantity = Number(
                          e.target.value
                        );
                        this.setState({ OrderItems: newOrderedItems });
                      }}
                      id="data-label"
                    />
                  </FormGroup>
                  <div style={{ flex: 0.1 }}>
                    <Button
                      disabled={OrderItems.length === 1 ? true : false} //Disabled remove button if there's only 1 item
                      color="primary"
                      style={{
                        paddingTop: "14px",
                        paddingBottom: "14px",
                        fontSize: "13px",
                        marginTop: "12px",
                      }}
                      onClick={() => {
                        // Remove item from OrderItems array
                        const newOrderedItems = [...this.state.OrderItems];
                        newOrderedItems.splice(productIndex, 1);
                        this.setState({
                          OrderItems: newOrderedItems,
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {/* Product Custom Options */}
                {item.id && // If no product is selected then don't show custom options
                  item.custom_options.map((customOption, optionIndex) => {
                    return (
                      <FormGroup style={{ marginBottom: "0.5rem" }}>
                        <Label for="data-status">{customOption.label}</Label>
                        <Select
                          getOptionLabel={(option) => option.label}
                          getOptionValue={(option) => option.id}
                          className="React"
                          classNamePrefix="select"
                          name="clear"
                          value={customOption.value}
                          options={customOption.options}
                          onChange={(option) => {
                            const newOrderedItems = [...this.state.OrderItems];
                            const currentItem = newOrderedItems[productIndex];
                            const currentOption =
                              currentItem.custom_options[optionIndex];
                            currentOption.value = option;
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
              let newOrderItems = [...OrderItems];
              newOrderItems = newOrderItems.concat({ quantity: 1 });
              this.setState({ OrderItems: newOrderItems });
            }}
          >
            Add Product
          </Button>
          <h4 style={{ marginTop: "20px" }}>Offers & Promocodes</h4>
          <FormGroup>
            <Label for="data-status">Promocode</Label>
            <Select
              getOptionLabel={(option) => option.code}
              getOptionValue={(option) => option.id}
              className="React"
              classNamePrefix="select"
              name="clear"
              value={promocode_id}
              options={promocodes_list}
              onChange={(promocode) =>
                this.setState({ promocode_id: promocode.id })
              }
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
