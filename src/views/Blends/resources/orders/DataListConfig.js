import React, { Component } from "react";
import { Button } from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { history } from "../../../../history";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "../../../../axios";
import {
  Edit,
  Trash,
  ChevronDown,
  Plus,
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

import "../../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../../assets/scss/pages/data-list.scss";

const chipColors = {
  Received: "danger",
  Preparing: "warning",
  Delivering: "warning",
  Delivered: "success",
};

function formatDate(date) {
  let d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();
  let hours = "" + d.getHours();
  let minutes = "" + d.getMinutes();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hours.length < 2) hours = "0" + hours;
  if (minutes.length < 2) minutes = "0" + minutes;
  const formattedDay = [year, month, day].join("-");
  const formattedTime = [hours, minutes].join(":");
  return [formattedDay, formattedTime].join(" ");
}

function msToMinutes(ms) {
  return Math.ceil(ms / (1000 * 60));
}

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
    <div style={{ display: "flex", flexDirection: "column" }}>
      {props.row.order_status !== "Delivered" && (
        <Edit
          className="cursor-pointer mr-1"
          size={20}
          onClick={() => {
            return props.currentData(props.row);
          }}
        />
      )}
      <Trash
        className="cursor-pointer"
        style={{ marginTop: "10px" }}
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
      const orders = await axios.get("admin/orders");
      this.setState({
        data: orders.data.data,
        allData: orders.data.data,
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
        name: "Order Number",
        selector: "id",
        sortable: true,
        width: "100px",
        cell: (row) => (
          <p title={row.id} className="text-truncate text-bold-500 mb-0">
            {row.id}
          </p>
        ),
      },
      {
        name: "Ordered",
        selector: "ordered_at",
        sortable: true,
        width: "120px",
        cell: (row) => (
          <span style={{ fontSize: "12px" }}>{formatDate(row.createdAt)}</span>
        ),
      },
      {
        name: "Status",
        selector: "order_status",
        sortable: true,
        width: "110px",
        cell: (row) => (
          <Chip
            className="m-0"
            color={chipColors[row.order_status]}
            text={row.order_status}
          />
        ),
      },
      {
        name: "Customer Phone Number",
        selector: "User.phone_number",
        sortable: true,
        cell: (row) => `${row.User.phone_number}`,
      },
      {
        name: "Delivery Area",
        selector: "Address.Area.name",
        sortable: true,
        cell: (row) => `${row.Address.Area.name}`,
      },
      {
        name: "Branch",
        selector: "Branch.name",
        sortable: true,
        cell: (row) => `${row.Branch.name}`,
      },
      {
        name: "Total",
        selector: "total",
        sortable: true,
        cell: (row) => {
          return (
            <p title={row.total} className="text-truncate text-bold-500 mb-0">
              {row.total} EGP
            </p>
          );
        },
      },
      // {
      //   name: "Ordered Items",
      //   selector: "OrderItems",
      //   sortable: true,
      //   cell: (row) => {
      //     return (
      //       <div style={{ padding: "10px 0 10px 0" }}>
      //         {row.OrderItems.map((item) => {
      //           return (
      //             <div style={{ marginTop: "10px" }}>
      //               <b>
      //                 {item.quantity} x {item.Product.name}
      //               </b>
      //               <br></br>
      //               {JSON.parse(item.options).map((option) => {
      //                 return (
      //                   <span>
      //                     {option.value}
      //                     <br />
      //                   </span>
      //                 );
      //               })}
      //             </div>
      //           );
      //         })}
      //       </div>
      //     );
      //   },
      // },
      {
        name: "Timeline",
        selector: "total",
        sortable: true,
        width: "100px",
        cell: (row) => {
          let startedPreparingIn, deliveringIn, deliveredIn, total;
          if (row.delivered_at === null) {
            row.total_order_time = Math.ceil(
              (new Date() - new Date(row.createdAt)) / (1000 * 60)
            );
            return "Order In Progress";
          }
          startedPreparingIn =
            new Date(row.preparing_at) - new Date(row.createdAt);
          deliveringIn =
            new Date(row.delivering_at) - new Date(row.preparing_at);
          deliveredIn =
            new Date(row.delivered_at) - new Date(row.delivering_at);
          total =
            msToMinutes(startedPreparingIn) +
            msToMinutes(deliveringIn) +
            msToMinutes(deliveredIn);
          row.total_order_time = total;
          return (
            <div style={{ fontSize: "12px", marginTop: "10px" }}>
              <p>
                Started:<br></br>{" "}
                <b>{msToMinutes(startedPreparingIn)} minutes</b>
              </p>
              <p>
                Prepared: <br></br>
                <b>{msToMinutes(deliveringIn)} minutes</b>
              </p>
              <p>
                Delivered: <br></br>
                <b>{msToMinutes(deliveredIn)} minutes</b>
              </p>
            </div>
          );
        },
      },
      {
        name: "Total Time",
        selector: "total",
        sortable: true,
        cell: (row) => {
          return (
            <p
              title={row.total_order_time}
              className="text-truncate text-bold-500 mb-0"
            >
              {row.total_order_time} Minutes
            </p>
          );
        },
      },
      {
        name: "Promocode",
        selector: "Promocode",
        sortable: true,
        cell: (row) => {
          if (!row.PromoCode) return ``;
          return row.PromoCode.code;
        },
      },
      {
        name: "Rating",
        selector: "rating",
        sortable: true,
        cell: (row) => {
          if (!row.rating) return ``;
          return row.rating;
        },
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
    targetRow: null,
    deleteWarning: false,
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
      await axios.delete(`admin/orders/${this.state.targetRow.id}`);
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
            defaultSortField="id"
            defaultSortAsc={false}
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
            responsive
            pointerOnHover
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
