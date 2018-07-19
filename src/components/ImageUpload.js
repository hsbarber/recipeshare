import React from 'react';


function ImageUpload (props) {
    return (
        <div>
            <p>*Image must be wider than 1200px</p>
            <div className="preview">
            {props.image ? <img className="previewImg" src={props.image} alt="uploadImage" /> : ''}
            {props.uploaded ? <p>{props.file.name} is uploaded</p> :
            <pre>
                <code>
                    {props.error ? <span className='error'>{props.error}</span> : ''}
                </code>
            </pre>
            }
            </div>
            <div className="upload">
                <input type='file' onChange={props.handleFileSelect}/>
                {props.uploaded ? <button className="img" onClick={props.printImage}>Preview</button> :
                 <button className="img" onClick={props.handleFileUpload}>Upload</button>}
            </div>

        </div>
    )
}
export default ImageUpload;

// {props.uploaded ? <button className="img" onClick={props.printImage}>Preview</button> :
//                 <button className="img" onClick={props.handleFileUpload}>Upload</button>}