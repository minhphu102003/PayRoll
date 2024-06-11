import { Router } from "express";
import { createEmployee, getEmployees, getEmployee, updateEmployee, deleteEmployee } from "../controllers/employee.controller.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";
import { checkExistingUser } from "../middlewares/verifySignup.js";

const router = Router();


router.post("/", createEmployee);
router.get("/", getEmployees);

  router
    .route('/:employeeId')
    .get(getEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee)


// router.post("/", [verifyToken, isAdmin, checkExistingUser], createEmployee);
// router.get("/", [verifyToken, isAdmin, checkExistingUser], getEmployees);
// router.put("/:employeeId", [verifyToken, isAdmin, checkExistingUser], updateEmployee); 
// router.delete("/:employeeId", [verifyToken, isAdmin, checkExistingUser], deleteEmployee);


router.get("/:employeeId", [verifyToken, isAdmin, checkExistingUser], getEmployee);
export default router;
