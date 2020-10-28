import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Select from "react-select";

const tagsList = [
  {
    value: 1,
    label: "Hot",
  },
  {
    value: 2,
    label: "Cold",
  },
  {
    value: 3,
    label: "Decaf",
  },
  {
    value: 4,
    label: "Contains Milk",
  },
];

const customOptionsList = [
  {
    value: 1,
    label: "Cup Size",
  },
  {
    value: 2,
    label: "Milk Type",
  },
  {
    value: 3,
    label: "Flavor",
  },
];

const categoriesList = [
  {
    value: 1,
    label: "Hot Coffee",
  },
  {
    value: 2,
    label: "Iced Coffee",
  },
  {
    value: 3,
    label: "Snacks",
  },
];

class DataListSidebar extends Component {
  state = {
    id: "",
    product_category_id: "",
    product_cover: "",
    name: "",
    price: "",
    sale_price: "",
    description: "",
    SKU: "",
    brand: "",
    listed: true,
    quantity_per_box: "",
    tags: [],
    custom_options: [],
  };

  addNew = false;

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (
        this.props.data.product_category_id !== prevState.product_category_id
      ) {
        this.setState({
          product_category_id: this.props.data.product_category_id,
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
      if (this.props.data.tags !== prevState.tags) {
        this.setState({ tags: this.props.data.tags });
      }
      if (this.props.data.custom_options !== prevState.custom_options) {
        this.setState({ custom_options: this.props.data.custom_options });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        product_category_id: "",
        product_cover: "",
        name: "",
        price: "",
        sale_price: "",
        description: "",
        SKU: "",
        brand: "",
        listed: true,
        quantity_per_box: "",
        tags: [],
        custom_options: [],
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        product_category_id: "",
        product_cover: "",
        name: "",
        price: "",
        sale_price: "",
        description: "",
        SKU: "",
        brand: "",
        listed: true,
        quantity_per_box: "",
        tags: [],
        custom_options: [],
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
      product_category_id,
      product_cover,
      name,
      price,
      sale_price,
      description,
      SKU,
      brand,
      listed,
      quantity_per_box,
      tags,
      custom_options,
    } = this.state;
    let selectedCatgory;
    if (data !== null) {
      categoriesList.forEach((category) => {
        if (product_category_id === category.value) selectedCatgory = category;
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
              value={selectedCatgory}
              options={categoriesList}
              className="React"
              classNamePrefix="select"
              onChange={(category) =>
                this.setState({ product_category_id: category })
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
              closeMenuOnSelect={false}
              name="tags"
              value={tags}
              options={tagsList}
              className="React"
              classNamePrefix="select"
              onChange={(tags) => this.setState({ tags })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Custom Options</Label>
            <Select
              isMulti
              closeMenuOnSelect={false}
              name="custom-options"
              value={custom_options}
              options={customOptionsList}
              className="React"
              classNamePrefix="select"
              onChange={(custom_options) => this.setState({ custom_options })}
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
