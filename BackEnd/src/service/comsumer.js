import KafkaConfig from "./config.js";
import Employee from "../models/Employee.js";
import { TOPICHR, TOPICMIDDLEWARE } from "../config.js";
import { WebSocketServer, WebSocket } from 'ws';

export default function setupKafkaConsumers(wss) {
    const kafkaConfig = new KafkaConfig();

    kafkaConfig.consume(TOPICHR, async (value) => {
        try {
            console.log("Receive message: ", value);
            const eventData = JSON.parse(value);
            let EventType = eventData.EventType;

            if (EventType !== undefined) {
                const Data = JSON.parse(eventData.Data);
                if (EventType === "create") {
                    const { Employee_ID, First_Name, Last_Name } = Data;
                    const employee = new Employee({
                        employeeId: Employee_ID,
                        firstName: First_Name,
                        lastName: Last_Name,
                        vacationDays: 0,
                        paidToDate: 0,
                        paidLastYear: 0,
                        payRate: 0,
                        payRateId: 0,
                    });
                    const savedUser = await employee.save();
                    const idMongo = savedUser._id.toString();
                    const employeeCreate = {
                        employeeId: Employee_ID,
                        idMongo: idMongo
                    };
                    const messages = [
                        { EventType: "createSip", Data: JSON.stringify(employeeCreate) },
                    ];
                    kafkaConfig.produceWithoutPartition(TOPICHR, messages);
                    const dataToSendFrontEnd = {
                        event: "create",
                        data: {
                            _id: idMongo,
                            employeeId: Employee_ID,
                            firstName: First_Name,
                            lastName: Last_Name,
                            vacationDays: 0,
                            paidToDate: 0,
                            paidLastYear: 0,
                            payRate: 0,
                            payRateId: 0,
                        }
                    };
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(dataToSendFrontEnd));
                        }
                    });
                }
            } else {
                EventType = eventData[0].EventType;
                const Data = JSON.parse(eventData[0].Data);
                if (EventType === "updateMiddleware") {
                    const {
                        employeeId,
                        firstName,
                        lastName,
                        paidToDate,
                        paidLastYear,
                        vacationDays,
                        idMongo,
                    } = Data;
                    const employee = await Employee.findByIdAndUpdate(idMongo, {
                        employeeId,
                        firstName,
                        lastName,
                        vacationDays,
                        paidToDate,
                        paidLastYear,
                    }, { new: true });
                    if (employee) {
                        const dataToSendFrontEnd = {
                            event: "update",
                            data: {
                                _id: employee._id,
                                employeeId: employee.employeeId,
                                firstName: employee.firstName,
                                lastName: employee.lastName,
                                vacationDays: employee.vacationDays,
                                paidToDate: employee.paidToDate,
                                paidLastYear: employee.paidLastYear,
                                payRate: employee.payRate,
                                payRateId: employee.payRateId,
                            }
                        };
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(dataToSendFrontEnd));
                            }
                        });
                    }
                } else if (EventType === "deleteMiddleware") {
                    const { id } = Data;
                    const employee = await Employee.findById(id);
                    if (employee) {
                        await employee.remove();
                        const dataToSendFrontEnd = {
                            event: "delete",
                            data: { _id: employee._id.toString() }
                        };
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(dataToSendFrontEnd));
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error while handling create:", error);
        }
    });

    const kafkaConfigMiddleware = new KafkaConfig("testmiddleware");
    kafkaConfigMiddleware.consume(TOPICMIDDLEWARE, async (value) => {
        try {
            const eventData = JSON.parse(value);
            const EventType = eventData[0].EventType;
            const Data = JSON.parse(eventData[0].Data);
            if (EventType === "create") {
                const { employeeId, firstName, lastName, vacationDays, paidToDate, paidLastYear } = Data;
                const employee = new Employee({
                    employeeId,
                    firstName,
                    lastName,
                    vacationDays,
                    paidToDate,
                    paidLastYear,
                    payRate: 0,
                    payRateId: 0,
                });
                const savedUser = await employee.save();
                const idMongo = savedUser._id.toString();
                const employeeCreate = {
                    employeeId: employeeId,
                    idMongo: idMongo
                };
                const messages = [
                    { EventType: "createSip", Data: JSON.stringify(employeeCreate) },
                ];
                await kafkaConfig.produceWithoutPartition(TOPICMIDDLEWARE, messages);
                const dataToSendFrontEnd = {
                    event: "create",
                    data: {
                        _id: idMongo,
                        employeeId: employeeId,
                        firstName: firstName,
                        lastName: lastName,
                        vacationDays: vacationDays,
                        paidToDate: paidToDate,
                        paidLastYear: paidLastYear,
                        payRate: 0,
                        payRateId: 0,
                    }
                };
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(dataToSendFrontEnd));
                    }
                });
            } else if (EventType === "update") {
                const {
                    employeeId, firstName, lastName, vacationDays, paidToDate,
                    paidLastYear, idMongo
                } = Data;
                const employee = await Employee.findByIdAndUpdate(idMongo, {
                    employeeId, firstName, lastName, vacationDays, paidToDate,
                    paidLastYear, payRate: 0, payRateId: 0,
                }, { new: true });
                if (employee) {
                    const dataToSendFrontEnd = {
                        event: "update",
                        data: {
                            _id: employee._id,
                            employeeId: employee.employeeId,
                            firstName: employee.firstName,
                            lastName: employee.lastName,
                            vacationDays: employee.vacationDays,
                            paidToDate: employee.paidToDate,
                            paidLastYear: employee.paidLastYear,
                            payRate: employee.payRate,
                            payRateId: employee.payRateId,
                        }
                    };
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(dataToSendFrontEnd));
                        }
                    });
                }
            } else if (EventType === "delete") {
                const { id } = Data;
                const employee = await Employee.findById(id);
                if (employee) {
                    await employee.remove();
                    const dataToSendFrontEnd = {
                        event: "delete",
                        data: { _id: employee._id.toString() }
                    };
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(dataToSendFrontEnd));
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error while handling :", error);
        }
    });
}