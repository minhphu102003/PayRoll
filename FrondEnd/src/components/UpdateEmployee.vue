<template>
  <div class="container">
    <div id="form">
      <div class="header">
        <div class="back"></div>
        <div class="title">
          <a href="#" @click="handleBackClick">
            <i class="fa-solid fa-chevron-left"></i>
          </a>
          <h3>Update Employee</h3>
        </div>
      </div>
      <div class="content">
        <div class="form-container">
          <label for="firstName">First Name</label>
          <input type="text" placeholder="First Name" id="firstName" />
        </div>
        <div class="form-container">
          <label for="lastName">Last Name</label>
          <input type="text" placeholder="Last Name" id="lastName" />
        </div>
        <div class="form-container">
          <label for=""> Vacations Days</label>
          <input type="text" placeholder="Vacations Days" />
        </div>
        <div class="form-container">
          <label for="">Paid To Date</label>
          <input type="text" placeholder="Paid To Date" />
        </div>
        <div class="form-container">
          <label for="">Paid Last Year</label>
          <input type="text" placeholder="Paid Last Year" />
        </div>
        <div class="form-container">
          <label for=""> Pay Rate</label>
          <input type="text" placeholder="Vacations Days" />
        </div>
      </div>
      <div class="footer">
        <!-- Update thì đơn giản gọi api update sau đó gọi lại api employee list để cập nhật lại khi chuyển về employeecomponent -->
        <div class="button update">Update</div>
        <div class="button cancel">Cancel</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
  methods: {
    handleBackClick() {
      this.$emit("changeComponent", {
        componentName: "EmployeeComponent",
        data: this.data,
      });
    },
  },
};
</script>

<style lang="css"></style>
