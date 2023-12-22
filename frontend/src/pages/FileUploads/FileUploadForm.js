import React, { useState } from 'react';
import api from '../../api';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap'

const FileUploadForm = (onUpdate) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        console.log('Uploading file...');

        api({
            method: 'post',
            url: '/api/uploads/',
            data: formData,
        })
            .then((response) => {
                console.log('File uploaded successfully.');
                onUpdate(response.data)
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    };

    return (
        // <div>
        //     <input type="file" onChange={handleFileChange} />
        //     <button onClick={handleUpload}>Upload File</button>
        // </div>
        <Form className='mb-3' onSubmit={handleUpload}>
            <InputGroup>
                <Form.Group controlId="formFile" className="mr-3">
                    <Form.Control type="file" onChange={handleFileChange} required />
                </Form.Group>
                <Button variant="primary" type='submit'>
                    Upload File
                </Button>
            </InputGroup>
        </Form>
    );
};

export default FileUploadForm;
