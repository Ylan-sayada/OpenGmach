import axios from 'axios';
import { getMonth, format, getYear, isThisMonth, isThisYear, isSameMonth, isSameYear, add } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Table, Form, Button, ButtonGroup, Badge, Modal, Alert } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { io } from 'socket.io-client';
import { authDetails, dashboardReminders } from '../data/atoms/dashboardAtoms';
import { dayOfTheWeek, IMPORTANCE, maxDayOfEachMonth, month } from '../data/definitions/constant';
import { ToastState } from '../types/General';
import { Schedule } from '../types/Schedule';
import GenerateToast from './GenerateToast';
import ReminderForm from './ReminderForm';

export default function DashboardReminder() {
    let socket = io();
    let reminders = useRecoilValue(dashboardReminders);
    const auth = useRecoilValue(authDetails);
    const [remindersThisMonth, setRemindersThisMonth] = useState(reminders.filter(reminder => isThisMonth(reminder.taskDate) && isThisYear(reminder.taskDate)))
    const [selectedDate, setselectedDate] = useState({ month: getMonth(new Date()), year: getYear(new Date()) });
    let beginToCount = -1;
    let remindersObj: { [key: number]: Schedule[] } = {};
    remindersThisMonth.forEach((reminder) => {
        let dateWithUtc = add(new Date(reminder.taskDate), { hours: 8 });

        if (!remindersObj[dateWithUtc.getUTCDate()]) {
            remindersObj[dateWithUtc.getUTCDate()] = []
        }
        remindersObj[dateWithUtc.getUTCDate()].push(reminder)
    })
    const [toastShow, setToastShow] = useState<ToastState>({ toShow: false, params: undefined })
    const [show, setShow] = useState<{ toShow: boolean, mode: string | undefined, indexReminder: [number, number] | undefined }>({ toShow: false, mode: undefined, indexReminder: undefined });
    const handleClose = () => setShow({ toShow: false, mode: undefined, indexReminder: undefined });
    const handleShow = (mode: string, indexReminder: [number, number] | undefined) => {
        setShow({ toShow: true, mode, indexReminder })
    };
    const handleAutomaticClose = (ms: number) => {
        window.setTimeout(() => {
            setToastShow({
                toShow: false,
                params: undefined
            })
        }, ms)
    }

    const handleShowToast = (params: ToastState["params"]) => {
        setToastShow({
            toShow: true,
            params
        })
        handleAutomaticClose(3000);
    }
    useEffect(() => {
        if (reminders) {
            let currentSelectedDate = new Date(selectedDate.year, selectedDate.month, 1);
            let currentRemindersArr = reminders.filter(reminder => isSameMonth(currentSelectedDate, reminder.taskDate) && isSameYear(currentSelectedDate, reminder.taskDate))
            setRemindersThisMonth(currentRemindersArr);
        }
    }, [selectedDate, setRemindersThisMonth, reminders]);
    const handleSubmit = async (data: Schedule) => {
        let task = {
            ...data,
            taskDate: new Date(data.taskDate).getTime()
        };
        let response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}api/crud/create/Schedule`, task)
        handleClose()
        if (response.data) {
            handleShowToast({
                variant: "Success",
                headerTxt: "Succesfully added reminder!",
                bodyTxt: "You can now see him on your schedule"
            })
            socket.emit("clientSideReminder", { method: "add", data: task })
        } else {
            handleShowToast({
                variant: "Danger",
                headerTxt: "Error!",
                bodyTxt: "An error occured..."
            })
        }
    }
    const handleUpdate = async (data: Schedule) => {
        let index = show.indexReminder as [number, number]
        let response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}api/crud/update/Schedule`, {
            ...data,
            _id: remindersObj[index[0]][index[1]]._id,
            taskDate: new Date(data.taskDate).getTime()
        })
        handleClose()
        if (response.data) {
            handleShowToast({
                variant: "Success",
                headerTxt: "Succesfully updated reminder!",
                bodyTxt: "You can now see him on your schedule"
            })
        } else {
            handleShowToast({
                variant: "Danger",
                headerTxt: "Error!",
                bodyTxt: "An error occured..."
            })
        }
    }
    const handleDelete = async () => {
        let index = show.indexReminder as [number, number];
        let response = await axios.delete(`${process.env.NEXT_PUBLIC_HOST}api/crud/remove/Schedule`, { data: [remindersObj[index[0]][index[1]]._id] })
        handleClose()
        if (response.data) {
            handleShowToast({
                variant: "Success",
                headerTxt: "Succesfully removed reminder!",
                bodyTxt: "The list a now updated"
            })
        } else {
            handleShowToast({
                variant: "Danger",
                headerTxt: "Error!",
                bodyTxt: "An error occured..."
            })
        }
    }
    const switchConditionalRendering = () => {
        let index, reminder;
        if (show.indexReminder) {
            index = show.indexReminder as [number, number]
            reminder = remindersObj[index[0]][index[1]];
        }
        switch (show.mode) {
            case "add":
                return <ReminderForm handleResult={handleSubmit} />

            case "update":
                return <ReminderForm handleResult={handleUpdate} defaultValue={reminder} />
            case "delete":
                return <>
                    <Alert variant="danger">
                        Are you sure to delete this task?
                    </Alert>
                    <Button variant='danger' onClick={() => handleDelete()}>Delete</Button>
                </>

            default:
                return null
        }
    }

    return (<div id="dashboard_reminder_container" style={{ minHeight: "80vh" }}>
        <GenerateToast
            show={toastShow.toShow}
            bodyTxt={toastShow.params?.bodyTxt}
            headerTxt={toastShow.params?.headerTxt}
            variant={toastShow.params?.variant}
        />
        <h3>
            Reminders
        </h3>
        <Form.Select value={selectedDate.month} onChange={(e: any) => {
            setselectedDate({
                ...selectedDate,
                month: Number(e.target.value)
            })
        }}>
            {
                month.map((month, index) => {
                    return <option value={index} key={index}>{month}</option>
                })
            }
        </Form.Select>
        <Form.Select value={selectedDate.year} onChange={(e: any) => {
            setselectedDate({
                ...selectedDate,
                year: e.target.value
            })
        }}>
            {
                Array(getYear(new Date()) + 100).fill(0).map((year, index) => {
                    return <option value={index} key={index}>{index}</option>
                })
            }
        </Form.Select>
        {auth?.permission?.manageSchedule?.create && <Button onClick={() => handleShow("add", undefined)}>Add Reminder</Button>}
        <Table bordered style={{ margin: "10px auto", borderColor: 'black' }}>
            <thead style={{ padding: "10px" }}>
                <tr>
                    {dayOfTheWeek.map((day, index) => {
                        return <th key={index}>{day}</th>
                    })}
                </tr>
            </thead>
            <tbody >
                {


                    Array(format(new Date(0, selectedDate.month, selectedDate.year), "eeee") === "Saturday" ? 6 : 5).fill(0).map((nothing, indexMonth) => {
                        let firstDay = format(new Date(0, selectedDate.month, selectedDate.year), "eeee");
                        let lastDay = maxDayOfEachMonth[selectedDate.month];
                        return <tr key={indexMonth}>
                            {
                                Array(7).fill(0).map((nothing, index) => {
                                    if ((indexMonth === 0) && (firstDay === dayOfTheWeek[index])) {
                                        beginToCount = 1;
                                    }
                                    let isAPartOfTheMonth = (beginToCount >= 1 && beginToCount <= lastDay);
                                    let indexOfReminder = beginToCount;
                                    return <th key={index} style={{ "display": "column" }}>
                                        <b className='day'>{isAPartOfTheMonth && beginToCount++}</b>
                                        <br />
                                        {
                                            remindersObj[beginToCount - 1] !== undefined && <> {
                                                remindersObj[indexOfReminder].map((reminder, index) => {
                                                    return <>

                                                        <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                                                            <Badge bg={["success", "warning", "danger"][reminder.importance]}>{IMPORTANCE[reminder.importance]}</Badge>
                                                            <div className='description'>{reminder.taskName}</div>
                                                            <ButtonGroup aria-label="Basic example">
                                                                {auth?.permission?.manageSchedule?.update && <Button variant="primary" onClick={() => handleShow("update", [indexOfReminder, index])}>Update</Button>}
                                                                {auth?.permission?.manageSchedule?.remove && <Button variant="danger" onClick={() => handleShow("delete", [indexOfReminder, index])}>Delete</Button>}
                                                            </ButtonGroup>
                                                        </div><br /></>

                                                })
                                            }
                                            </>
                                        }

                                    </th>
                                })
                            }
                        </tr>
                    })}

            </tbody>
        </Table>
        <Modal show={show.toShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    switchConditionalRendering()
                }
            </Modal.Body>

        </Modal>
    </div >
    )
}
