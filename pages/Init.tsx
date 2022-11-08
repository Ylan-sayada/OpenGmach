import React, { useEffect, useState, useRef } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { Button } from 'react-bootstrap'
import styles from '../styles/Init.module.scss'
import UserForm from '../components/UserForm';
import * as dateFn from "date-fns";
import GmachDetailsForm from '../components/GmachDetailsForm';
import { UserRegistration } from '../types/User';
import axios from 'axios';
import { useRouter } from 'next/router'
const Init: NextPage = () => {
    let router = useRouter()
    const [currentStage, setCurrentStage] = useState(0);
    const [dataSubmit, setDataSubmit] = useState<{ userGmach?: UserRegistration, gmachForm?: any }>();
    useEffect(() => {
        if (window.scrollY !== 0) {
            window.scrollTo(0, 0);
        }
    }, [currentStage]);
    const handleRegisterResult = (data: UserRegistration) => {
        setDataSubmit({
            userGmach: data
        })
        setCurrentStage(1)
    }
    const handleGmachData = (data: any) => {
        setDataSubmit({
            userGmach: dataSubmit?.userGmach,
            gmachForm: data
        })
        console.log(data);
        setCurrentStage(2)
    }
    const finalStage = async () => {
        registerTheMainAdmin(dataSubmit?.userGmach as UserRegistration);
        axios.put(`${process.env.NEXT_PUBLIC_HOST}api/initSystem`).then(() => {
            router.push("/")
        })

    }
    const registerTheGmach = async (gmachData: any) => {
        let headerImage = [];
        let gmachAction = [];
        let gmachDetails = {};
        let gmachDonation = {};
        let headerText = "";

    }
    const registerTheMainAdmin = async (user: UserRegistration) => {
        try {
            if (user.avatarAsFile) {
                let formData = new FormData()
                formData.append("media", user.avatarAsFile[0])
                const uploadedFileRes = await axios.post(`${process.env.NEXT_PUBLIC_HOST}api/uploadFile`, formData);
                if (uploadedFileRes.status === 200) {
                    let response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}api/mainAdminRegister`, {
                        ...user,
                        avatar: "/uploads/" + dateFn.format(Date.now(), "dd-MM-Y") + "/" + uploadedFileRes.data.data.linkToFile.media.newFilename,
                        avatarAsFile: undefined
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const stepperStepRendering = () => {
        switch (currentStage) {
            case 0:
                return <>
                    <h3>Director contact details</h3>
                    <UserForm handleResult={handleRegisterResult} showSubmit={false} defaultValue={dataSubmit?.userGmach}>
                        <Button type='submit' variant="success">Next step</Button>
                    </UserForm>
                </>
            case 1:
                return <>
                    <h3>Gmach Details </h3>
                    <GmachDetailsForm handleResult={handleGmachData} showSubmit={false}>
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <Button onClick={() => setCurrentStage(0)} variant="warning">Back step</Button>
                            <Button type='submit' variant="success">Next step</Button>
                        </div>
                    </GmachDetailsForm>
                </>
            case 2:
                return <>
                    <h3>Checkout informations</h3>
                    <h4>Director information</h4>
                    <ul>
                        <li>Name : {dataSubmit?.userGmach?.name}{dataSubmit?.userGmach?.lastName}</li>
                        <li>User Name : {dataSubmit?.userGmach?.username}</li>
                        <li>Email : {dataSubmit?.userGmach?.mail}</li>
                        <li>Phone number :{dataSubmit?.userGmach?.phone}</li>
                    </ul>
                    <h4>Gmach informations</h4>
                    <ul>
                        <li>Gmach Name :{dataSubmit?.gmachForm?.gmachDetails?.gmachName} </li>
                        <li>Description :{dataSubmit?.gmachForm?.gmachDetails?.gmachDesc} </li>
                        <li>Email : {dataSubmit?.gmachForm?.gmachDetails?.gmachMail}</li>
                        <li>Address : {dataSubmit?.gmachForm?.address.computed_address}</li>
                        <li>Phone number : {dataSubmit?.gmachForm?.gmachDetails?.gmachPhone}</li>
                        {dataSubmit?.gmachForm?.gmachDetails?.paypalLink && <li>Paypal link : </li>}
                    </ul>
                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <Button onClick={() => setCurrentStage(1)} variant="warning">Back step</Button>
                        <Button variant="success" onClick={() => finalStage()}>Enhance The system!</Button>
                    </div>
                </>
            default:
                return null;
        }
    }
    return (
        <div id={styles.init}>
            <Head>
                <title>Initialize your Gmach</title>
                <meta name="description" content="bla bla bla" />
                <link rel="icon" href="" />
            </Head>
            <main >
                <h1>Open Gmach</h1>
                <div id={styles.stepper}>
                    <div id={styles.stepper__nav}>
                        <div className={`${styles.stepper__stage} ${styles.selected}`}>
                            <div className={styles.stepper__no_stage}>1</div>
                            <div className={styles.stepper__description}>Director contact details</div>
                        </div>

                        <div className={`${styles.stepper__div} ${currentStage > 0 && styles.selected}`}>
                            <span className={styles.bar}></span>
                        </div>

                        <div className={`${styles.stepper__stage} ${currentStage > 0 && styles.selected}`}>
                            <div className={styles.stepper__no_stage}>2</div>
                            <div className={styles.stepper__description}>Gmach details</div>
                        </div>

                        <div className={`${styles.stepper__div} ${currentStage > 1 && styles.selected}`}><span className={styles.bar}></span></div>

                        <div className={`${styles.stepper__stage} ${currentStage > 1 && styles.selected}`}>
                            <div className={styles.stepper__no_stage}>3</div>
                            <div className={styles.stepper__description}>Details summary</div>
                        </div>
                    </div>
                    <div id={`${styles.stepper__content}`}>
                        <div className="stepper__item">
                            {
                                stepperStepRendering()
                            }
                        </div>
                    </div>
                </div>
            </main >
        </div >
    )
}
export default Init