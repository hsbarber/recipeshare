import React from 'react';
import PropTypes from 'prop-types';
import FileUploader from 'react-firebase-file-uploader';
import firebase from '../firebase.js'

function ImageUpload (props) {
    return (
        <div>
            <p>*Image must be wider than 1200px</p>
            <div className="preview">
            {/* {props.image ? <img className="previewImg" src={props.image} alt="uploadImage" /> : ''}
            {props.uploaded ? <p>{props.file.name} is uploaded</p> :

            } */}
            </div>
            <div className="upload">
                {/* <input type='file' onChange={props.handleFileSelect}/>
                {props.uploaded ? <button className="img" onClick={props.printImage}>Preview</button> :
                 <button className="img" onClick={props.handleFileUpload}>Upload</button>} */}
                 <form>
                 {props.isUploading &&
                    <p>Progress: {props.progress}</p>
                    }
                    {props.imageURL &&
                        <img src={props.imageURL} />
                    }
                <FileUploader
                    accept="image/*"
                    name="image"
                    randomizeFilename
                    storageRef={firebase.storage().ref('images')}
                    onUploadStart={props.handleUploadStart}
                    onUploadError={props.handleUploadError}
                    onUploadSuccess={props.handleUploadSuccess}
                    onProgress={props.handleProgress}
                />
                </form>
            </div>

        </div>
    )
}
ImageUpload.PropTypes = {
    isUploading: PropTypes.bool,
    progress: PropTypes.number,
    imageURL: PropTypes.string,
    handleUploadStart: PropTypes.func,
    handleUploadError: PropTypes.func,
    handleUploadSuccess: PropTypes.func,
    handleProgress: PropTypes.func,
}
export default ImageUpload;

// {props.uploaded ? <button className="img" onClick={props.printImage}>Preview</button> :
//                 <button className="img" onClick={props.handleFileUpload}>Upload</button>}