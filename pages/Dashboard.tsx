
import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { Tab, Row, Col, Nav } from 'react-bootstrap'
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from 'recoil'
import DashboardAccountancy from '../components/DashboardAccountancy'
import DashboardDepot from '../components/DashboardDepot'
import DashboardHome from '../components/DashboardHome'
import DashboardReminder from '../components/DashboardReminder'
import DashboardsGmachSettings from '../components/DashboardsGmachSettings'
import DashboardUsers from '../components/DashboardUsers'
import TchatRecipe from '../components/TchatRecipe'

import {
    dashboardTchat,
    dashboardAccountancy,
    dashboardDonatedItem,
    dashboardReminders,
    dashboardUsers,
    authDetails
} from '../data/atoms/dashboardAtoms';

import type { SocketHandle } from '../types/General'
import { socket } from '../utils/socketCon'

import { Accountancy } from '../types/Accountancy'
import { DonateItem } from '../types/DonateItem'
import { Schedule } from '../types/Schedule'
import { TchatMsgWithUserData } from '../types/Tchat'
import { User } from '../types/User'

import styles from "../styles/Dashboard.module.scss";
import Router from 'next/router'
const adapterSocket = (params: SocketHandle<any>, recoilStateHandler: SetterOrUpdater<any[]>) => {
    if (params.method === 'add') {
        recoilStateHandler((arr) => [...arr, params.data])
    }
    if (params.method === 'remove') {
        let idArr = params.data;
        recoilStateHandler((arrOfData) => {
            console.log(arrOfData.filter(val => !idArr.includes(val)));
            return arrOfData.filter(val => { idArr._id !== val })
        })
    }
    if (params.method === 'update') {
        let id = params.data;
        // recoilStateHandler((arrOfData)=>{

        // })
    }
}
const Dashboard: NextPage = () => {
    const auth = useRecoilValue(authDetails);
    const setAccountancy = useSetRecoilState(dashboardAccountancy);
    const setDonatedItem = useSetRecoilState(dashboardDonatedItem);
    const setReminders = useSetRecoilState(dashboardReminders);
    const setUsers = useSetRecoilState(dashboardUsers);
    const setTchatMsg = useSetRecoilState(dashboardTchat);
    useEffect(() => {
        if (auth) {
            Promise.all([
                axios.get("http://localhost:3000/api/crud/show/Accountancy"),
                axios.get("http://localhost:3000/api/crud/show/User"),
                axios.get("http://localhost:3000/api/crud/tchat"),
                axios.get("http://localhost:3000/api/crud/show/Schedule"),
                axios.get("http://localhost:3000/api/crud/show/DonateItem"),
            ]).then((element: any[]) => {
                setAccountancy(element[0].data.element as Accountancy[]);
                let checkedUsers = element[1].data.element.filter((user: User) => (user?.permission?.isMainAdmin && auth?.permission?.isMainAdmin) || (!user?.permission?.isMainAdmin))
                console.log(checkedUsers);
                setUsers(checkedUsers);
                setTchatMsg(element[2].data.msgList as TchatMsgWithUserData[]);
                setReminders(element[3].data.element as Schedule[]);
                setDonatedItem(element[4].data.element as DonateItem[]);

            }).catch(e => {
                console.log(e)
            });
            socket.on("handleReminder", (params: SocketHandle<Schedule>) => {
                adapterSocket(params, setReminders)
            });
            socket.on("handleUser", (params: SocketHandle<User>) => {
                adapterSocket(params, setUsers);
            });
            socket.on("handleAccountancy", (params: SocketHandle<Accountancy>) => {
                adapterSocket(params, setAccountancy);
            });
            socket.on("handleProduct", (params: SocketHandle<DonateItem>) => {
                adapterSocket(params, setDonatedItem);
            });
            socket.on("handleTchatMsg", (params: SocketHandle<TchatMsgWithUserData>) => {
                adapterSocket(params, setTchatMsg);
            });
            return () => {
                socket.removeAllListeners();
            }
        } else {
            Router.push("/");
        }
    })
    return (
        <div id={`${styles.dashboard}`}>
            <Head>
                <title></title>
                <meta name="description" content="Dashboard" />
                <link rel="icon" href="" />
            </Head>
            {auth && <main >
                <Tab.Container id="left-tabs" defaultActiveKey={auth?.permission?.showStatistics ? "Home" : "Depot"}>
                    <Row className={styles.display} style={{ minHeight: "100vh" }}>
                        <Col sm={3}>
                            <Nav variant="pills" id={`${styles.nav_dashboard}`} className="flex-column">
                                {(auth?.permission?.showStatistics || auth?.permission?.manageSchedule.show) && <Nav.Item >
                                    <Nav.Link eventKey="Home" >Home</Nav.Link>
                                </Nav.Item>}
                                {
                                    auth?.permission?.manageAccountancy?.show && <Nav.Item>
                                        <Nav.Link eventKey="Accountancy">Accountancy</Nav.Link>
                                    </Nav.Item>
                                }
                                {
                                    (auth?.permission?.manageProduct?.show || auth?.permission?.manageDonateMarket?.show) && <Nav.Item>
                                        <Nav.Link eventKey="Depot">Depot</Nav.Link>
                                    </Nav.Item>
                                }
                                {
                                    auth?.permission?.manageUsers?.show && <Nav.Item>
                                        <Nav.Link eventKey="User-Management">User Management</Nav.Link>
                                    </Nav.Item>
                                }
                                {
                                    auth?.permission?.manageSchedule?.show && <Nav.Item>
                                        <Nav.Link eventKey="Reminders">Reminders</Nav.Link>
                                    </Nav.Item>
                                }
                                {
                                    auth?.permission?.isMainAdmin && <Nav.Item>
                                        <Nav.Link eventKey="Gmach-Settings">Gmach Settings</Nav.Link>
                                    </Nav.Item>
                                }

                            </Nav>
                        </Col>
                        <Col sm={9} >
                            <Tab.Content id={`${styles.dashboard_content}`} style={{ minHeight: "100vh" }}>
                                <Tab.Pane eventKey="Home">
                                    <DashboardHome />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Accountancy">
                                    <DashboardAccountancy />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Depot">
                                    <DashboardDepot />
                                </Tab.Pane>
                                <Tab.Pane eventKey="User-Management">
                                    <DashboardUsers />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Reminders">
                                    <DashboardReminder />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Gmach-Settings">
                                    <DashboardsGmachSettings />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
                <TchatRecipe />
            </main>}
        </div>
    )
}
export default Dashboard