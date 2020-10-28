import React, { Suspense, lazy } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { history } from "./history";
import { connect } from "react-redux";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import { ContextLayout } from "./utility/context/Layout";

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

//Coupons Page
const Coupons = lazy(() => import("./views/Blends/resources/coupons/ListView"));

// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
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
const mapStateToProps = (state) => {
  return {
    user: state.auth.login.userRole,
  };
};

const AppRoute = connect(mapStateToProps)(RouteConfig);

class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          {/* Blends Start */}
          <AppRoute path="/" component={ecommerceDashboard} exact />
          <AppRoute path="/app/user/list" component={userList} />
          <AppRoute path="/app/user/edit" component={userEdit} />
          <AppRoute path="/branch/list" component={BranchesList} />
          <AppRoute path="/orders/list" component={OrdersList} />
          <AppRoute
            path="/internal_categories/list"
            component={InternalCategoriesList}
          />
          <AppRoute path="/categories/list" component={ProductsCategories} />
          <AppRoute path="/products_tags/list" component={ProductsTags} />
          <AppRoute path="/products_options/list" component={ProductsOptions} />
          <AppRoute path="/inventory/list" component={Inventory} />
          <AppRoute path="/shipments/list" component={Shipments} />
          <AppRoute path="/coupons/list" component={Coupons} />
          {/* Blends End */}
          <AppRoute path="/misc/error/404" component={error404} fullLayout />
          <AppRoute path="/pages/login" component={Login} fullLayout />
          <AppRoute component={error404} fullLayout />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
