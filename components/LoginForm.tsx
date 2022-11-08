import { UserLogin } from '../types/User';
import React from 'react'
import { loginValidation } from '../data/validations/users';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Form, Button, Alert } from 'react-bootstrap';
type Props = {
    handleResult: (result: UserLogin) => any;
    btnTxt?: string;
}
export default function LoginForm({ handleResult, btnTxt = "submit" }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<UserLogin>({ resolver: yupResolver(loginValidation) });
    return (<Form onSubmit={handleSubmit(handleResult)}>
        <Form.Label>Username : </Form.Label>
        <Form.Control type="text" {...register("username")} isInvalid={errors.username && true} />
        {errors.username && <Alert variant='danger'>{errors.username.message}</Alert>}
        <Form.Label>Password : </Form.Label>
        <Form.Control type="password" {...register("password")} isInvalid={errors.password && true} />
        {errors.username && <Alert variant='danger'>{errors.username.message}</Alert>}
        <Button type="submit" >{btnTxt}</Button>
    </Form>
    )
}
