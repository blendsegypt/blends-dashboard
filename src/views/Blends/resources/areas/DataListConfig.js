import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
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
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import axios from "../../../../axios";
import SweetAlert from "react-bootstrap-sweetalert";

import "../../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../../assets/scss/pages/data-list.scss";
import Map from "./Map";

function formatDate(date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
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
      const areas = await axios.get("admin/areas");
      console.log(areas);
      this.setState({
        data: areas.data.data,
        allData: areas.data.data,
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
        cell: (row) => (
          <p title={row.name} className="text-truncate text-bold-500 mb-0">
            {row.id}
          </p>
        ),
      },
      {
        name: "name",
        selector: "name",
        sortable: true,
        cell: (row) => `${row.name}`,
      },
      {
        name: "Area Fence",
        selector: "area_fence",
        cell: (row) => {
          return (
            <span
              style={{ color: "#2960c4" }}
              onClick={() => {
                //convert array of "lat,lng" to proper json array
                const path = row.area_fence.map((coord) => {
                  const coordinates = coord.split(",");
                  return {
                    lat: Number(coordinates[0]),
                    lng: Number(coordinates[1]),
                  };
                });
                this.setState({ current_path: path });
                if (row.area_fence.length === 0)
                  this.setState({ newFence: true });
                this.toggleFencing(row.id);
              }}
            >
              {row.area_fence.length > 0 ? "Edit" : "Add"} Fence
            </span>
          );
        },
      },
      {
        name: "Created At",
        selector: "createdAt",
        sortable: true,
        cell: (row) => `${formatDate(row.createdAt)}`,
      },
      {
        name: "Updated At",
        selector: "updatedAt",
        sortable: true,
        cell: (row) => `${formatDate(row.createdAt)}`,
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
    fencing: false,
    current_path: [],
  };

  thumbView = this.props.thumbView;

  setPath = (path) => {
    this.setState({ current_path: path });
  };

  updateFence = () => {
    try {
      const area_fence = this.state.current_path.map((coordinate) => {
        return `${coordinate.lat},${coordinate.lng}`;
      });
      axios.put(`admin/areas/${this.state.area_id}`, {
        area_fence,
      });
      window.location.reload(false);
    } catch (error) {
      alert("Error! " + error);
    }
  };

  toggleFencing = (area_id) => {
    this.setState({ fencing: !this.state.fencing, area_id });
  };

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
    if (boolean === false) {
      this.getData();
    }
    if (addNew === true) this.setState({ currentData: null, addNew: true });
  };

  deleteWarning = (row) => {
    this.setState({ targetRow: row, deleteWarning: true });
  };

  handleDelete = async () => {
    try {
      await axios.delete(`admin/areas/${this.state.targetRow.id}`);
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
        <Modal
          isOpen={this.state.fencing}
          toggle={this.toggleFencing}
          size={"lg"}
          style={{ width: "100%" }}
        >
          <ModalHeader toggle={this.toggleModal}>Edit Area</ModalHeader>
          <ModalBody>
            <Map currentPath={this.state.current_path} setPath={this.setPath} />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.toggleFencing();
                this.updateFence();
              }}
            >
              Save
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <div
          className={`data-list ${
            this.props.thumbView ? "thumb-view" : "list-view"
          }`}
        >
          <DataTable
            defaultSortField="id"
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
