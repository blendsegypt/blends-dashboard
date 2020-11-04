import React from "react";
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
} from "reactstrap";
import axios from "../../../../../axios";
import { ContextLayout } from "../../../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import { Edit, Trash2, ChevronDown } from "react-feather";
import { history } from "../../../../../history";
import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../../../assets/scss/pages/users.scss";
import SweetAlert from "react-bootstrap-sweetalert";

class UsersList extends React.Component {
  state = {
    rowData: null,
    warning: false,
    pageSize: 20,
    isVisible: true,
    reload: false,
    collapse: true,
    status: "Opened",
    role: "All",
    selectStatus: "All",
    verified: "All",
    department: "All",
    defaultColDef: {
      sortable: true,
    },
    searchVal: "",
    columnDefs: [
      {
        headerName: "ID",
        field: "id",
        width: 150,
        filter: true,
        headerCheckboxSelectionFilteredOnly: true,
      },
      {
        headerName: "First Name",
        field: "first_name",
        filter: true,
        width: 200,
      },
      {
        headerName: "Last Name",
        field: "last_name",
        filter: true,
        width: 200,
      },
      {
        headerName: "Phone Number",
        field: "phone_number",
        filter: true,
        width: 250,
      },
      {
        headerName: "Platform",
        field: "platform",
        filter: true,
        width: 200,
      },
      {
        headerName: "Actions",
        field: "transactions",
        width: 250,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <Edit
                className="mr-50"
                size={15}
                onClick={() => {
                  const user = this.gridApi.getSelectedRows();
                  history.push("/app/user/edit", user[0]);
                }}
              />
              <Trash2
                size={15}
                onClick={() => {
                  let selectedData = this.gridApi.getSelectedRows();
                  this.setState({
                    targetUser: selectedData[0].id,
                    warning: true,
                  });
                }}
              />
            </div>
          );
        },
      },
    ],
  };

  async componentDidMount() {
    try {
      const users = await axios.get("/users");
      users.data.data.forEach((user) => {
        user.phone_number = `0${user.phone_number}`;
      });
      const rowData = users.data.data;
      this.setState({ rowData });
    } catch (error) {
      console.log(error);
    }
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  filterData = (column, val) => {
    var filter = this.gridApi.getFilterInstance(column);
    var modelObj = null;
    if (val !== "all") {
      modelObj = {
        type: "equals",
        filter: val,
      };
    }
    filter.setModel(modelObj);
    this.gridApi.onFilterChanged();
  };

  filterSize = (val) => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val));
      this.setState({
        pageSize: val,
      });
    }
  };
  updateSearchQuery = (val) => {
    this.gridApi.setQuickFilter(val);
    this.setState({
      searchVal: val,
    });
  };

  refreshCard = () => {
    this.setState({ reload: true });
    setTimeout(() => {
      this.setState({
        reload: false,
        role: "All",
        selectStatus: "All",
        verified: "All",
        department: "All",
      });
    }, 500);
  };

  toggleCollapse = () => {
    this.setState((state) => ({ collapse: !state.collapse }));
  };
  onEntering = () => {
    this.setState({ status: "Opening..." });
  };
  onEntered = () => {
    this.setState({ status: "Opened" });
  };
  onExiting = () => {
    this.setState({ status: "Closing..." });
  };
  onExited = () => {
    this.setState({ status: "Closed" });
  };
  removeCard = () => {
    this.setState({ isVisible: false });
  };

  deleteUser = async () => {
    let selectedData = this.gridApi.getSelectedRows();
    const { status } = await axios.delete(`/users/${this.state.targetUser}`);
    this.gridApi.updateRowData({ remove: selectedData });
  };

  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    return (
      <Row className="app-user-list">
        <SweetAlert
          title="Are you sure?"
          warning
          show={this.state.warning}
          showCancel
          reverseButtons
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          onConfirm={() => {
            this.deleteUser();
            this.setState({ warning: false });
          }}
          onCancel={() => {
            this.setState({ warning: false });
          }}
        >
          You won't be able to revert this!
        </SweetAlert>
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="ag-theme-material ag-grid-table">
                <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                  <div
                    className="sort-dropdown"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <UncontrolledDropdown className="ag-dropdown p-1">
                      <DropdownToggle tag="div">
                        1 - {pageSize} of 150
                        <ChevronDown className="ml-50" size={15} />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          tag="div"
                          onClick={() => this.filterSize(20)}
                        >
                          20
                        </DropdownItem>
                        <DropdownItem
                          tag="div"
                          onClick={() => this.filterSize(50)}
                        >
                          50
                        </DropdownItem>
                        <DropdownItem
                          tag="div"
                          onClick={() => this.filterSize(100)}
                        >
                          100
                        </DropdownItem>
                        <DropdownItem
                          tag="div"
                          onClick={() => this.filterSize(150)}
                        >
                          150
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <Button
                      color="primary"
                      style={{ marginLeft: 20 }}
                      onClick={() =>
                        history.push("/app/user/edit", { addNew: true })
                      }
                    >
                      Add New
                    </Button>
                  </div>
                  <div className="filter-actions d-flex">
                    <Input
                      className="w-50 mr-1 mb-1 mb-sm-0"
                      type="text"
                      placeholder="search..."
                      onChange={(e) => this.updateSearchQuery(e.target.value)}
                      value={this.state.searchVal}
                    />
                    <div className="dropdown actions-dropdown">
                      <UncontrolledButtonDropdown>
                        <DropdownToggle className="px-2 py-75" color="white">
                          Action
                          <ChevronDown className="ml-50" size={15} />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem tag="a">
                            <Trash2 size={15} />
                            <span className="align-middle ml-50">Delete</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
                  </div>
                </div>
                {this.state.rowData !== null ? (
                  <ContextLayout.Consumer>
                    {(context) => (
                      <AgGridReact
                        gridOptions={{}}
                        rowSelection="multiple"
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onGridReady={this.onGridReady}
                        colResizeDefault={"shift"}
                        animateRows={true}
                        floatingFilter={true}
                        pagination={true}
                        pivotPanelShow="always"
                        paginationPageSize={pageSize}
                        resizable={true}
                        enableRtl={context.state.direction === "rtl"}
                      />
                    )}
                  </ContextLayout.Consumer>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default UsersList;
