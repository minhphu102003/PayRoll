<template>
  <div class="module">
    <div class="module-head">
      <h3>Employee</h3>
      <div class="container-add-employee">
        <i class="fa-solid fa-plus"></i>
        <a href="#" @click="handleAddClick">Create New Employee</a>
      </div>
    </div>
    <div class="module-body table">
      <div class="boxTool">
        <div id="DataTables_Table_0_length" class="dataTables_length">
          <label
            >Show
            <select
              size="1"
              name="DataTables_Table_0_length"
              v-model="limit"
              aria-controls="DataTables_Table_0"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            entries</label
          >
        </div>
        <div class="dataTables_filter" id="DataTables_Table_0_filter">
          <label
            >Search:
            <input
              type="text"
              aria-controls="DataTables_Table_0"
              @input="handleChangeText"
          /></label>
        </div>
      </div>
      <div class="form-add" v-if="showForm">
        <div class="form-title">
          <h3 v-if="createActive">Add Employee</h3>
          <h3 v-else>Update Employee</h3>
          <i
            @click.stop.prevent="handleCloseFormAdd"
            class="fa-solid fa-xmark"
          ></i>
        </div>
        <div class="form-container">
          <label for="firstName">First Name</label>
          <input
            type="text"
            placeholder="First Name"
            v-model="this.employee.firstName"
            id="firstName"
          />
        </div>
        <div class="form-container">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            v-model="this.employee.lastName"
            id="lastName"
          />
        </div>
        <div class="form-container">
          <label for=""> Vacations Days</label>
          <input
            type="text"
            placeholder="Vacations Days"
            v-model="this.employee.vacationDays"
          />
        </div>
        <div class="form-container">
          <label for="">Paid To Date</label>
          <input
            type="text"
            placeholder="Paid To Date"
            v-model="this.employee.paidToDate"
          />
        </div>
        <div class="form-container">
          <label for="">Paid Last Year</label>
          <input
            type="text"
            placeholder="Paid Last Year"
            v-model="this.employee.paidLastYear"
          />
        </div>
        <div class="form-container">
          <label for="">Pay Rate</label>
          <input
            type="text"
            placeholder="Pay Rate"
            v-model="this.employee.payRate"
          />
        </div>
        <div class="form-container button-submit">
          <button v-if="createActive" @click.stop.prevent="handleSubmit">
            Add Employee
          </button>
          <button v-else @click.stop.prevent="handleSubmit">
            Update Employee
          </button>
        </div>
      </div>
      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        class="datatable-1 table table-bordered table-striped display"
        width="100%"
      >
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Vacation Days</th>
            <th>Paid To Date</th>
            <th>Paid Last Year</th>
            <th>Pay Rate</th>
            <th>Modifier</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in dataToShow" :key="employee.employeeId">
            <td>{{ employee.firstName }}</td>
            <td>{{ employee.lastName }}</td>
            <td>{{ employee.vacationDays }}</td>
            <td>{{ employee.paidToDate }}</td>
            <td>{{ employee.paidLastYear }}</td>
            <td>{{ employee.payRate }}</td>
            <td class="modifier">
              <a href="#" @click="handleUpdateClick(employee)">Update</a>
              <a href="#" @click.prevent="handleDeleteClick(employee)"
                >Delete</a
              >
            </td>
          </tr>
        </tbody>
      </table>
      <div class="dataTables_info" id="DataTables_Table_0_info">
        Showing {{ startEntry + 1 }} to {{ endEntry }} of
        {{ lengthEntry }} entries
      </div>
      <div
        class="dataTables_paginate paging_two_button btn-group datatable-pagination"
        id="DataTables_Table_0_paginate"
      >
        <a
          class="paginate_enabled_previous"
          tabindex="0"
          role="button"
          id="DataTables_Table_0_previous"
          aria-controls="DataTables_Table_0"
          @click="preClick"
          ><span>Previous</span><i class="icon-chevron-left shaded"></i></a
        ><a
          class="paginate_enabled_next"
          tabindex="0"
          role="button"
          id="DataTables_Table_0_next"
          aria-controls="DataTables_Table_0"
          @click="nextClick"
          ><span>Next</span><i class="icon-chevron-right shaded"></i
        ></a>
      </div>
    </div>
  </div>
  <!--/.module-->
