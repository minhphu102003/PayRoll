  import Employee from "../models/Employee.js";
  import mongoose from "mongoose";


export const createEmployee = async (req, res) => {
    try {
        const { employeeId, firstName, lastName, vacationDays, paidToDate, paidLastYear, payRate, payRateId } = req.body;

        // creating a new Employee object
        const employee = new Employee({
            employeeId,
            firstName,
            lastName,
            vacationDays,
            paidToDate,
            paidLastYear,
            payRate,
            payRateId
        });

        // saving the new employee
        const savedUser = await employee.save();

        return res.status(200).json({
            success: true, data: {
                _id: savedUser._id,
                employeeId: savedUser.employeeId,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                vacationDays: savedUser.vacationDays,
                paidToDate: savedUser.paidToDate,
                paidLastYear: savedUser.paidLastYear,
                payRate: savedUser.payRate,
                payRateId: savedUser.payRateId
            }
        });
    } catch (error) {
        console.error({success: true, data: error});
    }
};

export const getEmployee = async (req, res, next) => {
    const employee = await Employee.findById(req.params.employeeId);
    return res.json({ success: true, data: employee });
};

export const getEmployees = async (req, res, next) => {
    const employees = await Employee.find();
    return res.json({ success: true, data: employees });
}

export const updateEmployee = async (req, res) => {
  try {
    const updateEmployee = await Employee.findByIdAndUpdate(
      req.params.employeeId,
      req.body,
      {
        new: true,
      }
    );
    if(updateEmployee !== null){
      return res.status(204).json({ success: true, data: updateEmployee });
    }
    return res.status(404).json({
      success:false,
      data: "Employee not found"
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    // Xóa nhân viên
    await Employee.findByIdAndDelete(employeeId);

    // Trả về phản hồi
    return res.status(204).json({ success: true, data: {employeeId: employeeId} });
  } catch (error) {
    return res.status(500).json({ success: false, error: error});
  }
};

