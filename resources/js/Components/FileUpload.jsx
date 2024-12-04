import React from 'react';
import { useState} from "react";
import { useDropzone } from 'react-dropzone';
const FileUpload = ({ onDrop, accept, open }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const { getRootProps, getInputProps,acceptedFiles, isDragActive } = useDropzone({
        accept,
        onDrop,
    });
    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="dropzone-content">
                    Release to drop the files here
                </p>
            ) : (
                <p className="dropzone-content">
                    Drag’n’drop some files here, or click to select files
                </p>

            )}
            <button type="button" onClick={open} className="btn btn-gradient-primary">
                Click to select files
            </button>
            <ul>
                {acceptedFiles.map((file) => (
                    <li key={file.name}>{file.name}</li>
                ))}
            </ul>
        </div>
    );
};
export default FileUpload;
