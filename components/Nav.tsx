import { Navbar, Nav, Button, Modal, Alert } from 'react-bootstrap';
import IoHome from "../public/bxs_home.svg";
import { FunctionComponent, useState, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { sysConfig } from '../data/atoms/landingAtoms';
import UserForm from './UserForm';
import * as dateFn from "date-fns";
import { UserLogin, UserRegistration } from '../types/User';
import axios from 'axios';
import GenerateToast from './GenerateToast';
import LoginForm from './LoginForm';
import { authDetails } from '../data/atoms/dashboardAtoms';
import { useRouter } from 'next/router';
import { ModalState, ToastState } from '../types/General';
import styles from "../styles/components/Nav.module.scss"

const NavBar: FunctionComponent = () => {
    const router = useRouter();
    const dataSysConfig = useRecoilValue(sysConfig);
    const [toastShow, setToastShow] = useState<ToastState>({ toShow: false, params: undefined })
    const [show, setShow] = useState<ModalState>({ toShow: false, params: undefined });
    const [authError, setAuthError] = useState<boolean>(false);
    const handleClose = () => setShow({ ...show, toShow: false });
    const handleShow = (params: ModalState["params"]) => {
        setShow({ toShow: true, params })
    };
    const [user, setUser] = useRecoilState(authDetails);

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
        handleAutomaticClose(show.params === "login" ? 3000 : 10000);
    }
    const handleLogin = async (data: UserLogin) => {
        try {
            const loginResult = await axios.post(`${process.env.NEXT_PUBLIC_HOST}api/auth/login`, data);
            if (loginResult.status === 200) {
                setUser(loginResult.data);
                localStorage.setItem("userData", JSON.stringify(loginResult.data.userData));
                handleClose()
                handleShowToast({
                    variant: "Success",
                    headerTxt: "Succesfully Logged!",
                    bodyTxt: "You will be redirected to the dashboard."
                })
                router.push("/Dashboard");
            }
        } catch (error) {
            setAuthError(true);
        }
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
                            headerTxt: "Succesfully Registered!",
                            bodyTxt: "Your appliance was succesfully sent.<br/>Check your mail to validate your account."
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

    const switchConditionalRendering = () => {
        switch (show.params) {
            case "login":
                return <>
                    {authError && <Alert variant='danger'>The username or password is not valid </Alert>}
                    <LoginForm handleResult={handleLogin} btnTxt="Login" />
                </>
            case "register":
                return <UserForm handleResult={handleRegister} />
            default:
                return null
        }
    }
    return (<>
        <GenerateToast
            show={toastShow.toShow}
            bodyTxt={toastShow.params?.bodyTxt}
            headerTxt={toastShow.params?.headerTxt}
            variant={toastShow.params?.variant}
        />
        <Modal show={show.toShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title style={{ textTransform: "capitalize" }}>{show.params}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                {
                    switchConditionalRendering()
                }
            </Modal.Body>

        </Modal>
        <Navbar id={styles.nav} sticky="top">
            <Nav className={`${styles.container}`}>
                <Navbar.Brand href="/">
                    <IoHome />
                </Navbar.Brand>
                <div className={`${styles.first_btn_group}`}>
                    <Nav.Link className={`${styles.custom_link}`} href="/Depot">
                        <Button className='dark rounded'>Depot</Button>
                    </Nav.Link>
                    {dataSysConfig.gmachDonation?.enabled && <Nav.Link href={dataSysConfig.gmachDonation?.paypalLink} className={`${styles.custom_link}`} target="_blank">
                        <Button className='light' style={{ display: "flex" }} >Donate</Button>
                    </Nav.Link>
                    }
                </div>
                <div className={`${styles.second_btn_group}`} style={{ alignItems: "center", flexDirection: "row" }}>
                    {user ? <>
                        <p>hello {user.name} {user.lastName}</p>
                        <div>
                            <Nav.Link className={`${styles.custom_link}`} style={{ width: "initial" }}>
                                <Button className='dark' onClick={() => {
                                    localStorage.clear();
                                    router.push("/")
                                }}>Disconnect</Button>
                            </Nav.Link>
                            <Nav.Link href='/Dashboard' style={{ width: "initial" }} className={`${styles.custom_link}`}>
                                <Button className='light'>Dashboard</Button>
                            </Nav.Link></div>
                    </>
                        :
                        <> <Nav.Link className={`${styles.custom_link}`} onClick={() => handleShow("register")}><Button className='dark'>Register</Button></Nav.Link>
                            <Nav.Link className={`${styles.custom_link}`} onClick={() => handleShow("login")}><Button className='light' >Login</Button></Nav.Link>
                        </>


                    }
                </div>

            </Nav>
        </Navbar>
    </>
    )
}
export default NavBar