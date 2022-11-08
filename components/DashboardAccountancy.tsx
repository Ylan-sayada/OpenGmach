import React, { useEffect, useState } from 'react'
import { Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { authDetails, dashboardAccountancy } from '../data/atoms/dashboardAtoms';
import { Accountancy } from '../types/Accountancy';
import { formatDMY } from '../utils/utilsFunction';
import DatePicker from './DatePicker';
import { useForm } from "react-hook-form";
import { accountancyValidation } from '../data/validations/accountancy';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { ToastState } from '../types/General';
import GenerateToast from './GenerateToast';
import { io } from 'socket.io-client';

export default function DashboardAccountancy() {
    let socket = io();
    let current = 0;
    const auth = useRecoilValue(authDetails);
    const pureAccountancyData = useRecoilValue(dashboardAccountancy);
    let accountancyData = Array.from(pureAccountancyData).sort((el1, el2) => {
        return el2.date - el1.date
    });
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Accountancy>({
        resolver: yupResolver(accountancyValidation)
    });

    useEffect(() => {
        if (pureAccountancyData) {
            setSpecificCheck(Array(pureAccountancyData.length).fill(false));
        }

    }, [pureAccountancyData]);
    if (accountancyData) {
        accountancyData.forEach((element) => {
            current += element.type === 0 ? element.amount : element.amount * -1;
        })
    }


    const [specificCheck, setSpecificCheck] = useState<boolean[]>([]);
    const [allCheck, setAllCheck] = useState(false);
    const [show, setShow] = useState<{ toShow: boolean, mode: string | undefined }>({ toShow: false, mode: undefined });
    const handleClose = () => {
        reset();
        setShow({ toShow: false, mode: undefined })
    };
    const handleShow = (mode: string) => {
        setShow({ toShow: true, mode: mode })
    };
    const [toastShow, setToastShow] = useState<ToastState>({ toShow: false, params: undefined })
    const handleAutomaticClose = (ms: number) => {
        window.setTimeout(() => {
            setToastShow({
                toShow: false,
                params: undefined
            });

        }, ms)
    }
    const handleShowToast = (params: ToastState["params"]) => {
        setToastShow({
            toShow: true,
            params
        })
        handleAutomaticClose(3000);
    }
    const onSubmit = (data: Accountancy) => {
        let dataToSend = {
            ...data,
            date: new Date(data.date).getTime()
        }
        if (show.mode === 'add') {
            axios.post(`${process.env.NEXT_PUBLIC_HOST}api/crud/create/Accountancy`, dataToSend).then(
                () => {
                    handleClose()
                    socket.emit("clientSideAccountancy", { method: 'add', data: dataToSend });
                    handleShowToast({
                        variant: "Success",
                        headerTxt: "Successfully added!",
                        bodyTxt: "The list is updated."
                    })
                }
            )
        } else {
            let id = accountancyData[specificCheck.findIndex((element) => element)]._id
            dataToSend = {
                ...dataToSend,
                _id: id
            }
            axios.put(`${process.env.NEXT_PUBLIC_HOST}api/crud/update/Accountancy`, dataToSend).then(
                () => {
                    handleClose()
                    socket.emit("clientSideAccountancy", { method: 'update', data: { dataToSend } });
                    handleShowToast({
                        variant: "Success",
                        headerTxt: "Successfully Updated!",
                        bodyTxt: "The list is updated."
                    })
                }
            )
        }

    };
    const handleDelete = (element: Accountancy[]) => {
        let id = element.map(el => el._id);
        axios.delete(`${process.env.NEXT_PUBLIC_HOST}api/crud/remove/Accountancy`, { data: id })
        handleClose();
        handleShowToast({
            variant: "Success",
            headerTxt: "Successfully removed!",
            bodyTxt: "All the elements was successfuly removed."
        });
        socket.emit("clientSideAccountancy", { method: 'remove', data: id });
    }
    const onlyOne = (arr: boolean[]) => {
        let count = 0, isInvalid = false;
        arr.forEach((element) => {
            if (element) {
                count++;
            }
        })
        if (count != 1) {
            isInvalid = true;
        }
        return isInvalid;
    }
    const switchConditionalRendering = () => {
        switch (show.mode) {
            case "add":
                return <Form onSubmit={handleSubmit(onSubmit)} >
                    <Form.Label>Submit an : </Form.Label>
                    <Form.Select
                        aria-label="Acountancy type"
                        {...register("type")}
                        defaultValue={0}>
                        <option value={0}>Income</option>
                        <option value={1}>Outcome</option>
                    </Form.Select>
                    {errors.type && <Alert variant='danger'>{errors.type.message}</Alert>}
                    <Form.Label>Amount : </Form.Label>
                    <Form.Control type="number" {...register("amount")} placeholder="1000$" />
                    {errors.amount && <Alert variant='danger'>{errors.amount.message}</Alert>}
                    <DatePicker refInput={register("date")} label='Date' />
                    {errors.date && <Alert variant='danger'>{errors.date.message}</Alert>}
                    <Form.Label >Details : </Form.Label>
                    <Form.Control {...register("details")} as="textarea" rows={3} />
                    {errors.details && <Alert variant='danger'>{errors.details.message}</Alert>}
                    <Button type="submit">Submit</Button>
                </Form>


            case "update":
                let index = specificCheck.findIndex((element) => element);
                return <Form onSubmit={handleSubmit(onSubmit)} >
                    <Form.Label>type : </Form.Label>
                    <Form.Select aria-label="Acountancy type"
                        {...register("type")}
                        defaultValue={accountancyData[index].type}>
                        <option value={0}>Income</option>
                        <option value={1}>Outcome</option>
                    </Form.Select>
                    {errors.type && <Alert variant='danger'>{errors.type.message}</Alert>}
                    <Form.Label>Amount : </Form.Label>
                    <Form.Control type="number" {...register("amount")} defaultValue={accountancyData[index].amount} placeholder="1000$" />
                    {errors.amount && <Alert variant='danger'>{errors.amount.message}</Alert>}
                    <DatePicker label='Date' refInput={register("date")} defaultValue={accountancyData[index].date} />
                    {errors.date && <Alert variant='danger'>{errors.date.message}</Alert>}
                    <Form.Label>Details : </Form.Label>
                    <Form.Control as="textarea"  {...register("details")} rows={3} defaultValue={accountancyData[index].details} />
                    {errors.details && <Alert variant='danger'>{errors.details.message}</Alert>}
                    <Button type="submit">Submit</Button>
                </Form>
            case "delete":
                let accountancyToDelete = accountancyData.filter((accountancy, index) => specificCheck[index])
                return <Alert variant="danger">
                    You choose <b>{accountancyToDelete.length}</b> elements to delete<br />
                    Are you sure ?
                    <Button variant='Danger' onClick={() => handleDelete(accountancyToDelete)}>Delete</Button>
                </Alert>

            default:
                return null
        }
    }

    return (<div id="dashboard_accountancy_container">
        <GenerateToast
            show={toastShow.toShow}
            bodyTxt={toastShow.params?.bodyTxt}
            headerTxt={toastShow.params?.headerTxt}
            variant={toastShow.params?.variant}
        />
        <h2>Accountancy</h2>
        <h4>Current Account</h4>
        <div className={`current-amount ${current > 0 ? "plus" : "minus"}`}>{current}₪</div>
        <div className="space-between">
            <h3>User Management</h3>
            {auth?.permission?.manageAccountancy?.create && <Button variant='success' onClick={() => handleShow("add")}>Add</Button>}
            {auth?.permission?.manageAccountancy?.update && <Button variant='warning' disabled={onlyOne(specificCheck)} onClick={() => handleShow("update")}>Modify </Button>}
            {auth?.permission?.manageAccountancy?.remove && <Button variant='danger' disabled={specificCheck.every((element) => !element)} onClick={() => handleShow("delete")}>Delete </Button>}
        </div>
        <Modal show={show.toShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{show.mode}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    switchConditionalRendering()
                }
            </Modal.Body>
        </Modal>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>
                        <Form.Check
                            type="checkbox"
                            id={`default-checkbox`}
                            checked={allCheck}
                            onChange={() => {
                                let array = Array.from(specificCheck);
                                array.fill(!allCheck)
                                setAllCheck(!allCheck)
                                setSpecificCheck(array);
                            }}
                        /></th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {
                    accountancyData.map((element: Accountancy, index: number) => {

                        return (
                            <tr key={index} className={element.type === 0 ? "income" : "outcome"}>
                                <td><Form.Check
                                    type="checkbox"
                                    id={`default-checkbox`}
                                    checked={specificCheck[index]}
                                    onChange={() => {
                                        let array = Array.from(specificCheck);
                                        array[index] = !specificCheck[index]
                                        setSpecificCheck(array);
                                    }}
                                /></td>
                                <td>{element.type === 0 ? "Income" : "Outcome"}</td>
                                <td>{element.amount}</td>
                                <td>{formatDMY(element.date)}</td>
                                <td>{element.details}</td>
                            </tr>
                        )

                    })
                }
            </tbody>
        </Table>
    </div>
    )
}
