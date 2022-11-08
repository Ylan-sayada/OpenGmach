import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react'
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { actionGmachValidation } from '../data/validations/sysConfig';
import { GmachAction } from '../types/SysConfig';
type Props = {
    handleResult: (result: GmachAction) => any;
    show: boolean
}
export default function FormAction({ handleResult, show }: Props) {
    const { reset, register, handleSubmit, formState: { errors } } = useForm<GmachAction & {
        imgFile: FileList
    }>({
        resolver: yupResolver(actionGmachValidation)
    });

    return (<Form style={{ display: show ? "initial" : "none" }}>
        <Form.Label>Title of the action : </Form.Label>
        <Form.Control {...register("title")} type="text" />
        {errors.title && <Alert variant='danger'>{errors.title.message}</Alert>}
        <Form.Label>Description of the action : </Form.Label>
        <Form.Control {...register("desc")} as="textarea" rows={3} />
        {errors.desc && <Alert variant='danger'>{errors.desc.message}</Alert>}
        <Form.Label>Image that illustrate the action : </Form.Label>
        <Form.Control {...register("imgFile")} type="file" accept="image/*" />
        {errors.imgFile && <Alert variant='danger'>{errors.imgFile.message}</Alert>}
        <Button onClick={handleSubmit((data) => {
            handleResult({
                ...data,
                actionImage: URL.createObjectURL(data.imgFile[0])
            });
            reset()
        })} >Submit</Button>
    </Form>
    )
}
