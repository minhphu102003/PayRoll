import { Router } from "express";
import {sendEmployeeChangeEvent} from "../service/kafka.js";
import router from "./index.routes.js";
import Employee from "../models/Employee.js";

const routes = Router();

// ! Đã test thành công
const createEmployeeMiddleware = async (req, res) => {
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

        const responseData = {
            _id: savedUser._id,
            employeeId: savedUser.employeeId,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            vacationDays: savedUser.vacationDays,
            paidToDate: savedUser.paidToDate,
            paidLastYear: savedUser.paidLastYear,
            payRate: savedUser.payRate,
            payRateId: savedUser.payRateId
        };

        // Gửi sự kiện tạo nhân viên
        await sendEmployeeChangeEvent("create", responseData,"siptest");

        // Trả về dữ liệu nhân viên đã tạo
        return res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error({ success: false, error: error });
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

routes.post("/", createEmployeeMiddleware);

// Đã test thành công
routes.put("/:employeeId",async(req,res)=>{
    try{
        const updateEmployee = await Employee.findByIdAndUpdate(
            req.params.employeeId,
            req.body,
            {
                new: true,
            }
        );
        if( updateEmployee !== null){
            await sendEmployeeChangeEvent("update",updateEmployee,"siptest")
        
            return res.status(200).json({
                success:true,
                data: updateEmployee
            })
        }
        else{
            return res.status(404).json({
                success:false,
                data:"Employee not found"
            });
        }
    }catch(err){
        return res.status(500).json({
            success:false,
            error: err
        })
    }
});

// Đã test thành công 
routes.delete("/:employeeId",async (req,res)=>{
    try{
        const { employeeId } = req.params;
        await Employee.findByIdAndDelete(employeeId);

        await sendEmployeeChangeEvent("delete",{ employeeId: employeeId },"siptest")

        return res.status(200).json({
            success: true,
            data: { employeeId: employeeId }
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            error: err
        })
    }
});


export default routes;