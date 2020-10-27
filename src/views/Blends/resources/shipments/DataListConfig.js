import React, { Component } from "react";
import DataTable from "react-data-table-component";
import { Button } from "reactstrap";
import classnames from "classnames";
import { history } from "../../../../history";
import { Edit, Trash, ChevronDown, Check, Plus } from "react-feather";
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
  "In Use": "success",
  Consumed: "warning",
  Expired: "danger",
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
        style={{ marginLeft: "20px" }}
        size={20}
        onClick={() => {
          //Delete Item
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
        remaining_quantity: 48,
        purchased_quantity: 50,
        expiry_date: new Date(2020, 10, 27),
      },
      {
        product_id: 2,
        branch: "Fleming",
        product_name: "Lay's Chicken Chips (30g)",
        remaining_quantity: 0,
        purchased_quantity: 50,
        expiry_date: new Date(2025, 11, 17),
      },
      {
        product_id: 1,
        branch: "Smouha",
        product_name: "Lay's Tomatoes Chips (30g)",
        remaining_quantity: 0,
        purchased_quantity: 50,
        expiry_date: new Date(2010, 11, 17),
      },
    ];

    // Calculate Shipments derived properties
    const today = new Date();
    data.forEach((shipment) => {
      // Check if shipment is consumed
      if (shipment.remaining_quantity > 0) {
        shipment.status = "In Use";
      } else {
        shipment.status = "Consumed";
      }
      // Calculate Expires after days
      let expires_after = Math.floor(
        (shipment.expiry_date - today) / (1000 * 60 * 60 * 24)
      ); //Convert ms to days
      shipment.expires_after = `${expires_after} Days`;
      // Check if shipment is expired
      if (shipment.expiry_date - today < 0) {
        shipment.status = "Expired";
        shipment.expires_after = "Expired";
      }
    });

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
        name: "Shipment Status",
        sortable: true,
        cell: (row) => {
          return (
            <Chip
              className="m-0"
              color={chipColors[row.status]}
              text={row.status}
            />
          );
        },
      },
      {
        name: "Expires After",
        selector: "expires_after",
        sortable: true,
        cell: (row) => `${row.expires_after}`,
      },
      {
        name: "Remaining Quantity",
        selector: "remaining_quantity",
        sortable: true,
        cell: (row) => <b>{row.remaining_quantity}</b>,
      },
      {
        name: "Purchased Quantity",
        selector: "purchased_quantity",
        sortable: true,
        cell: (row) => `${row.purchased_quantity}`,
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
      value,
      currentData,
      sidebar,
      rowsPerPage,
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
          sortIcon={<ChevronDown />}
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={{
            color: "primary",
            icon: <Check className="vx-icon" size={12} />,
            label: "",
            size: "sm",
          }}
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
