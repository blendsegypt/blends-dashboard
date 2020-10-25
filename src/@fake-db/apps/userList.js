import mock from "../mock";
const users = [
  {
    id: 1,
    firstName: "Khalid",
    lastName: "Khalil",
    avatar: require("../../assets/img/portrait/small/avatar-s-17.jpg"),
    email: "",
    phoneNumber: "01149050646",
    platform: "iOS",
    country: "Egypt",
    is_verified: false,
  },
];

// GET DATA
mock.onGet("/api/users/list").reply(200, users);
