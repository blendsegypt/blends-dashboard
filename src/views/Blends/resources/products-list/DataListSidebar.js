import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Select from "react-select";
import axios from "../../../../axios";

class DataListSidebar extends Component {
  state = {
    id: "",
    product_category: "",
    product_cover: "",
    name: "",
    price: "",
    sale_price: "",
    description: "",
    SKU: "",
    brand: "",
    listed: true,
    quantity_per_box: "",
    product_tags: [],
    product_custom_options: [],
    tags_list: [],
    custom_options_list: [],
    product_categories_list: [],
  };

  addNew = false;

  async componentDidMount() {
    try {
      const tags_list = await axios.get("admin/products-tags");
      const categories_list = await axios.get("admin/product-categories");
      this.setState({
        tags_list: tags_list.data.data,
        product_categories_list: categories_list.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.product_category !== prevState.product_category) {
        this.setState({
          product_category: this.props.data.product_category,
        });
      }
      if (this.props.data.product_cover !== prevState.product_cover) {
        this.setState({ product_cover: this.props.data.product_cover });
      }
      if (this.props.data.name !== prevState.name) {
        this.setState({ name: this.props.data.name });
      }
      if (this.props.data.price !== prevState.price) {
        this.setState({ price: this.props.data.price });
      }
      if (this.props.data.sale_price !== prevState.sale_price) {
        this.setState({ sale_price: this.props.data.sale_price });
      }
      if (this.props.data.description !== prevState.description) {
        this.setState({ description: this.props.data.description });
      }
      if (this.props.data.SKU !== prevState.SKU) {
        this.setState({ SKU: this.props.data.SKU });
      }
      if (this.props.data.brand !== prevState.brand) {
        this.setState({ brand: this.props.data.brand });
      }
      if (this.props.data.listed !== prevState.listed) {
        this.setState({ listed: this.props.data.listed });
      }
      if (this.props.data.quantity_per_box !== prevState.quantity_per_box) {
        this.setState({ quantity_per_box: this.props.data.quantity_per_box });
      }
      if (this.props.data.product_tags !== prevState.product_tags) {
        this.setState({ product_tags: this.props.data.product_tags });
      }
      if (
        this.props.data.product_custom_options !==
        prevState.product_custom_options
      ) {
        this.setState({
          product_custom_options: this.props.data.product_custom_options,
        });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        product_category: "",
        product_cover: "",
        name: "",
        price: "",
        sale_price: "",
        description: "",
        SKU: "",
        brand: "",
        listed: true,
        quantity_per_box: "",
        product_tags: [],
        custom_options: [],
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        product_category: "",
        product_cover: "",
        name: "",
        price: "",
        sale_price: "",
        description: "",
        SKU: "",
        brand: "",
        listed: true,
        quantity_per_box: "",
        product_tags: [],
        custom_options: [],
      });
    }
    this.addNew = false;
  }

  handleSubmit = async () => {
    const product = {
      id: this.state.id,
      name: this.state.name,
      price: Number(this.state.price),
      description: this.state.description,
      sale_price: Number(this.state.sale_price),
      SKU: this.state.SKU,
      brand: this.state.brand,
      listed: this.state.listed,
      quantity_per_box: Number(this.state.quantity_per_box),
      product_category_id: this.state.product_category.id,
      product_tags: [],
    };
    if (this.state.product_tags) {
      product.product_tags = this.state.product_tags.map((tag) => {
        return tag.id;
      });
    }
    if (this.props.data !== null) {
      // Update Product
      try {
        await axios.put(`admin/products/${this.state.id}`, product);
      } catch (error) {
        alert("Error: " + error);
      }
    } else {
      // Create product
      delete product.id;
      try {
        await axios.post(`admin/products/`, product);
      } catch (error) {
        alert("Error: " + error);
      }
    }
    this.props.handleSidebar(false, true);
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let {
      product_category,
      product_cover,
      name,
      price,
      sale_price,
      description,
      SKU,
      brand,
      listed,
      quantity_per_box,
      product_tags,
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
          <FormGroup className="text-center">
            <img className="img-fluid" src={product_cover} alt={name} />
            <div className="d-flex flex-wrap justify-content-between mt-2">
              <label
                className="btn btn-flat-primary"
                htmlFor="update-image"
                color="primary"
              >
                Upload Image
                <input
                  type="file"
                  id="update-image"
                  hidden
                  onChange={(e) =>
                    this.setState({
                      product_cover: URL.createObjectURL(e.target.files[0]),
                    })
                  }
                />
              </label>
              <Button
                color="flat-danger"
                onClick={() => this.setState({ product_cover: "" })}
              >
                Remove Image
              </Button>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="data-name">Product Name</Label>
            <Input
              type="text"
              value={name}
              placeholder=""
              onChange={(e) => this.setState({ name: e.target.value })}
              id="data-name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-name">Product Description</Label>
            <Input
              type="text"
              value={description}
              placeholder=""
              onChange={(e) => this.setState({ description: e.target.value })}
              id="data-description"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Category</Label>
            <Select
              name="categories"
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              value={product_category}
              options={this.state.product_categories_list}
              className="React"
              classNamePrefix="select"
              onChange={(category) =>
                this.setState({ product_category: category })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-price">Product Price (EGP)</Label>
            <Input
              type="text"
              value={price}
              placeholder=""
              onChange={(e) => this.setState({ price: e.target.value })}
              id="data-price"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-sale_price">Sale Price (EGP)</Label>
            <Input
              type="text"
              value={sale_price}
              placeholder=""
              onChange={(e) => this.setState({ sale_price: e.target.value })}
              id="data-sale_price"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Tags</Label>
            <Select
              isMulti
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.id}
              closeMenuOnSelect={false}
              name="product_tags"
              value={product_tags}
              options={this.state.tags_list}
              className="React"
              classNamePrefix="select"
              onChange={(product_tags) => this.setState({ product_tags })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-brand">Brand</Label>
            <Input
              type="text"
              value={brand}
              placeholder="Blends"
              onChange={(e) => this.setState({ brand: e.target.value })}
              id="data-brand"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-SKU">SKU</Label>
            <Input
              type="text"
              value={SKU}
              placeholder="Blends"
              onChange={(e) => this.setState({ SKU: e.target.value })}
              id="data-SKU"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-quantity_per_box">Quantity Per Box</Label>
            <Input
              type="text"
              value={quantity_per_box}
              placeholder="Blends"
              onChange={(e) =>
                this.setState({ quantity_per_box: e.target.value })
              }
              id="data-quantity_per_box"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-listed">Listed</Label>
            <Input
              type="select"
              name="listed"
              id="listed"
              value={listed}
              onChange={(e) => this.setState({ listed: e.target.value })}
            >
              <option value={true}>Listed</option>
              <option value={false}>Not Listed</option>
            </Input>
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
