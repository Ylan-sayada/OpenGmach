import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePlacesWidget } from "react-google-autocomplete";
import { Button, Form, Alert } from 'react-bootstrap'
import { IoIosAddCircleOutline } from "react-icons/io"
import { BsPersonCircle } from "react-icons/bs"
import { Navigation } from "swiper";
import { AiOutlineClose } from "react-icons/ai"
import { Swiper, SwiperSlide } from 'swiper/react';
import { GmachAction, GmachDetails, SysConfig } from '../types/SysConfig';
import FileUploader from './FileUploader';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { sysConfigValidation } from '../data/validations/sysConfig';
import FormAction from './FormAction';
import * as dateFn from "date-fns";
import axios from 'axios';
import el from 'date-fns/esm/locale/el/index.js';
type Props = {
    defaultValue?: SysConfig;
    btnTxt?: string;
    variant?: string;
    showSubmit?: boolean;
    mode?: 'onChange' | 'onSubmit';
    handleResult: (data: any) => any
}
export default function GmachDetailsForm({ defaultValue, handleResult, btnTxt = 'submit', children, variant = 'primary', mode = 'onSubmit', showSubmit = mode === 'onSubmit' ? true : false }: PropsWithChildren<Props>) {
    const [actionGmach, setActionGmach] = useState<(GmachAction & { imgFile?: FileList })[]>([]);
    const [imageHeader, setImageHeader] = useState<{ url: string, file: File }[]>([]);
    const { register, handleSubmit, formState: { errors } } = useForm<SysConfig>({
        mode: mode,
        resolver: yupResolver(sysConfigValidation)
    });
    const [logo, setLogo] = useState<null | { url: string, file: File }>(null)
    const [showPaypal, setShowPaypal] = useState("no");
    const [addAction, setAddAction] = useState(false);
    const [gmachDetails, setgmachDetails] = useState<GmachDetails>();
    const [errorOnAddress, setErrorOnAddress] = useState<boolean>(false)
    const [address, setAddress] = useState<GmachDetails["gmachAddress"]>();
    const inputRef = useRef(null);
    const [country, setCountry] = useState("il");
    useEffect(() => {
        if (defaultValue) {
            setActionGmach(defaultValue.gmachAction);
            if (defaultValue.gmachDetails) {
                setgmachDetails(defaultValue.gmachDetails)
            }

            if (defaultValue.gmachDonation)
                setShowPaypal(defaultValue.gmachDonation.enabled ? "yes" : "no");
        }
    }, [defaultValue])
    const { ref, autocompleteRef } = usePlacesWidget<HTMLInputElement>({
        onPlaceSelected: (selected) => {
            let coord = {
                long: selected.geometry?.location?.lng() as number,
                lat: selected.geometry?.location?.lat() as number
            }
            setErrorOnAddress(false)
            setAddress({
                coord,
                computed_address: selected.formatted_address as string
            })
        },
        options: {
            types: ["geocode", "establishment"],
            componentRestrictions: { country: "il" },
        }
    })

    const handleImageHeader = (files: any) => {
        let array = Array.from(imageHeader);
        Array.from(files).forEach((image: any) => {
            array.push({ url: URL.createObjectURL(image), file: image })
        });
        setImageHeader(array)
    }
    const handleImageLogo = (files: any) => {
        if (gmachDetails) {
            setgmachDetails({
                ...gmachDetails,
                gmachLogo: URL.createObjectURL(files[0]) as string
            })
        }
        else {
            setLogo({ url: URL.createObjectURL(files[0]), file: files[0] })
        }
    }
    const handleSubmitedData = async (data: any) => {
        let selected = autocompleteRef.current?.getPlace();
        let coord = {
            long: selected?.geometry?.location?.lng() as number,
            lat: selected?.geometry?.location?.lat() as number
        }
        let computed_address = selected?.formatted_address;
        if ((computed_address && coord) || address) {
            console.log(address);
            handleResult({
                ...data,
                address: address || { computed_address, coord },
                gmachAction: actionGmach,
                headerImage: imageHeader,
                logo
            })
        } else {
            setErrorOnAddress(true);
        }
    }
    return (<Form onSubmit={handleSubmit(handleSubmitedData)}>
        <Form.Label>Name : </Form.Label>
        <Form.Control {...register("gmachDetails.gmachName")} defaultValue={gmachDetails?.gmachName} />
        {errors.gmachDetails?.gmachName && <Alert variant='danger'>{errors.gmachDetails?.gmachName.message}</Alert>}
        <Form.Label>Description</Form.Label>
        <Form.Control {...register("gmachDetails.gmachDesc")} as="textarea" rows={3} defaultValue={gmachDetails?.gmachDesc} />
        {errors.gmachDetails?.gmachDesc && <Alert variant='danger'>{errors.gmachDetails?.gmachDesc.message}</Alert>}
        <Form.Label >Address : </Form.Label>
        <Form.Control type="text" ref={ref} onChange={(e) => {
            if (errorOnAddress && e.target.value) {
                setErrorOnAddress(false);
            }
        }}
            defaultValue={gmachDetails?.gmachAddress?.computed_address}
        />
        <Form.Label >Email : </Form.Label>
        <Form.Control type="mail" {...register("gmachDetails.gmachMail")} defaultValue={gmachDetails?.gmachMail} />
        {errors.gmachDetails?.gmachMail && <Alert variant='danger'>{errors.gmachDetails?.gmachMail.message}</Alert>}
        <Form.Label>Phone number : </Form.Label>
        <Form.Control type="tel"
            {...register("gmachDetails.gmachPhone")}
            defaultValue={gmachDetails?.gmachPhone}
        />
        {errors.gmachDetails?.gmachPhone && <Alert variant='danger'>{errors.gmachDetails?.gmachPhone.message}</Alert>}
        <Form.Label>Gmach Logo : </Form.Label>
        <br />
        {
            (gmachDetails || logo) ?
                <Image src={gmachDetails?.gmachLogo ? gmachDetails.gmachLogo : (logo?.url as string)} width="300" height="300" alt="ddsd" />
                :
                <BsPersonCircle />
        }
        <br />
        <FileUploader handleFile={handleImageLogo} label={"Upload Logo"} />
        <div>
            <Form.Label>I would like to add a paypal link for donation :</Form.Label>
            <div>
                <Form.Check
                    inline
                    label="Yes"
                    name="paypal"
                    type="radio"
                    checked={showPaypal === "yes"}
                    onChange={() => setShowPaypal("yes")}
                />
                <Form.Check
                    inline
                    label="No"
                    name="paypal"
                    type="radio"
                    checked={showPaypal === "no"}
                    onChange={() => setShowPaypal("no")}
                />
            </div>
            {showPaypal === "yes" && <>
                <Form.Control  {...register("gmachDonation.paypalLink")} defaultValue={defaultValue && defaultValue?.gmachDonation?.paypalLink} placeholder="Ex : https://www.paypal.com/donate/..." />
                {errors.gmachDonation?.paypalLink && <Alert variant='danger'>{errors.gmachDonation.paypalLink.message}</Alert>}
            </>}
        </div>
        <h4>Gmach Header</h4>
        <Form.Label>Submit images that will display on your header : </Form.Label>
        <br />
        <FileUploader handleFile={handleImageHeader} label={"Upload"} multiple />
        <br />
        {
            imageHeader && (imageHeader.length > 0) && <div className="image_displayer">
                <h5>Preview</h5>
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
                    {imageHeader && imageHeader.map((img, index) => {
                        return <SwiperSlide key={index}>
                            <div style={{ position: "relative" }}>
                                <Button variant="danger" style={{ position: "absolute", top: "0", right: "0", zIndex: 6 }}
                                    onClick={() => {
                                        setImageHeader(imageHeader.filter((action, indexToDelete) => indexToDelete !== index));
                                    }}
                                ><AiOutlineClose /></Button>
                                <Image src={img.url} width="300" height="300" alt="ddsd" />
                            </div>
                        </SwiperSlide>
                    })
                    }
                </Swiper>
            </div>
        }

        <Form.Label>A short text that will display over the images: </Form.Label>
        <Form.Control type="text"  {...register("headerText")} defaultValue={defaultValue && defaultValue?.headerText} />
        {errors.headerText && <Alert variant='danger'>{errors.headerText.message}</Alert>}

        <h4>Gmach Actions</h4>
        <p >Add some action of your gmach to display.</p>
        <p onClick={() => setAddAction(!addAction)}>Add <IoIosAddCircleOutline /></p>
        <FormAction handleResult={(action) => {
            setActionGmach((currentAction) => [...currentAction, action])
            setAddAction(false)
        }} show={addAction} />
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
            {actionGmach?.map((element, index) => {
                return <SwiperSlide key={index}>
                    <div className="action_gmach" style={{ display: "flex", alignItems: "center", zIndex: 5, position: "relative", flexDirection: "column" }}>
                        <Button variant="danger" style={{ position: "absolute", top: "0", right: "0", zIndex: 6 }}
                            onClick={() => {
                                setActionGmach(actionGmach.filter((action, indexToDelete) => indexToDelete !== index));
                            }}
                        ><AiOutlineClose /></Button>
                        <div className="action_image"><Image src={element.actionImage.replace(" ", "\\")} width="300" height="200" alt={element.title} /></div>
                        <p className="action_title" color='black'>{element.title}</p>
                        <p className="action_description" color='black'>{element.desc}</p>
                    </div>
                </SwiperSlide>
            })}
        </Swiper>
        {showSubmit && <Button type="submit" variant={variant} >{btnTxt}</Button>}
        {children}

    </Form >
    )
}
