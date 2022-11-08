import { yupResolver } from '@hookform/resolvers/yup';
import { PropsWithChildren, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { usePlacesWidget } from "react-google-autocomplete";
import { useForm } from "react-hook-form";
import { registerValidation } from '../data/validations/users';
import { User, UserRegistration } from '../types/User';
import DatePicker from './DatePicker';


type Props = {
    handleResult: (result: UserRegistration) => any;
    defaultValue?: UserRegistration;
    handleError?: any;
    showSubmit?: boolean;
    mode?: 'onChange' | 'onSubmit';
    btnTxt?: string;

}

export default function UserForm({ handleResult, btnTxt = "submit", handleError, defaultValue, children, mode = 'onSubmit', showSubmit = mode === 'onSubmit' ? true : false }: PropsWithChildren<Props>) {

    const { register, handleSubmit, formState: { errors } } = useForm<UserRegistration>({
        mode: mode,
        resolver: yupResolver(registerValidation)
    });
    const [errorOnAddress, setErrorOnAddress] = useState<boolean>(false)
    const [address, setAddress] = useState<User["address"]>();
    const [userDefault, setUserDefault] = useState(defaultValue);


    const { ref, autocompleteRef } = usePlacesWidget<HTMLInputElement>({

        onPlaceSelected: (selected) => {
            console.log(selected)
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

    const onSubmit = (userData: UserRegistration) => {
        let selected = autocompleteRef.current?.getPlace();
        let coord = {
            long: selected?.geometry?.location?.lng() as number,
            lat: selected?.geometry?.location?.lat() as number
        }
        let computed_address = selected?.formatted_address;
        if ((computed_address && coord) || address) {
            handleResult({
                ...userData,
                birthDate: new Date(userData.birthDate).getTime(),
                address: {
                    computed_address: computed_address ? computed_address : address?.computed_address as string,
                    coord: (coord.long && coord.lat) ? coord : address?.coord as { long: number, lat: number }
                },
            })
        } else {
            setErrorOnAddress(true);
        }
    };
    const onError = (errForm: any) => {
        if (!ref?.current?.value) {
            setAddress(undefined);
            setErrorOnAddress(true);
        }
        handleError(errForm);
    }

    return (<Form onSubmit={handleSubmit(onSubmit, handleError ? onError : undefined)}>
        <Form.Label>First Name : </Form.Label>
        <Form.Control {...register("name")} isInvalid={errors.name && true} defaultValue={userDefault?.name} />
        {errors.name && <Alert variant='danger'>{errors.name.message}</Alert>}
        <Form.Label >Last Name : </Form.Label>
        <Form.Control {...register("lastName")} isInvalid={errors.lastName && true} defaultValue={userDefault?.lastName} />
        {errors.lastName && <Alert variant='danger'>{errors.lastName.message}</Alert>}
        <Form.Label >User Name : </Form.Label>
        <Form.Control {...register("username")} isInvalid={errors.username && true} defaultValue={userDefault?.username} />
        {errors.username && <Alert variant='danger'>{errors.username.message}</Alert>}
        <Form.Label >Password :</Form.Label>
        <Form.Control {...register("password")} type="password" isInvalid={errors.password && true} defaultValue={userDefault?.password} />
        {errors.password && <Alert variant='danger'>{errors.password.message}</Alert>}
        <Form.Label >Email : </Form.Label>
        <Form.Control {...register("mail")} type="mail" isInvalid={errors.mail && true} defaultValue={userDefault?.password} />
        {errors.mail && <Alert variant='danger'>{errors.mail.message}</Alert>}
        <DatePicker refInput={register("birthDate")} label="Select your birthdate :" /*isInvalid={errors.name && true}*/ />
        {errors.birthDate && <Alert variant='danger'>{errors.birthDate.message}</Alert>}
        <Form.Label >Address : </Form.Label>
        <Form.Control ref={ref} onChange={(e) => {
            if (errorOnAddress && e.target.value) {
                setErrorOnAddress(false);
            }
        }
        }
            defaultValue={userDefault?.address?.computed_address}
        />
        {errorOnAddress && <Alert variant='danger'>Please submit your location address</Alert>}
        <Form.Label>Phone number : </Form.Label>
        <Form.Control
            type="tel"
            {...register("phone")}
            isInvalid={errors.phone && true}
            defaultValue={userDefault?.phone}
        />
        {errors.phone && <Alert variant='danger'>{errors.phone.message}</Alert>}
        <Form.Label>Choose an avatar : </Form.Label>

        <Form.Control
            {...register("avatarAsFile")}
            type="file" accept="image/*"
            isInvalid={errors.avatarAsFile && true}
        />
        {errors.avatarAsFile && <Alert variant='danger'>{errors.avatarAsFile.message}</Alert>}
        {showSubmit && <Button type="submit">{btnTxt}</Button>}
        {children}
    </Form>
    )
}
