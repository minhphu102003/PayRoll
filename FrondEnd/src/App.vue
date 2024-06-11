<template>
  <div>
    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner"><HeaderComponent ref="headerComponent" /></div>
      <!-- /navbar-inner -->
    </div>
    <div class="wrapper">
      <div class="container">
        <div class="row">
          <div class="span3">
            <SidebarComponent
              ref="sideBarComponent"
              @changeComponent="handleChangeComponent"
              :Data="componentData"
            />
            <!--/.sidebar-->
          </div>
          <!--/.span3-->
          <div class="span9">
            <component
              :is="currentComponent"
              :data="componentData"
              @changeComponent="handleChangeComponent"
            />
            <!--/.content-->
          </div>
          <!--/.span9-->
        </div>
      </div>
      <!--/.container-->
    </div>
    <div class="footer">
      <div class="container">
        <b class="copyright">&copy; 2014 Admin - DaoNguyen </b>All rights
        reserved.
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import IndexComponnet from "./components/IndexComponnet.vue";
import SidebarComponent from "./components/SidebarComponent.vue";
import EmployeeComponent from "./components/EmployeeComponent.vue";
import ErrorComponent from "./components/ErrorComponent.vue";
import ProductComponent from "./components/ProductComponent.vue";
import UpdateEmployee from "./components/UpdateEmployee.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    SidebarComponent,
    IndexComponnet,
    EmployeeComponent,
    ErrorComponent,
    ProductComponent,
    UpdateEmployee,
  },
  data() {
    return {
      currentComponent: IndexComponnet, // Component mặc định
      componentData: null, // Dữ liệu được truyền vào component
    };
  },
  methods: {
    handleChangeComponent({ componentName, data }) {
      this.currentComponent = componentName;
      this.componentData = data;
    },
  },
};
</script>

<style>
@import url("http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600");
@import "./assets/bootstrap/css/bootstrap.min.css";
@import "./assets/bootstrap/css/bootstrap-responsive.min.css";
@import "./assets/css/theme.css";
@import "./assets/images/icons/css/font-awesome.css";
</style>
