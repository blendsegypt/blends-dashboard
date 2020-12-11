import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import classnames from "classnames";
import axios from "../../../../axios";
import FormData from "form-data";

class DataListSidebar extends Component {
  state = {
    id: "",
    description: "",
    product_id: null,
    banner_image_url: null,
  };

  async componentDidMount() {
    try {
      const response = await axios.get("admin/products");
      const products_list = response.data.data.filter(
        (product) => !product.retail
      );
      this.setState({
        products_list: products_list,
      });
    } catch (error) {
      alert("An error occured while fetching Products");
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.description !== prevState.description) {
        this.setState({ description: this.props.data.description });
      }
      if (this.props.data.product_id !== prevState.product_id) {
        this.setState({ product_id: this.props.data.product_id });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        banner_image_url: null,
        description: "",
        product_id: null,
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        banner_image_url: null,
        description: "",
        product_id: null,
      });
    }
    this.addNew = false;
  }

  handleSubmit = async () => {
    const banner = {
      description: this.state.description,
      product_id: this.state.product_id.id,
    };
    let imageURL = null;
    //If there's an image then upload it to S3 first
    if (this.state.banner_image_url) {
      let data = new FormData();
      data.append("file", this.state.banner_image_url, this.state.name);
      try {
        const response = await axios.post("admin/images/upload", data, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          },
        });
        imageURL = response.data.data.URL;
        banner.banner_image_url = imageURL;
      } catch (error) {
        alert("An error occured while uploading the image");
      }
    }
    if (this.props.data !== null) {
      //Update Internal Category
      try {
        await axios.put(`admin/banners/${this.state.id}`, banner);
      } catch (error) {
        alert("Error: " + error);
      }
    } else {
      // Add new internal category
      try {
        await axios.post(`admin/banners/`, banner);
      } catch (error) {
        alert("Error: " + error);
      }
    }
    this.props.handleSidebar(false, true);
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let { description, product_id } = this.state;
    let selectedProduct = product_id;
    if (this.props.data !== null) {
      selectedProduct = this.state.products_list.find(
        (product) => product.id === product_id
      );
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
            <p>Banner dimensions must by 650 * 280</p>
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
                      banner_image_url: e.target.files[0],
                    })
                  }
                />
              </label>
              <Button
                color="flat-danger"
                onClick={() => this.setState({ banner_image_url: "" })}
              >
                Remove Image
              </Button>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="data-popularity">Product</Label>
            <Select
              name="categories"
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              value={selectedProduct}
              options={this.state.products_list}
              className="React"
              classNamePrefix="select"
              onChange={(product) => this.setState({ product_id: product })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-desc">Offer description</Label>
            <Input
              type="text"
              value={description}
              placeholder=""
              onChange={(e) => this.setState({ description: e.target.value })}
              id="data-desc"
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
