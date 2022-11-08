import React, { useState } from 'react';
import { Button, ButtonGroup, Card, Form, Modal, Alert } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import { authDetails, dashboardDonatedItem } from '../data/atoms/dashboardAtoms';
import { DonateItem } from '../types/DonateItem';
import * as dateFn from "date-fns";
import axios from 'axios';
import { ToastState } from '../types/General';
import DonateItemForm from './DonateItemForm';
import { io } from 'socket.io-client';
type DonateItemWithFile = DonateItem & {
    imgToDisplay: {
        url: string,
        file: File
    }
}
export default function DashboardDepot() {
    let socket = io();
    let auth = useRecoilValue(authDetails);
    let donatedItemList = useRecoilValue(dashboardDonatedItem);

    const [show, setShow] = useState<{ toShow: boolean, mode: string | undefined, id: string | undefined }>({ toShow: false, mode: undefined, id: undefined });
    const handleClose = () => {
        setShow({ toShow: false, mode: undefined, id: undefined })
    };
    const handleShow = (mode: string, code?: string) => {
        setShow({ toShow: true, mode, id: code })
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
    const onSubmit = async (data: DonateItemWithFile) => {
        if (show.mode === 'add') {
            let uploadedFileRes: any;
            let file = data.imgToDisplay.file ? data.imgToDisplay.file : undefined;
            if (file) {
                let formData = new FormData()
                formData.append("media", file)
                uploadedFileRes = await axios.post(`${process.env.NEXT_PUBLIC_HOST}api/uploadFile`, formData);
            }
            if (uploadedFileRes?.status === 200 || file === undefined) {
                axios.post(`${process.env.NEXT_PUBLIC_HOST}api/crud/create/DonateItem`,
                    {
                        ...data,
                        ownerId: auth._id,
                        publicationDate: new Date().getTime(),
                        imgDescUrl: "/uploads/" + dateFn.format(Date.now(), "dd-MM-Y") + "/" + uploadedFileRes.data.data.linkToFile.media.newFilename,
                        imgToDisplay: null
                    }
                ).then(
                    () => {
                        handleClose()
                        socket.emit("clientSideProduct", {
                            method: 'add', data: {
                                ...data,
                                ownerId: auth._id,
                                publicationDate: new Date().getTime(),
                                imgDescUrl: "/uploads/" + dateFn.format(Date.now(), "dd-MM-Y") + "/" + uploadedFileRes.data.data.linkToFile.media.newFilename,
                                imgToDisplay: null,
                                isAvailable: true,
                                listOfRequest: []
                            }
                        });
                        handleShowToast({
                            variant: "Success",
                            headerTxt: "Successfully added!",
                            bodyTxt: "The list is updated."
                        })
                    }
                )
            }
        } else {
            let productToUpdate = donatedItemList.find(element => element._id === show.id);

            axios.put(`${process.env.NEXT_PUBLIC_HOST}api/crud/update/DonateItem`, {
                ...productToUpdate,
                ...data,
                _id: productToUpdate?._id
            }).then(
                () => {
                    handleClose()
                    socket.emit("clientSideDonateItem", {
                        method: 'update', data: {
                            ...data,
                            _id: productToUpdate?._id
                        }
                    });
                    handleShowToast({
                        variant: "Success",
                        headerTxt: "Successfully Updated!",
                        bodyTxt: "The list is updated."
                    })
                }
            )
        }

    }
    const handleDelete = () => {
        axios.delete(`${process.env.NEXT_PUBLIC_HOST}api/crud/remove/DonateItem`, { data: show.id })
        handleClose();
        handleShowToast({
            variant: "Success",
            headerTxt: "Successfully removed!",
            bodyTxt: "All the elements was successfuly removed."
        });
        socket.emit("clientSideDonateItem", { method: 'remove', data: [show.id] });
    }

    const switchConditionalRendering = () => {
        let product = donatedItemList.find(element => element._id === show.id);
        switch (show.mode) {
            case "add":
                return <DonateItemForm handleResult={onSubmit} />
            case "update":
                return <DonateItemForm handleResult={onSubmit} defaultValue={product} />
            case "request":
                return <>
                    {
                        donatedItemList.filter((element) => element._id === (show.id as string)).map((element, index) => {
                            return <ul key={index + 100}>
                                {element.listOfRequest.map((list, index) => {
                                    return <div key={index}>
                                        <li ><b>{list.name}</b> <br />
                                            phone : {list.phone}
                                        </li>

                                    </div>
                                })}
                            </ul>
                        })
                    }
                </>
            case "delete":
                return <Alert variant="danger">
                    You choose to delete <b>{product?.productName}</b> <br />
                    Are you sure ?
                    <Button variant='Danger' onClick={() => handleDelete()}>Delete</Button>
                </Alert>

            default:
                return null
        }
    }
    return (<div id="dashboard_depot_container">
        <Modal show={show.toShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{show.mode}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {switchConditionalRendering()}
            </Modal.Body>

        </Modal>
        <h2>Depot</h2>
        <Button variant='success' onClick={() => handleShow('add')}>Donate Item</Button>
        <h4>My donated Items</h4>
        <Swiper
            modules={[Navigation]}
            slidesPerView={3}
            spaceBetween={5}
            navigation
            pagination={{
                "clickable": true
            }}
            breakpoints={{
                768: {
                    slidesPerView: 2
                },
                1024: {
                    slidesPerView: 3
                }
            }}
        >
            {
                donatedItemList && donatedItemList.map((item, index: number) => {
                    return (<>{
                        item.ownerId === auth._id && <SwiperSlide key={item._id}>
                            <Card >
                                <Card.Img variant="top" src={item.imgDescUrl !== undefined ? item.imgDescUrl : "http://localhost:3000/noImage.png"} height="180px" />
                                <Card.Body>
                                    <Card.Title>{item.productName}</Card.Title>
                                    <Card.Text>
                                        {item.desc}<br />
                                        {item.address.computed_address}
                                    </Card.Text>

                                    <Form>
                                        <Form.Check
                                            defaultChecked={item.isAvailable}
                                            type="switch"
                                            id="custom-switch"
                                            onChange={(e) => {
                                                axios.put(`${process.env.NEXT_PUBLIC_HOST}api/crud/update/DonateItem`, { ...item, imgToDisplay: undefined, isAvailable: e.target.checked })
                                            }}
                                            label={item.isAvailable ? "Turn to not available" : "Turn to available"}
                                        />
                                    </Form>
                                    <ButtonGroup aria-label="Basic example">
                                        <Button variant="primary" onClick={() => handleShow("update", item._id)}>Update</Button>
                                        <Button variant="warning"
                                            disabled={item.listOfRequest.length === 0}
                                            onClick={() => handleShow("request", item._id)}>
                                            {item.listOfRequest.length > 0 ? `Requested ${item.listOfRequest.length} time!`
                                                :
                                                "No request yet"}
                                        </Button>
                                        <Button variant="danger" onClick={() => handleShow("delete", item._id)}>Delete</Button>
                                    </ButtonGroup>
                                </Card.Body>
                            </Card>
                        </SwiperSlide>
                    }</>)
                })
            }
        </Swiper>
        {auth?.permission?.manageDonateMarket.show && <><h4>All donated Item</h4>
            <Swiper
                modules={[Navigation]}
                slidesPerView={3}
                spaceBetween={5}
                navigation
                pagination={{
                    "clickable": true
                }}
                breakpoints={{
                    768: {
                        slidesPerView: 2
                    },
                    1024: {
                        slidesPerView: 3
                    }
                }}
            >
                {
                    donatedItemList && donatedItemList.map((item, index: number) => {
                        return <SwiperSlide key={item._id}>
                            <Card >
                                <Card.Img variant="top" src={item.imgDescUrl} height="180px" />
                                <Card.Body>
                                    <Card.Title>{item.productName}</Card.Title>
                                    <Card.Text>
                                        {item.desc}<br />
                                        {item.address.computed_address}
                                    </Card.Text>

                                    <Form>
                                        <Form.Check
                                            defaultChecked={item.isAvailable}
                                            type="switch"
                                            id="custom-switch"
                                            onChange={(e) => {
                                                axios.put(`${process.env.NEXT_PUBLIC_HOST}api/crud/update/DonateItem`, { ...item, imgToDisplay: undefined, isAvailable: e.target.checked })
                                            }}
                                            label={item.isAvailable ? "Turn to not available" : "Turn to available"}
                                        />
                                    </Form>
                                    <ButtonGroup aria-label="Basic example">
                                        {auth.permission.manageDonateMarket.update && <Button variant="primary" onClick={() => handleShow("update", item._id)}>Update</Button>}
                                        <Button variant="warning" disabled={item.listOfRequest.length === 0} onClick={() => handleShow("request", item._id)}> {item.listOfRequest.length > 0 ? `Requested ${item.listOfRequest.length} time!`
                                            :
                                            "No request yet"}</Button>
                                        {auth.permission.manageDonateMarket.remove && <Button variant="danger">Delete</Button>}
                                    </ButtonGroup>
                                </Card.Body>
                            </Card>
                        </SwiperSlide>
                    })
                }
            </Swiper>
        </>
        }

    </div >
    )
}