</template>

<script>
import axios from "axios";
export default {
  props: ["data"],
  data() {
    return {
      limit: 10,
      current: 0,
      searchText: "",
      filteredData: "",
      showForm: false,
      createActive: true,
      localData: this.data,
      employee: {
        _id: null,
        employeeId: null,
        firstName: null,
        lastName: null,
        vacationDays: null,
        paidToDate: null,
        paidLastYear: null,
        payRate: null,
        payRateId: null,
      },
    };
  },
  created() {
    this.setupWebSocket();
  },
  computed: {
    startEntry() {
      return this.current;
    },
    endEntry() {
      if (this.searchText.trim() !== "") {
        return Math.min(
          parseInt(this.current) + parseInt(this.limit),
          this.filteredData.length
        );
      }
      return Math.min(
        parseInt(this.current) + parseInt(this.limit),
        this.localData.length
      );
    },
    lengthEntry() {
      if (this.searchText.trim() !== "") {
        return this.filteredData.length > 0 ? this.filteredData.length : 0;
      }
      return this.localData.length;
    },
    dataToShow() {
      if (this.searchText.trim() !== "") {
        return this.slicedData1;
      } else {
        return this.slicedData;
      }
    },
    slicedData() {
      var endPoint = Math.min(
        parseInt(this.current) + parseInt(this.limit),
        this.localData.length
      );
      return this.localData.slice(this.current, endPoint);
    },
    slicedData1() {
      var endPoint = Math.min(
        parseInt(this.current) + parseInt(this.limit),
        this.filteredData.length
      );
      return this.filteredData.slice(this.current, endPoint);
    },
  },
  methods: {
    setupWebSocket() {
      const socket = new WebSocket("ws://localhost:5000");

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received data from server:", message);

        const { event: eventType, data } = message;

        if (eventType === "create") {
          this.handleCreateEvent(data);
        } else if (eventType === "update") {
          this.handleUpdateEvent(data);
        } else if (eventType === "delete") {
          this.handleDeleteEvent(data);
        }
      };
      socket.onopen = () => {
        console.log("WebSocket connection established");
      };
      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    },
    handleCreateEvent(employee) {
      this.localData.push(employee);
      console.log(
        `Employee created: ${employee.firstName} ${employee.lastName}`
      );
    },
    handleUpdateEvent(employee) {
      const index = this.localData.findIndex((em) => em._id === employee._id);
      if (index !== -1) {
        this.localData[index] = employee;
        console.log(
          `Employee updated: ${employee.firstName} ${employee.lastName}`
        );
      }
    },
    handleDeleteEvent(employee) {
      const index = this.localData.findIndex((em) => em._id === employee._id);
      if (index !== -1) {
        this.localData.splice(index, 1);
        console.log(
          `Employee deleted: ${employee.firstName} ${employee.lastName}`
        );
      }
    },
    preClick() {
      if (this.current >= this.limit) {
        this.current -= this.limit;
      }
    },
    nextClick() {
      this.current = Math.min(
        parseInt(this.current) + parseInt(this.limit),
        this.data.length
      );
    },
    handleChangeText(event) {
      this.searchText = event.target.value;
      this.filteredData = this.localData.filter((employee) =>
        employee.lastName.includes(this.searchText)
      );
      this.current = 0;
    },
    handleAddClick() {
      this.createActive = true;
      this.showForm = true;
    },
    handleCloseFormAdd() {
      this.showForm = false;
    },
    async handleUpdateClick(employee) {
      this.createActive = false;
      this.showForm = true;
      this.employee._id = employee._id;
      this.employee.firstName = employee.firstName;
      this.employee.lastName = employee.lastName;
      this.employee.vacationDays = employee.vacationDays;
      this.employee.paidToDate = employee.paidToDate;
      this.employee.paidLastYear = employee.paidLastYear;
      this.employee.payRate = employee.payRate;
      this.employee.employeeId = employee.employeeId;
      this.employee.payRate = employee.payRate;
      this.employee.payRateId = employee.payRateId;
    },
    // Chưa ép kiểu được employeeId về int
    async handleSubmit() {
      if (this.createActive) {
        // ! Nếu đúng thì làm thêm mới
        if (this.employee.payRateId === null) {
          this.employee.payRateId = 0;
        }
        if (this.employee.employeeId === null) {
          const min = 10000000;
          const max = 99999999;
          this.employee.employeeId = parseInt(
            Math.floor(Math.random() * (max - min + 1)) + min
          );
        }
        try {
          const respone = await axios.post(
            "http://localhost:4000/api/kafka",
            this.employee
          );
          if (respone.status === 200) {
            const {
              _id,
              employeeId,
              firstName,
              lastName,
              paidLastYear,
              paidToDate,
              payRate,
              payRateId,
              vacationDays,
            } = respone.data.data;
            const employee = {
              _id: _id,
              employeeId: employeeId,
              firstName: firstName,
              lastName: lastName,
              paidLastYear: paidLastYear,
              paidToDate: paidToDate,
              payRate: payRate,
              payRateId: payRateId,
              vacationDays: vacationDays,
            };
            this.localData.push(employee);
            window.alert("Cập nhật thành công");
          }
        } catch (err) {
          console.log(err);
          window.alert("Có lỗi xảy ra ! ", err);
        }
      } else {
        // Không đúng thì làm cập nhật
        try {
          const _id = this.employee._id;
          console.log(this.employee);
          const respone = await axios.put(
            `http://localhost:4000/api/kafka/${_id}`,
            this.employee
          );
          if (respone.status === 200) {
            const {
              _id,
              employeeId,
              firstName,
              lastName,
              paidLastYear,
              paidToDate,
              payRate,
              payRateId,
              vacationDays,
            } = respone.data.data;
            const employee = {
              _id,
              employeeId,
              firstName,
              lastName,
              paidLastYear,
              paidToDate,
              payRate,
              payRateId,
              vacationDays,
            };
            const index = this.localData.findIndex(
              (em) => em._id === employee._id
            );
            if (index !== -1) {
              this.localData[index] = employee;
            }
            window.alert(
              `Cập nhật dữ liệu nhân viên ${this.employee.firstName} ${this.employee.lastName} thành công !`
            );
          }
        } catch (err) {
          console.log(err);
          window.alert(`Đã có lỗi xảy ra ${err}`);
        }
      }
      this.showForm = false;
    },

    async handleDeleteClick(employee) {
      const _id = employee._id;
      try {
        const respone = await axios.delete(
          `http://localhost:4000/api/kafka/${_id}`
        );
        if (respone.status === 200) {
          console.log(respone.data.data);
          const { employeeId } = respone.data.data;
          const index = this.localData.findIndex((em) => em._id === employeeId);
          if (index !== -1) {
            this.localData.splice(index, 1);
            window.alert(
              `Xóa thành công nhân viên ${employee.firstName} ${employee.lastName}`
            );
          }
        }
      } catch (err) {
        console.log(err);
        window.alert(`Đã có lỗi xảy ra ${err}`);
      }
    },
  },
};
</script>

