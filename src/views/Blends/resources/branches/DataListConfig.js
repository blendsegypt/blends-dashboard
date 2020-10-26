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
  Active: "success",
  Busy: "warning",
  Closed: "danger",
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
        style={{ marginLeft: "20px" }}
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
        status: "Active",
        name: "Fleming 1",
        type: "Dispatching Point",
        max_parallel_orders: 7,
        working_days: [
          { label: "Sat", value: "sat" },
          { label: "Sun", value: "sun" },
          { label: "Mon", value: "mon" },
          { label: "Tue", value: "tue" },
          { label: "Wed", value: "wed" },
          { label: "Thu", value: "thu" },
        ],
        opens_at: "09:00",
        closes_at: "15:00",
      },
      {
        id: 2,
        status: "Busy",
        name: "Smouha 1",
        type: "Dispatching Point",
        max_parallel_orders: 10,
        working_days: [
          { label: "Sat", value: "sat" },
          { label: "Sun", value: "sun" },
        ],
        opens_at: "09:00",
        closes_at: "15:00",
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
        name: "Branch Name",
        selector: "name",
        sortable: true,
        minWidth: "150px",
        cell: (row) => (
          <p title={row.name} className="text-truncate text-bold-500 mb-0">
            {row.name}
          </p>
        ),
      },
      {
        name: "Type",
        selector: "type",
        sortable: true,
      },
      {
        name: "Branch Status",
        selector: "status",
        sortable: true,
        cell: (row) => (
          <Chip
            className="m-0"
            color={chipColors[row.status]}
            text={row.status}
          />
        ),
      },
      {
        name: "Max. Parallel Orders",
        selector: "max_parallel_orders",
        sortable: true,
        cell: (row) => `${row.max_parallel_orders}`,
      },
      {
        name: "Working Days",
        selector: "working_days",
        sortable: true,
        cell: (row) => {
          return row.working_days.map((day, index) => {
            if (index === row.working_days.length - 1) return `${day.label}`;
            return `${day.label}, `;
          });
        },
      },
      {
        name: "Opens At",
        selector: "opens_at",
        sortable: true,
        cell: (row) => `${row.opens_at}`,
      },
      {
        name: "Closes At",
        selector: "closes_at",
        sortable: true,
        cell: (row) => `${row.closes_at}`,
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
