import React, { RefObject } from 'react';
import { Button } from 'react-bootstrap';
type Props = {
    handleFile: any,
    multiple?: boolean,
    label: string
}
const FileUploader = ({ handleFile, label, multiple = false }: Props) => {

    const hiddenFileInput = React.useRef<any>(null);
    const handleClick = (event: any) => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    const handleChange = (event: any) => {
        const fileUploaded = event.target.files;
        handleFile(fileUploaded);
    };
    return (
        <>
            <Button onClick={handleClick}>
                {label}
            </Button>
            <input type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                multiple={multiple}
                style={{ display: 'none' }}
            />
        </>
    );
};
export default FileUploader;