<style scoped>
.boxTool {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}
.module-body.table {
  padding: 15px 0 35px 0;
}
.dataTables_info {
  float: left;
  padding-top: 5px;
  padding-left: 10px;
}
.datatable-pagination {
  float: right;
  padding: 5px;
}
.module-head {
  display: flex;
  align-items: center;
}
.modifier {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.container-add-employee {
  margin-left: 20px;
  border: 1px solid blue;
  padding: 2px 5px;
  border-radius: 5px;
  cursor: pointer;
}

.module-body.table {
  position: relative;
}

.form-add {
  position: absolute;
  width: 50%;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  border: 1px solid black;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
}

.form-title {
  position: relative;
}

.form-title h3 {
  text-align: center;
}

.form-title i {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  padding: 8px;
  border-radius: 2px;
  background-color: rgb(229, 195, 195);
  cursor: pointer;
}
.form-container {
  padding-left: 50px;
  margin-bottom: 10px;
}

.radio {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.form-container input[type="text"] {
  width: 80%;
}

.form-container select {
  width: 80%;
}

.container-radio {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 30px;
}

.container-radio label {
  margin-left: 10px;
  margin-bottom: 0;
}

.button-submit {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-submit button {
  padding: 10px 20px;
  border-radius: 8px;
  background-color: aquamarine;
  border: none;
}
</style>
