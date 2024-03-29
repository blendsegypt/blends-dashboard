import React from "react";
import * as Icon from "react-feather";
const navigationConfig = [
  {
    id: "statistics",
    title: "Statistics",
    type: "item",
    icon: <Icon.PieChart size={18} />,
    permissions: ["admin"],
    navLink: "/",
  },
  {
    type: "groupHeader",
    groupTitle: "General Management",
  },
  {
    id: "users",
    title: "Users",
    type: "item",
    icon: <Icon.User size={20} />,
    navLink: "/app/user/list",
  },
  {
    id: "areas",
    title: "Areas",
    type: "item",
    icon: <Icon.MapPin size={20} />,
    navLink: "/areas/list",
  },
  {
    id: "orders",
    title: "Orders",
    type: "item",
    icon: <Icon.Box size={20} />,
    navLink: "/orders/list",
  },
  {
    id: "branches",
    title: "Branches",
    type: "item",
    icon: <Icon.Home size={20} />,
    navLink: "/branch/list",
  },
  {
    id: "products",
    title: "Products",
    type: "collapse",
    icon: <Icon.Coffee size={20} />,
    children: [
      {
        id: "internal_categories",
        title: "Internal Categories",
        type: "item",
        icon: <Icon.Tool size={20} />,
        navLink: "/internal_categories/list",
      },
      {
        id: "categories",
        title: "Categories",
        type: "item",
        icon: <Icon.Menu size={20} />,
        navLink: "/categories/list",
      },
      {
        id: "products_list",
        title: "Products List",
        type: "item",
        icon: <Icon.Tool size={20} />,
        navLink: "/products/list",
      },
      {
        id: "products_tags",
        title: "Tags",
        type: "item",
        icon: <Icon.Hash size={20} />,
        navLink: "/products_tags/list",
      },
      {
        id: "products_custom_options",
        title: "Custom Options",
        type: "item",
        icon: <Icon.Edit size={20} />,
        navLink: "/products_options/list",
      },
    ],
  },
  {
    type: "groupHeader",
    groupTitle: "Stock Management",
  },
  {
    id: "inventory",
    title: "Inventory",
    type: "item",
    icon: <Icon.Book size={20} />,
    navLink: "/inventory/list",
  },
  {
    id: "shipments",
    title: "Shipments",
    type: "item",
    icon: <Icon.Calendar size={20} />,
    navLink: "/shipments/list",
  },
  {
    type: "groupHeader",
    groupTitle: "Offers & Promocodes",
  },
  {
    id: "promocodes",
    title: "Promocodes",
    type: "item",
    icon: <Icon.Gift size={20} />,
    navLink: "/promocodes/list",
  },
  {
    id: "banners",
    title: "Banners (In-App)",
    type: "item",
    icon: <Icon.MessageSquare size={20} />,
    navLink: "/banners/list",
  },
];

export default navigationConfig;
