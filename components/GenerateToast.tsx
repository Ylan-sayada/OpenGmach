import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer, { ToastPosition } from 'react-bootstrap/ToastContainer';
type Props = {
    show?: boolean;
    toastPos?: ToastPosition;
    variant?: string;
    bodyTxt?: string;
    headerTxt?: string;
    handleClose?: any
}
export default function GenerateToast({ show = false, variant = "Primary", bodyTxt = "", headerTxt = "", toastPos = 'bottom-start' }: Props) {
    const [position, setPosition] = useState<ToastPosition>(toastPos);
    return (
        <ToastContainer className="p-3" position={position}>
            <Toast show={show}>
                <Toast.Header closeButton={false}>
                    <strong className="me-auto">{headerTxt}</strong>
                </Toast.Header>
                <Toast.Body className={variant} dangerouslySetInnerHTML={{ __html: bodyTxt }}>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}
