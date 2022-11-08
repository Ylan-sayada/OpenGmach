import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react'
import { Button, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { IMPORTANCE } from '../data/definitions/constant';
import { scheduleValidation } from '../data/validations/scheduler';
import { Schedule } from '../types/Schedule';
import DatePicker from './DatePicker';
type Props = {
    defaultValue?: Schedule,
    handleResult: (schedule: Schedule) => any
}
export default function ReminderForm({ defaultValue, handleResult }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<Schedule>({ resolver: yupResolver(scheduleValidation) });
    return (<Form onSubmit={handleSubmit(handleResult)}>
        <Form.Label>Task Name : </Form.Label>
        <Form.Control type="text" {...register("taskName")} defaultValue={defaultValue?.taskName} />
        {errors.taskName && <Alert variant='danger'>{errors.taskName.message}</Alert>}
        <DatePicker label="Choose a date : " refInput={register("taskDate")} defaultValue={defaultValue?.taskDate} />
        {errors.taskDate && <Alert variant='danger'>{errors.taskDate.message}</Alert>}
        <Form.Label>Importance : </Form.Label>
        <Form.Select defaultValue={defaultValue?.importance} {...register("importance")}>
            {
                IMPORTANCE.map((month, index) => {
                    return <option value={index} key={index}>{month}</option>
                })
            }
        </Form.Select>
        <Button type="submit">Submit Task</Button>
    </Form>
    )
}
