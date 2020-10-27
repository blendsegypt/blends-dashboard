import React, { Component } from "react";
import { Button } from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import { history } from "../../../../history";
import { Edit, Trash, ChevronDown, Plus, Check } from "react-feather";
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
  "In Stock": "success",
  "Below Safe": "warning",
  "Below Minimum": "danger",
  "Out of Stock": "danger",
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
    </div>
  );
};

class DataListConfig extends Component {
  componentDidMount() {
    const data = [
      {
        product_id: 1,
        branch: "Fleming",
        product_name: "Lay's Tomatoes Chips (30g)",
        actual_stock: 50,
        safe_stock: 30,
        min_stock: 10,
      },
      {
        product_id: 2,
        branch: "Fleming",
        product_name: "Lay's Chicken Chips (30g)",
        actual_stock: 20,
        safe_stock: 30,
        min_stock: 10,
      },
      {
        product_id: 1,
        branch: "Smouha",
        product_name: "Lay's Tomatoes Chips (30g)",
        actual_stock: 0,
        safe_stock: 0,
        min_stock: 0,
      },
      {
        product_id: 2,
        branch: "Smouha",
        product_name: "Lay's Chicken Chips (30g)",
        actual_stock: 0,
        safe_stock: 0,
        min_stock: 0,
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
        name: "Product ID",
        selector: "product_id",
        sortable: true,
        minWidth: "30px",
        cell: (row) => (
          <p
            title={row.product_id}
            className="text-truncate text-bold-500 mb-0"
          >
            {row.product_id}
          </p>
        ),
      },
      {
        name: "Branch",
        selector: "branch",
        sortable: true,
        cell: (row) => `${row.branch}`,
      },
      {
        name: "Product Name",
        selector: "product_name",
        sortable: true,
        cell: (row) => `${row.product_name}`,
      },
      {
        name: "Stock Status",
        sortable: true,
        cell: (row) => {
          let status;
          if (row.actual_stock > row.safe_stock) {
            status = "In Stock";
          } else if (row.actual_stock > row.min_stock) {
            status = "Below Safe";
          } else if (row.actual_stock > 0) {
            status = "Below Minimum";
          } else {
            status = "Out of Stock";
          }
          return (
            <Chip className="m-0" color={chipColors[status]} text={status} />
          );
        },
      },
      {
        name: "Actual Stock",
        selector: "actual_stock",
        sortable: true,
        cell: (row) => <b>{row.actual_stock}</b>,
      },
      {
        name: "Safe Stock",
        selector: "safe_stock",
        sortable: true,
        cell: (row) => `${row.safe_stock}`,
      },
      {
        name: "Minimum Stock",
        selector: "min_stock",
        sortable: true,
        cell: (row) => `${row.min_stock}`,
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
    let { columns, data, allData, value, currentData, sidebar } = this.state;
    return (
      <div
        className={`data-list ${
          this.props.thumbView ? "thumb-view" : "list-view"
        }`}
      >
        <DataTable
          columns={columns}
          data={value.length ? allData : data}
          noHeader
          selectableRows
          responsive
          pointerOnHover
          selectableRowsHighlight
          onSelectedRowsChange={(data) =>
            this.setState({ selected: data.selectedRows })
          }
          customStyles={selectedStyle}
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
