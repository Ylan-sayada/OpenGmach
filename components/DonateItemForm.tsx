import React from 'react'
import { DonateItem } from '../types/DonateItem';
import { yupResolver } from '@hookform/resolvers/yup';
import { PropsWithChildren, useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { usePlacesWidget } from "react-google-autocomplete";
import { useForm } from "react-hook-form";
import Image from 'next/image';
import { User } from '../types/User';
import { BsPersonCircle } from 'react-icons/bs';
import { productValidation } from '../data/validations/product';
import FileUploader from './FileUploader';
import { fileHasProperType, fileIsBiggerThan } from '../utils/utilsFunction';
type Props = {
    handleResult: (result: any) => any;
    defaultValue?: DonateItem;
    handleError?: any;
    showSubmit?: boolean;
    btnTxt?: string;
    mode?: 'onChange' | 'onSubmit';
}
export default function DonateItemForm({ handleResult, btnTxt = "submit", handleError, defaultValue, children, mode = 'onSubmit', showSubmit = mode === 'onSubmit' ? true : false }: PropsWithChildren<Props>) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<DonateItem & {
        imgToDisplay: {
            url: string,
            file: File
        }
    }
    >({
        resolver: yupResolver(productValidation)
    });

    const [errorOnAddress, setErrorOnAddress] = useState(false);
    const [address, setAddress] = useState<undefined | User['address']>(defaultValue ? defaultValue.address : undefined)
    const [errorOnFile, setErrorOnFile] = useState(false);
    const [imgToDisplay, setImgToDisplay] = useState<null | { url: string, file: File | undefined }>(defaultValue ? { url: defaultValue.imgDescUrl, file: undefined } : null)
    const { ref, autocompleteRef } = usePlacesWidget<HTMLInputElement>({
        options: {
            types: ["geocode", "establishment"],
            componentRestrictions: { country: "il" },
        }
    });
    const handleImageToDisplay = (files: FileList) => {
        setErrorOnFile(false);
        setImgToDisplay({ url: URL.createObjectURL(files[0]), file: files[0] })
    }
    const checkSubmit = (data: DonateItem) => {
        let errorFile;
        let handledData: DonateItem & {
            imgToDisplay?: {
                url: string,
                file: File
            }
        } = data;
        if (imgToDisplay && (typeof (imgToDisplay.file) !== "undefined")) {
            console.log(fileHasProperType(imgToDisplay.file, ["jpeg", "png"]))
            errorFile = !fileHasProperType(imgToDisplay.file, ["jpeg", "png"]) || fileIsBiggerThan(imgToDisplay.file, 200000);
        }
        if (errorFile) {
            setErrorOnFile(true);
        } else {
            if (defaultValue) {
                if (imgToDisplay?.url !== defaultValue.imgDescUrl) {
                    handledData.imgToDisplay = {
                        url: imgToDisplay?.url as string,
                        file: imgToDisplay?.file as File
                    }
                }
            } else {
                if (imgToDisplay) {
                    handledData.imgToDisplay = {
                        url: imgToDisplay?.url as string,
                        file: imgToDisplay?.file as File
                    }
                }
            }

            let selected = autocompleteRef.current?.getPlace();
            let coord = {
                long: selected?.geometry?.location?.lng() as number,
                lat: selected?.geometry?.location?.lat() as number
            }
            let computed_address = selected?.formatted_address;
            if ((computed_address && coord) || address) {

                handleResult({
                    ...handledData,
                    address: {
                        computed_address: computed_address ? computed_address : address?.computed_address,
                        coord: (coord.long && coord.lat) ? coord : address?.coord
                    }
                })
            } else {
                setErrorOnAddress(true);
            }
        }

    }
    return (<Form onSubmit={handleSubmit(checkSubmit)}>
        <Form.Label>Product Name : </Form.Label>
        <Form.Control {...register("productName")} type='text' defaultValue={defaultValue?.productName} />
        {errors.productName && <Alert variant='danger'>{errors.productName.message}</Alert>}
        <Form.Label>Address : </Form.Label>
        <Form.Control ref={ref} defaultValue={defaultValue?.address.computed_address} />
        {errorOnAddress && <Alert variant='danger'>{"You should select an address"}</Alert>}
        <Form.Label>Upload an image : </Form.Label><br />
        {
            (imgToDisplay) ?
                <Image src={imgToDisplay.url} width="300" height="300" alt="updated Image" />
                :
                <BsPersonCircle style={{ width: "100%", fontSize: "5.0rem" }} />
        }<br />
        <FileUploader handleFile={(img: any) => handleImageToDisplay(img)} label='Choose an image' /><br />
        {errorOnFile && <Alert variant="danger">The file should be a jpeg or png and should not be more than 200ko</Alert>}
        <Form.Label>Description : </Form.Label>
        <Form.Control {...register("desc")} as="textarea" rows={3} defaultValue={defaultValue?.desc} />
        {errors.desc && <Alert variant='danger'>{errors.desc.message}</Alert>}
        <Button type='submit'>Donate it!</Button>
    </Form>
    )
}
