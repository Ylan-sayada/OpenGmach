import axios from 'axios';
import * as dateFn from "date-fns";
import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { GrValidate } from "react-icons/gr";
import { TiCancel } from "react-icons/ti";
import { useRecoilValue } from 'recoil';
import { authDetails, dashboardUsers } from '../data/atoms/dashboardAtoms';
import { USER_TYPE } from '../data/definitions/constant';
import { ToastState } from '../types/General';
import { PermissionWithUserType, User, UserRegistration } from '../types/User';
import { onlyOne } from '../utils/utilsFunction';
import DatePicker from './DatePicker';
import GenerateToast from './GenerateToast';
import PermissionForm from './PermissionForm';
import UserForm from './UserForm';

export default function DashboardUsers() {
    const usersData = useRecoilValue(dashboardUsers);
    const auth = useRecoilValue(authDetails);
    useEffect(() => {
        if (usersData) {
            setSpecificCheck(Array(usersData.length).fill(false));
        }
    }, [usersData]);

    const [specificCheck, setSpecificCheck] = useState<boolean[]>([]);
    const [allCheck, setAllCheck] = useState(false);
    const [toastShow, setToastShow] = useState<ToastState>({ toShow: false, params: undefined })
    const [show, setShow] = useState<{ toShow: boolean, mode: string | undefined }>({ toShow: false, mode: undefined });
    const handleClose = () => setShow({ toShow: false, mode: undefined });
    const handleShow = (mode: string) => {
        setShow({ toShow: true, mode: mode })
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
    const handleRegister = async (data: UserRegistration) => {
        try {
            if (data.avatarAsFile) {
                let formData = new FormData()
                formData.append("media", data.avatarAsFile[0])
                const uploadedFileRes = await axios.post(`${process.env.NEXT_PUBLIC_HOST}api/uploadFile`, formData);
                if (uploadedFileRes.status === 200) {
                    let response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}api/crud/create/User`, {
                        ...data,
                        avatar: "/uploads/" + dateFn.format(Date.now(), "dd-MM-Y") + "/" + uploadedFileRes.data.data.linkToFile.media.newFilename,
                        avatarAsFile: undefined
                    })
                    handleClose()
                    if (response.data && uploadedFileRes.status === 200) {
                        handleShowToast({
                            variant: "Success",
                            headerTxt: "Succesfully added user!",
                            bodyTxt: "You can now see him registered as an user.<br/>An activation link was sent on his mail address"
                        })
                    } else {
                        handleShowToast({
                            variant: "Danger",
                            headerTxt: "Error!",
                            bodyTxt: "An error occured..."
                        })
                    }
                }

            }
        } catch (error) {
            handleClose()
            handleShowToast({
                variant: "Danger",
                headerTxt: "Error!",
                bodyTxt: "An error occured..."
            })
            console.log(error);
        }
    }
    const handlePermission = (permission: PermissionWithUserType) => {
        let index = specificCheck.findIndex((element) => element);
        axios.put(`${process.env.NEXT_PUBLIC_HOST}api/crud/update/User`, {
            _id: usersData[index]._id,
            permission: {
                ...permission, userType: undefined
            },
            userType: permission.userType
        }).then(
            (res) => {
                console.log(res);
            }
        )
    }
    const handleDelete = (users: User[]) => {
        let id = users.map(el => el._id);
        axios.delete(`${process.env.NEXT_PUBLIC_HOST}api/crud/remove/User`, { data: id })
        handleClose();
        handleShowToast({
            variant: "Success",
            headerTxt: "Successfully removed!",
            bodyTxt: "All the elements was successfuly removed."
        });
        //socket.emit("clientSideAccountancy", { method: 'remove', data: id });
    }
    const switchConditionalRendering = () => {
        let index;
        switch (show.mode) {
            case "add":
                return <UserForm handleResult={handleRegister} />
            case "update":
                index = specificCheck.findIndex((element) => element);
                return <Form>
                    <Form.Label>First Name : </Form.Label>
                    <Form.Control defaultValue={usersData[index].name} required />
                    <Form.Label >Last Name : </Form.Label>
                    <Form.Control defaultValue={usersData[index].lastName} required />
                    <Form.Label >User Name : </Form.Label>
                    <Form.Control defaultValue={usersData[index].username} required />
                    <Form.Label >Email : </Form.Label>
                    <Form.Control defaultValue={usersData[index].mail} type="mail" required />
                    <DatePicker label="birth date : " defaultValue={usersData[index].birthDate} />
                    <Form.Label>Phone number : </Form.Label>
                    <Form.Control type="tel" id="phone"
                        defaultValue={usersData[index].phone}
                        name="phone"
                        pattern="[0-9]{3}-[0-9]{2}-[0-9]{2}[0-9]{3}"
                        required />
                    <Form.Label>avatar : </Form.Label>
                    <br />
                    <Image roundedCircle src={usersData[index].avatar} alt={`avatar of ${usersData[index].username}`} />
                    <Form.Control type="file" accept="image/*" />
                </Form>
            case "permission":
                index = specificCheck.findIndex((element) => element);
                return <PermissionForm handleResult={handlePermission} defaultValue={{ ...usersData[index].permission, userType: usersData[index].userType }} />
            case "delete":
                let usersToDelete = usersData.filter((user, index) => specificCheck[index])
                console.log(usersToDelete);
                return <Alert variant="danger">
                    You choose <b>{usersToDelete.length}</b> users to delete<br />
                    Are you sure to delete :
                    <br />
                    {
                        usersToDelete.map((user, index) => <p key={index}><b>{user?.name} {user?.lastName}</b></p>)
                    }
                    <Button variant='Danger' onClick={() => handleDelete(usersToDelete)}>Delete</Button>
                </Alert>

            default:
                return null
        }
    }
    return (<div id="dashboardUserManagement">
        <GenerateToast
            show={toastShow.toShow}
            bodyTxt={toastShow.params?.bodyTxt}
            headerTxt={toastShow.params?.headerTxt}
            variant={toastShow.params?.variant}
        />
        <div className="space-between">
            <h3>User Management</h3>
            {auth?.permission?.manageUsers?.create && <Button variant='success' onClick={() => handleShow("add")}>Add</Button>}
            {auth?.permission?.manageUsers?.update && <Button variant='warning' disabled={onlyOne(specificCheck)} onClick={() => handleShow("update")}>Modify </Button>}
            {auth?.permission?.isMainAdmin && <Button variant='secondary' disabled={onlyOne(specificCheck)} onClick={() => handleShow("permission")}>Update Permission </Button>}
            {auth?.permission?.manageUsers?.remove && <Button variant='danger' disabled={specificCheck.every((element) => !element)} onClick={() => handleShow("delete")}>Delete </Button>}
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
                    <th><Form.Check
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
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>User Name</th>
                    <th>Avatar</th>
                    <th>User Type</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Is Connected</th>
                </tr>
            </thead>
            <tbody>
                {
                    usersData && Array.from(usersData).map((user: User, index: number) => {

                        return <><tr key={index}>
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
                            <td>{user.name}</td>
                            <td>{user.lastName}</td>
                            <td>{user.username}</td>
                            <td>{user.avatar}</td>
                            <td>{USER_TYPE[user.userType as 0 | 1 | 2]}</td>
                            <td>{user.address.computed_address}</td>
                            <td>{user.phone}</td>
                            <td>{user.mail}</td>
                            <td>{user.isConnected ? <GrValidate color='green' fill='green' /> : <TiCancel color='red' />}</td>
                        </tr>
                        </>


                    })
                }
            </tbody>
        </Table>

    </div>
    )
}
