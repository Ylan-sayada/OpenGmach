import type { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { AiOutlineSearch } from "react-icons/ai"
import { IoIosArrowDown } from "react-icons/io"
import { Button, Card, Form, Modal, Collapse } from 'react-bootstrap'
import Head from 'next/head'
import { DonateItem } from '../types/DonateItem';
import styles from "../styles/Depot.module.scss";

import axios from 'axios'
import RequestForm from '../components/RequestForm'
import { NotAuthUserForm } from '../types/User'
import GenerateToast from '../components/GenerateToast'
import { ToastState } from '../types/General'
export const getServerSideProps = async () => {
    const data = await (await axios.get("http://localhost:3000/api/crud/show/DonateItem")).data.element as DonateItem[]
    return {
        props: {
            data,
        },
    }
}
const Depot = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [searchInput, setSearchInput] = useState("");
    const [sortBy, setSortBy] = useState("-1");
    const [open, setOpen] = useState(false);
    const [sortedData, setSortedData] = useState(data);
    const [show, setShow] = useState<{ toShow: boolean, indexProduct: number | undefined }>({ toShow: false, indexProduct: undefined });
    const handleClose = () => setShow({ ...show, toShow: false });
    const handleShow = (indexProduct: number | undefined) => {
        setShow({ toShow: true, indexProduct })
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

    useEffect(() => {
        let sorted = data.sort((prodA, prodB) => {
            let res;
            switch (sortBy) {
                case "oldest":
                    res = prodA.publicationDate - prodB.publicationDate;
                    break;
                case "alphabetical":
                    res = prodA?.productName.localeCompare(prodB?.productName);
                    break;
                default: //sort by latest by default
                    res = prodB.publicationDate - prodA.publicationDate;
                    break;

            }
            return res;
        }).filter((element) => {
            let { address, desc, productName } = element;
            return (address?.computed_address.toLowerCase().includes(searchInput) || desc.toLowerCase().includes(searchInput) || productName.toLowerCase().includes(searchInput)) && element.isAvailable
        })
        setSortedData(sorted)
    }, [searchInput, sortBy, data])
    const handleSubmit = async (userForm: NotAuthUserForm) => {
        let product = sortedData[show.indexProduct as number];
        let response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}api/addRequest`, {
            userRequest: {
                name: `${userForm.firstName} ${userForm.lastName}`,
                phone: userForm.phone
            },
            _id: product._id,
        })
        if (response.status === 200) {
            handleShowToast({
                variant: "Success",
                headerTxt: "Successfully sent!",
                bodyTxt: "The owner will contact you as soon possible."
            })
            handleClose();
        } else {
            handleShowToast({
                variant: "Error",
                headerTxt: "Something gone wrong!!",
                bodyTxt: "Try again later..."
            })
            handleClose();
        }
    }
    return (
        <div id={`${styles.depot}`}>
            <Head>
                <title>Depot</title>
                <meta name="description" content="Depot" />
                <link rel="icon" href="" />
            </Head>
            <main id={`${styles.depot_container}`}>
                <GenerateToast
                    show={toastShow.toShow}
                    bodyTxt={toastShow.params?.bodyTxt}
                    headerTxt={toastShow.params?.headerTxt}
                    variant={toastShow.params?.variant}
                />
                <Modal show={show.toShow} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{sortedData[show.indexProduct as number]?.productName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="product_image"><Image src={sortedData[show.indexProduct as number]?.imgDescUrl} width="300" height="200" alt={sortedData[show.indexProduct as number]?.productName} /></div>
                        <p className="product_address" style={{ fontWeight: "bold" }}>{sortedData[show.indexProduct as number]?.address.computed_address}</p>
                        <p className="product_description">{sortedData[show.indexProduct as number]?.desc}</p>
                    </Modal.Body>
                    <Modal.Footer style={{ justifyContent: "center" }}>
                        <h5>Order this article</h5>
                        <RequestForm handleResult={handleSubmit} />
                    </Modal.Footer>
                </Modal>
                <div className={`${styles.search}`} style={{ margin: "10px 0 30px 0" }}>
                    <div className={`${styles.search_bar}`}>
                        <div className={`${styles.search_input}`}>
                            <AiOutlineSearch />
                            <Form.Control type='text' placeholder='Table,toy,chair...' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                        </div>
                        <div className={`${styles.params} ${open && styles.open}`}>
                            <IoIosArrowDown onClick={() => setOpen(!open)}
                                aria-controls="collapse-params"
                                aria-expanded={open} />
                        </div>

                    </div>
                    <Collapse in={open}>
                        <div id={`collapse-params`} className={`${styles.inner_params}`}>
                            <Form.Label>Sort by :</Form.Label>
                            <Form.Select defaultValue={sortBy} onChange={(e) => {
                                setSortBy(e.target.value)
                            }}>
                                <option value="latest">Latest</option>
                                <option value="oldest">Oldest</option>
                                <option value="alphabetical">Alphabetical</option>
                            </Form.Select>
                        </div>
                    </Collapse>
                </div>

                <div id={`${styles.container_products}`}>
                    {sortedData && sortedData.map((item: DonateItem, index) => {
                        return <Card key={index} className={`${styles.products}`}>
                            <Card.Img variant="top" src={item.imgDescUrl} height="180px" />
                            <Card.Body>
                                <Card.Title>{item.productName}</Card.Title>
                                <Card.Text>
                                    {item.desc}<br />
                                    {item.address.computed_address}
                                </Card.Text>

                            </Card.Body>
                            <Card.Footer>
                                <Button variant="primary" onClick={() => handleShow(index)}>See more</Button>
                            </Card.Footer>
                        </Card>
                    }
                    )}

                </div>
            </main>
        </div>
    )
}
export default Depot