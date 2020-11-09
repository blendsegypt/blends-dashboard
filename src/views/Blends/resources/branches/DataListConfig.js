import React, { Component } from "react";
import { Button } from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { history } from "../../../../history";
import axios from "../../../../axios";
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
import SweetAlert from "react-bootstrap-sweetalert";
import Sidebar from "./DataListSidebar";
import Chip from "../../../../components/@vuexy/chips/ChipComponent";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";

import "../../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../../assets/scss/pages/data-list.scss";

const chipColors = {
  open: "success",
  busy: "warning",
  closed: "danger",
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
          props.deleteWarning(props.row);
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
  async componentDidMount() {
    await this.getData();
  }

  getData = async () => {
    try {
      const branches = await axios.get("admin/branches");
      console.log(branches.data.data);
      this.setState({
        data: branches.data.data,
        allData: branches.data.data,
        totalPages: 1,
        currentPage: 1,
        rowsPerPage: 1,
        totalRecords: 2,
      });
    } catch (error) {
      alert("Error occured!: " + error);
    }
  };

  state = {
    data: [],
    totalPages: 0,
    currentPage: 0,
    columns: [
      {
        name: "ID",
        selector: "id",
        sortable: true,
        minWidth: "150px",
      },
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
        cell: (row) => {
          if (row.type === "type1") return `Dispatching Point`;
          return `${row.type}`;
        },
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
          if (!row.working_hours[0].days) return;
          return row.working_hours[0].days.map((day, index) => {
            if (index === row.working_hours[0].days.length - 1) return `${day}`;
            return `${day}, `;
          });
        },
      },
      {
        name: "Opens At",
        selector: "opens_at",
        sortable: true,
        cell: (row) => `${row.working_hours[0].opens_at}`,
      },
      {
        name: "Closes At",
        selector: "closes_at",
        sortable: true,
        cell: (row) => `${row.working_hours[0].closes_at}`,
      },
      {
        name: "Actions",
        sortable: true,
        cell: (row) => (
          <ActionsComponent
            row={row}
            currentData={this.handleCurrentData}
            deleteWarning={this.deleteWarning}
          />
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
    deleteWarning: false,
    targetRow: null,
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
    if (!boolean) this.getData();
  };

  deleteWarning = (row) => {
    this.setState({ targetRow: row, deleteWarning: true });
  };

  handleDelete = async () => {
    try {
      await axios.delete(`admin/branches/${this.state.targetRow.id}`);
      this.getData();
    } catch (error) {
      alert("Error: " + error);
    }
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
      <>
        <SweetAlert
          title="Are you sure?"
          warning
          show={this.state.deleteWarning}
          showCancel
          reverseButtons
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          onConfirm={() => {
            this.handleDelete();
            this.setState({ deleteWarning: false });
          }}
          onCancel={() => {
            this.setState({ deleteWarning: false });
          }}
        >
          You won't be able to revert this!
        </SweetAlert>
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
      </>
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
