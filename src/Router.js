import React, { Suspense, lazy } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { history } from "./history";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import { ContextLayout } from "./utility/context/Layout";
import { connect } from "react-redux";
import axios, { authInterceptor } from "./axios";

// Route-based code splitting
const Login = lazy(() => import("./views/pages/authentication/login/Login"));
const error404 = lazy(() => import("./views/pages/misc/error/404"));

/*
 *
 * Blends Routes
 *
 */

// Dashboard
const ecommerceDashboard = lazy(() =>
  import("./views/Blends/dashboard/EcommerceDashboard")
);
// Users
const userList = lazy(() => import("./views/Blends/resources/user/list/List"));
const userEdit = lazy(() => import("./views/Blends/resources/user/edit/Edit"));

// Areas
const AreasList = lazy(() => import("./views/Blends/resources/areas/ListView"));

//Branches
const BranchesList = lazy(() =>
  import("./views/Blends/resources/branches/ListView")
);

//Orders
const OrdersList = lazy(() =>
  import("./views/Blends/resources/orders/ListView")
);

//Internal Categories
const InternalCategoriesList = lazy(() =>
  import("./views/Blends/resources/internal-categories/ListView")
);

//Products Categories
const ProductsCategories = lazy(() =>
  import("./views/Blends/resources/categories/ListView")
);

//Products List
const ProductsList = lazy(() =>
  import("./views/Blends/resources/products-list/ListView")
);

//Products Tags
const ProductsTags = lazy(() =>
  import("./views/Blends/resources/products-tags/ListView")
);

//Products Options
const ProductsOptions = lazy(() =>
  import("./views/Blends/resources/products-options/ListView")
);

//Inventory Page
const Inventory = lazy(() =>
  import("./views/Blends/resources/inventory/ListView")
);

//Shipments Page
const Shipments = lazy(() =>
  import("./views/Blends/resources/shipments/ListView")
);

//Promocodes Page
const Promocodes = lazy(() =>
  import("./views/Blends/resources/promocodes/ListView")
);

//Banners Page
const Banners = lazy(() => import("./views/Blends/resources/banners/ListView"));

// Set Layout and Component Using App Route
const RouteConfig = ({
  loggedIn,
  component: Component,
  fullLayout,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (!loggedIn) {
        return <Redirect to="/pages/login" />;
      }
      return (
        <ContextLayout.Consumer>
          {(context) => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout;
            return (
              <LayoutTag {...props} permission={props.user}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            );
          }}
        </ContextLayout.Consumer>
      );
    }}
  />
);

const AppRoute = RouteConfig;

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
    };
  }
  async componentDidMount() {
    // Test the validity of access token
    try {
      authInterceptor.activate();
      await axios.get("admin/branches");
    } catch (error) {
      const statusCode = error.response.status;
      console.log(error.response);
      if (statusCode === 401) {
        localStorage.setItem("token", null);
        history.push("/pages/login");
      }
    }
  }
  render() {
    const accessToken = localStorage.getItem("token");
    const loggedIn = accessToken;
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history} basename={"dashboard"}>
        <Switch>
          {/* Blends Start */}
          <AppRoute
            path="/pages/login"
            component={Login}
            fullLayout
            loggedIn={true}
          />
          <AppRoute
            path="/"
            component={ecommerceDashboard}
            exact
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/app/user/list"
            component={userList}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/app/user/edit"
            component={userEdit}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/areas/list"
            component={AreasList}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/branch/list"
            component={BranchesList}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/orders/list"
            component={OrdersList}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/internal_categories/list"
            component={InternalCategoriesList}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/categories/list"
            component={ProductsCategories}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/products_tags/list"
            component={ProductsTags}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/products_options/list"
            component={ProductsOptions}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/inventory/list"
            component={Inventory}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/shipments/list"
            component={Shipments}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/promocodes/list"
            component={Promocodes}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/products/list"
            component={ProductsList}
            loggedIn={loggedIn}
          />
          <AppRoute
            path="/banners/list"
            component={Banners}
            loggedIn={loggedIn}
          />
          {/* Blends End */}
          <AppRoute path="/misc/error/404" component={error404} fullLayout />
          <AppRoute component={error404} fullLayout />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  isSignedIn: state.auth.login.isSignedIn,
});

export default connect(mapStateToProps, null)(AppRouter);
