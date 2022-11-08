import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react'
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { requestValidation } from '../data/validations/product';
import { NotAuthUserForm } from '../types/User'
type Props = {
    handleResult: (request: NotAuthUserForm) => any;
}
export default function RequestForm({ handleResult }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<NotAuthUserForm>({ resolver: yupResolver(requestValidation) });
    return (<Form onSubmit={handleSubmit(handleResult)}>
        <Form.Label>First Name : </Form.Label>
        <Form.Control type="text" {...register("firstName")} />
        <Form.Label>Last Name : </Form.Label>
        <Form.Control type="text" {...register("lastName")} />
        <Form.Label>Phone Number : </Form.Label>
        <Form.Control type="text" {...register("phone")} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <Button variant="primary" type="submit" >
                Submit
            </Button>

        </div>

    </Form>
    )
}
