import React, { Component } from "react";
import { Button } from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { history } from "../../../../history";
import {
  Edit,
  Trash,
  ChevronDown,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import { connect } from "react-redux";
import {
  getData,
  getInitialData,
  deleteData,
  updateData,
  addData,
  filterData,
} from "../../../../redux/actions/data-list/";
import Sidebar from "./DataListSidebar";
import Chip from "../../../../components/@vuexy/chips/ChipComponent";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";

import "../../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../../assets/scss/pages/data-list.scss";

const chipColors = {
  true: "success",
  false: "warning",
};

const selectedStyle = {
  rows: {
    selectedHighlighStyle: {
      backgroundColor: "rgba(115,103,240,.05)",
      color: "#7367F0 !important",
      boxShadow: "0 0 1px 0 #7367F0 !important",
      "&:hover": {
        transform: "translateY(0px) !important",
      },
    },
  },
};

const ActionsComponent = (props) => {
  return (
    <div className="data-list-action">
      <Edit
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          return props.currentData(props.row);
        }}
      />
      <Trash
        className="cursor-pointer"
        style={{ marginLeft: "10px" }}
        size={20}
        onClick={() => {
          //Delete Item
        }}
      />
    </div>
  );
};

const CustomHeader = (props) => {
  return (
    <div className="data-list-header d-flex justify-content-between flex-wrap">
      <div className="actions-left d-flex flex-wrap">
        <Button
          className="add-new-btn"
          color="primary"
          onClick={() => props.handleSidebar(true, true)}
        >
          <Plus size={15} />
          <span className="align-middle">Add New</span>
        </Button>
      </div>
    </div>
  );
};

class DataListConfig extends Component {
  componentDidMount() {
    const data = [
      {
        id: 1,
        product_category_id: 1,
        product_category: "Hot Coffee",
        product_cover: "https://i.ibb.co/RTRQ8hm/Latte.png",
        name: "Latte",
        price: 25,
        sale_price: 0,
        description: "Description of Latte goes here",
        SKU: "352525231",
        brand: "Blends",
        listed: true,
        quantity_per_box: "",
        tags: [
          {
            id: 1,
            value: 1,
            label: "Hot",
            color: "#de4747",
          },
          {
            id: 4,
            value: 4,
            label: "Contains Milk",
            color: "#b3b3b3",
          },
        ],
        custom_options: [
          {
            id: 1,
            label: "Cup Size",
          },
        ],
      },
      {
        id: 1,
        product_category_id: 1,
        product_category: "Hot Coffee",
        product_cover: "https://i.ibb.co/3RbZKK0/Espresso.png",
        name: "Espresso",
        price: 18,
        sale_price: 0,
        description: "Description of Espresso goes here",
        SKU: "352525232",
        brand: "Blends",
        listed: true,
        quantity_per_box: "",
        tags: [
          {
            id: 1,
            value: 1,
            label: "Hot",
            color: "#de4747",
          },
        ],
        custom_options: [
          {
            id: 1,
            label: "Cup Size",
          },
          {
            id: 2,
            label: "Milk Type",
          },
        ],
      },
    ];

    this.setState({
      data,
      allData: data,
      totalPages: 1,
      currentPage: 1,
      rowsPerPage: 1,
      totalRecords: 2,
    });
  }

