import React, { useEffect, useRef, useState } from 'react'
import { TchatMsgWithUserData } from '../types/Tchat'
import { Image, Badge, Form, Button } from 'react-bootstrap'
import { format } from 'date-fns';
import { useRecoilValue } from 'recoil';
import { authDetails, dashboardTchat } from '../data/atoms/dashboardAtoms';
import styles from "../styles/components/TchatRecipe.module.scss";
import axios from 'axios';
import { io } from 'socket.io-client';
import Collapse from 'react-bootstrap/Collapse';
export default function TchatRecipe() {
    let socket = io();
    const tchatMsg = useRecoilValue(dashboardTchat);
    const [openTchat, setOpenTchat] = useState(false);
    console.log(tchatMsg);
    const auth = useRecoilValue(authDetails);
    const ref = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const keyDownHandler = (event: any) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit(ref!.current!.value as string);
                ref!.current!.value = "";
            }
        };
        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    });
    const handleSubmit = (message: string) => {
        let data = {
            message,
            publishDate: new Date().getTime(),
            userID: auth._id,
        }
        let userData = {
            username: auth.username,
            avatar: auth.avatar,
            isConnected: auth.isConnected
        }
        axios.post(`${process.env.NEXT_PUBLIC_HOST}api/crud/create/Tchat`, { ...data }).then(() => {
            socket.emit("clientSideTchatMsg", {
                method: 'add',
                data: { ...data, userData }
            });
        })
    }
    return (<div id={`${styles.tchat_container}`}>
        <div className={`${styles.discuss_container}`} style={{ height: openTchat ? "initial" : "5vh" }}>
            <div className={`${styles.title_container}`} onClick={() => setOpenTchat(!openTchat)} >Tchat</div>
            <div className={`${styles.msg_list}`} style={{ display: openTchat ? "initial" : "none" }}>
                {
                    tchatMsg && Array.from(tchatMsg).sort((msg1, msg2) => {
                        return msg1.publishDate - msg2.publishDate
                    }).map(({ message, userID, userData, publishDate }: TchatMsgWithUserData, index: number) => {
                        return <div key={index} className={`${styles.tchat_message} ${styles.other_msg}`}>
                            <div className={`${styles.message_title_owner}`}>
                                <Image roundedCircle className={`${styles.img_owner}`} style={{ width: "60px", height: "60px" }} src={userData.avatar} alt={`avatar of ${userData.username}`} />
                                <div className={`${styles.message_name_owner}`}>{`${userData.username}`}</div>
                                {userData.isConnected && <Badge pill bg="success" >connected</Badge>}
                            </div>
                            <div className={`${styles.message_contains}`}>{message}</div>
                            <div className={`${styles.message_date}`}>{format(publishDate, "dd/LL/y") + "," + format(publishDate, "hh:mm")}</div>
                        </div>

                    })
                }
            </div>
            <Form>
                <Form.Control as="textarea" ref={ref} rows={3} />
                <Button type="submit" style={{ width: "0", height: "0", position: "absolute" }}></Button>

            </Form>



        </div>
    </div>
    )
}
