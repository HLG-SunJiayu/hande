import Login from "../views/login";
import Page1 from "../views/page1";
import daiban from "../components/component-daiban.vue";
import yiban from "../components/component-yiban.vue";
import wode from "../components/component-wode.vue";
import Page2 from "../views/page2.vue"
let route = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/page1",
    name: "page1",
    component: Page1,
    redirect:"/page1/component-daiban",
    children: [
      { path: "component-daiban", component: daiban },
      { path: "component-yiban", component: yiban },
      { path: "component-wode", component: wode },
    ],
  },
  {
    path: "/page2",
    name: "page2",
    component: Page2,
  },
  
];

export default route;