  state = {
    data: [],
    totalPages: 0,
    currentPage: 0,
    columns: [
      {
        name: "ID",
        selector: "id",
        sortable: true,
        minWidth: "20px",
        cell: (row) => (
          <p title={row.id} className="text-truncate text-bold-500 mb-0">
            {row.id}
          </p>
        ),
      },
      {
        name: "Image",
        selector: "product_cover",
        sortable: true,
        cell: (row) => {
          return (
            <img
              src={row.product_cover}
              alt={row.name}
              style={{ width: "63px", height: "55px" }}
            />
          );
        },
      },
      {
        name: "Name",
        selector: "name",
        sortable: true,
        cell: (row) => `${row.name}`,
      },
      {
        name: "Price",
        selector: "price",
        sortable: true,
        cell: (row) => `${row.price.toFixed(2)} EGP`,
      },
      {
        name: "Sale Price",
        selector: "sale_price",
        sortable: true,
        cell: (row) => {
          if (row.sale_price === 0) return "No Sale";
          return `${row.sale_price.toFixed(2)} EGP`;
        },
      },
      {
        name: "Tags",
        selector: "tags",
        sortable: true,
        cell: (row) => {
          return (
            <div>
              {row.tags.map((tag) => {
                return (
                  <div
                    style={{
                      backgroundColor: tag.color,
                      color: "white",
                      padding: "4px 7px 3px 7px",
                      borderRadius: 15,
                      fontSize: "12px",
                      float: "left",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    {tag.label}
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        name: "Custom Options",
        selector: "custom_options",
        sortable: true,
        cell: (row) => {
          return (
            <div>
              {row.custom_options.map((option) => {
                return (
                  <div
                    style={{
                      float: "left",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    {option.label}
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        name: "SKU",
        selector: "SKU",
        sortable: true,
        cell: (row) => `${row.SKU}`,
      },
      {
        name: "Brand",
        selector: "brand",
        sortable: true,
        cell: (row) => `${row.brand}`,
      },
      {
        name: "Listed",
        selector: "listed",
        sortable: true,
        cell: (row) => (
          <Chip
            className="m-0"
            color={chipColors[row.listed]}
            text={row.listed ? "Listed" : "Not Listed"}
          />
        ),
      },
      {
        name: "Quanatity per Box",
        selector: "quantity_per_box",
        sortable: true,
        cell: (row) => `${row.quantity_per_box}`,
      },
      {
        name: "Actions",
        sortable: true,
        cell: (row) => (
          <ActionsComponent row={row} currentData={this.handleCurrentData} />
        ),
      },
    ],
    allData: [],
    value: "",
    rowsPerPage: 6,
    sidebar: false,
    currentData: null,
    selected: [],
    totalRecords: 0,
    sortIndex: [],
    addNew: "",
  };

  thumbView = this.props.thumbView;

  handleFilter = (e) => {
    this.setState({ value: e.target.value });
    this.props.filterData(e.target.value);
  };

  handleRowsPerPage = (value) => {
    let { parsedFilter, getData } = this.props;
    let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
    history.push(`/data-list/list-view?page=${page}&perPage=${value}`);
    this.setState({ rowsPerPage: value });
    getData({ page: parsedFilter.page, perPage: value });
  };

  handleSidebar = (boolean, addNew = false) => {
    this.setState({ sidebar: boolean });
    if (addNew === true) this.setState({ currentData: null, addNew: true });
  };

  handleDelete = (row) => {
    //Handle deletion of a row
  };

  handleCurrentData = (obj) => {
    this.setState({ currentData: obj });
    this.handleSidebar(true);
  };

  handlePagination = (page) => {
    let { parsedFilter, getData } = this.props;
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 6;
    let urlPrefix = "/branch/list/";
    history.push(
      `${urlPrefix}list-view?page=${page.selected + 1}&perPage=${perPage}`
    );
    getData({ page: page.selected + 1, perPage: perPage });
    this.setState({ currentPage: page.selected });
  };

  render() {
    let {
      columns,
      data,
      allData,
      totalPages,
      value,
      rowsPerPage,
      currentData,
      sidebar,
      totalRecords,
      sortIndex,
    } = this.state;
    return (
      <div
        className={`data-list ${
          this.props.thumbView ? "thumb-view" : "list-view"
        }`}
      >
        <DataTable
          columns={columns}
          data={value.length ? allData : data}
          pagination
          paginationServer
          paginationComponent={() => (
            <ReactPaginate
              previousLabel={<ChevronLeft size={15} />}
              nextLabel={<ChevronRight size={15} />}
              breakLabel="..."
              breakClassName="break-me"
              pageCount={totalPages}
              containerClassName="vx-pagination pagination-center separated-pagination pagination-sm mb-0 mt-2"
              activeClassName="active"
              forcePage={
                this.props.parsedFilter.page
                  ? parseInt(this.props.parsedFilter.page - 1)
                  : 0
              }
              onPageChange={(page) => this.handlePagination(page)}
            />
          )}
          noHeader
          subHeader
          selectableRows
          responsive
          pointerOnHover
          selectableRowsHighlight
          onSelectedRowsChange={(data) =>
            this.setState({ selected: data.selectedRows })
          }
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              handleSidebar={this.handleSidebar}
              handleFilter={this.handleFilter}
              handleRowsPerPage={this.handleRowsPerPage}
              rowsPerPage={rowsPerPage}
              total={totalRecords}
              index={sortIndex}
            />
          }
          sortIcon={<ChevronDown />}
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={{
            color: "primary",
            icon: <Check className="vx-icon" size={12} />,
            label: "",
            size: "sm",
          }}
        />
        <Sidebar
          show={sidebar}
          data={currentData}
          updateData={this.props.updateData}
          addData={this.props.addData}
          handleSidebar={this.handleSidebar}
          thumbView={this.props.thumbView}
          getData={this.props.getData}
          dataParams={this.props.parsedFilter}
          addNew={this.state.addNew}
        />
        <div
          className={classnames("data-list-overlay", {
            show: sidebar,
          })}
          onClick={() => this.handleSidebar(false, true)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataList: state.dataList,
  };
};

export default connect(mapStateToProps, {
  getData,
  deleteData,
  updateData,
  addData,
  getInitialData,
  filterData,
})(DataListConfig);
