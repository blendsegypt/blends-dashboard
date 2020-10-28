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
  Active: "success",
  Expired: "warning",
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

function formatDate(d) {
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

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
        id: 1,
        code: "FORDER",
        type: "Fixed Discount",
        start_date: new Date(2020, 10, 27),
        end_date: new Date(2020, 11, 27),
        max_usage_per_user: 1,
        minimum_order_value: 0,
        percentage_discount: "",
        fixed_discount: 30,
        free_item_id: 0,
        free_item: "",
        cashback_amount: "",
      },
      {
        id: 2,
        code: "FREELOT",
        type: "Free Item",
        start_date: new Date(2020, 3, 10),
        end_date: new Date(2020, 5, 10),
        max_usage_per_user: 1,
        minimum_order_value: 50,
        percentage_discount: "",
        fixed_discount: 0,
        free_item_id: 4,
        free_item: "Lotus Biscuits (15g)",
        cashback_amount: "",
      },
    ];

    // Calculate Coupons "status" property
    const today = new Date();
    data.forEach((coupon) => {
      let status = "Active";
      if (coupon.end_date - today < 0) {
        status = "Expired";
      }
      coupon.status = status;
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
        name: "ID",
        selector: "id",
        sortable: true,
        cell: (row) => (
          <p title={row.id} className="text-truncate text-bold-500 mb-0">
            {row.id}
          </p>
        ),
      },
      {
        name: "Code",
        selector: "code",
        sortable: true,
        cell: (row) => `${row.code}`,
      },
      {
        name: "Type",
        selector: "type",
        sortable: true,
        cell: (row) => <b>{row.type}</b>,
      },
      {
        name: "Status",
        selector: "status",
        sortable: false,
        cell: (row) => (
          <Chip
            className="m-0"
            color={chipColors[row.status]}
            text={row.status}
          />
        ),
      },
      {
        name: "Start Date",
        selector: "start_date",
        sortable: true,
        cell: (row) => `${formatDate(row.start_date)}`,
      },
      {
        name: "End Date",
        selector: "end_date",
        sortable: true,
        cell: (row) => `${formatDate(row.end_date)}`,
      },
      {
        name: "Maximum usage per User",
        selector: "max_usage_per_user",
        sortable: true,
        cell: (row) => <b>{row.max_usage_per_user}</b>,
      },
      {
        name: "Minimum Order value",
        selector: "minimum_order_value",
        sortable: true,
        cell: (row) => `${row.minimum_order_value}`,
      },
      {
        name: "Percentage Discount",
        selector: "percentage_discount",
        sortable: true,
        cell: (row) => `${row.percentage_discount}`,
      },
      {
        name: "Fixed Discount",
        selector: "fixed_discount",
        sortable: true,
        cell: (row) => `${row.fixed_discount}`,
      },
      {
        name: "Free Item",
        selector: "free_item",
        sortable: true,
        cell: (row) => `${row.free_item}`,
      },
      {
        name: "Cashback Amount",
        selector: "cashback_amount",
        sortable: true,
        cell: (row) => `${row.cashback_amount}`,
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
