import React from 'react'
import { Form } from 'react-bootstrap';
import { formatForDatePicker } from '../utils/utilsFunction';
interface DatePickerProps {
    label: string,
    defaultValue?: number,
    refInput?: any
}
export default function DatePicker({ label, refInput, defaultValue }: DatePickerProps) {
    return (
        <div>
            <div className="row">
                <div className="col-md-4">
                    <Form.Group controlId={`${refInput ? refInput.name : 'date'}`}>
                        <Form.Label>{label}</Form.Label>
                        <Form.Control
                            {...refInput}
                            type="date"
                            defaultValue={formatForDatePicker(defaultValue ? defaultValue : new Date().getTime())} name={`${refInput ? refInput.name : 'date'}`} />
                    </Form.Group>
                </div>
            </div>
        </div>
    )
}
