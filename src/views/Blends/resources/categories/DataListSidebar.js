import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import axios from "../../../../axios";

class DataListSidebar extends Component {
  state = {
    id: "",
    name: "",
    internal_category: "",
    internal_category_id: "",
    internalCategories: [{ id: 1, name: "TestLabel" }],
  };

  addNew = false;

  async componentDidMount() {
    try {
      const internalCategories = await axios.get("admin/internal-categories");
      console.log(internalCategories.data.data);
      this.setState({
        internalCategories: internalCategories.data.data,
      });
      if (this.props.data === null) {
        this.setState({
          internal_category_id: internalCategories.data.data[0].id,
        });
      }
    } catch (error) {
      alert("Error: Couldnt retrieve internal categories / " + error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.name !== prevState.name) {
        this.setState({ name: this.props.data.name });
      }
      if (
        this.props.data.internal_category_id !== prevState.internal_category_id
      ) {
        this.setState({
          internal_category_id: this.props.data.internal_category_id,
        });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        name: "",
        internal_category_id: "",
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        name: "",
        internal_category_id: "",
      });
    }
    this.addNew = false;
  }

  handleSubmit = async () => {
    if (this.props.data !== null) {
      //Update Product Category
      const { name, internal_category_id, id } = this.state;
      try {
        await axios.put(`admin/product-categories/${id}`, {
          name,
          internal_category_id: Number(internal_category_id),
        });
        this.props.handleSidebar(false, true);
      } catch (error) {
        alert("Couldn't add product category / " + error);
      }
    } else {
      const { name, internal_category_id } = this.state;
      try {
        await axios.post("admin/product-categories/", {
          name,
          internal_category_id: Number(internal_category_id),
        });
        this.props.handleSidebar(false, true);
      } catch (error) {
        alert("Couldn't add product category / " + error);
      }
    }
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let { name, internal_category_id } = this.state;
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
            <Label for="data-name">Category Name</Label>
            <Input
              type="text"
              value={name}
              placeholder=""
              onChange={(e) => this.setState({ name: e.target.value })}
              id="data-name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-name">Internal Category</Label>
            <Input
              type="select"
              name="select-internal-category"
              id="selector"
              value={internal_category_id}
              onChange={(e) => {
                this.setState({ internal_category_id: e.target.value });
              }}
            >
              {this.state.internalCategories.map((internalCategory) => {
                return (
                  <option value={internalCategory.id}>
                    {internalCategory.name}
                  </option>
                );
              })}
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
