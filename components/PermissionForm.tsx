import React from 'react'
import { Alert, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { AccountPermission, PermissionWithUserType, User } from '../types/User';
type Props = {
    defaultValue: PermissionWithUserType;
    handleResult: (form: PermissionWithUserType) => any;
}
export default function PermissionForm({ defaultValue, handleResult }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<PermissionWithUserType>();
    let { showStatistics, manageAccountancy, userType, manageDonateMarket, manageProduct, manageSchedule, manageUsers } = defaultValue;
    return (<Form onSubmit={handleSubmit((form) => handleResult({ ...form, userType: Number(form.userType) }))}>
        <Form.Label >User Type : </Form.Label>
        <Form.Select {...register("userType")} defaultValue={userType}>
            <option value={0}>Volunteer</option>
            <option value={1}>Donator</option>
            <option value={2}>Needy</option>
        </Form.Select>
        <h4>Users</h4>
        <Form.Check type="checkbox" {...register("manageUsers.create")} defaultChecked={manageUsers.create} label="create" />
        <Form.Check type="checkbox" {...register("manageUsers.update")} defaultChecked={manageUsers.update} label="update" />
        <Form.Check type="checkbox" {...register("manageUsers.remove")} defaultChecked={manageUsers.remove} label="remove" />
        <Form.Check type="checkbox" {...register("manageUsers.show")} defaultChecked={manageUsers.show} label="show" />
        <h4>Own depot</h4>
        <Form.Check type="checkbox" {...register("manageProduct.create")} defaultChecked={manageProduct.create} label="create" />
        <Form.Check type="checkbox" {...register("manageProduct.update")} defaultChecked={manageProduct.update} label="update" />
        <Form.Check type="checkbox" {...register("manageProduct.remove")} defaultChecked={manageProduct.remove} label="remove" />
        <Form.Check type="checkbox" {...register("manageProduct.show")} defaultChecked={manageProduct.show} label="show" />
        <h4>Entire depot</h4>
        <Form.Check type="checkbox" {...register("manageDonateMarket.create")} defaultChecked={manageDonateMarket.create} label="create" />
        <Form.Check type="checkbox" {...register("manageDonateMarket.update")} defaultChecked={manageDonateMarket.update} label="update" />
        <Form.Check type="checkbox" {...register("manageDonateMarket.remove")} defaultChecked={manageDonateMarket.remove} label="remove" />
        <Form.Check type="checkbox" {...register("manageDonateMarket.show")} defaultChecked={manageDonateMarket.show} label="show" />
        <h4>Schedule</h4>
        <Form.Check type="checkbox" {...register("manageSchedule.create")} defaultChecked={manageSchedule.create} label="create" />
        <Form.Check type="checkbox" {...register("manageSchedule.update")} defaultChecked={manageSchedule.update} label="update" />
        <Form.Check type="checkbox" {...register("manageSchedule.remove")} defaultChecked={manageSchedule.remove} label="remove" />
        <Form.Check type="checkbox" {...register("manageSchedule.show")} defaultChecked={manageSchedule.show} label="show" />
        <h4>Accoutancy</h4>
        <Form.Check type="checkbox" {...register("manageAccountancy.create")} defaultChecked={manageAccountancy.create} label="create" />
        <Form.Check type="checkbox" {...register("manageAccountancy.update")} defaultChecked={manageAccountancy.update} label="update" />
        <Form.Check type="checkbox" {...register("manageAccountancy.remove")} defaultChecked={manageAccountancy.remove} label="remove" />
        <Form.Check type="checkbox"{...register("manageAccountancy.show")} defaultChecked={manageAccountancy.show} label="show" />
        <h4>Show statistics</h4>
        <Form.Check type="checkbox" {...register("showStatistics")} defaultChecked={showStatistics} label="show" />
        <Button variant='warning' type='submit'>Update permission</Button>
    </Form>
    )
}
