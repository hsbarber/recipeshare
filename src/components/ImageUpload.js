import React from 'react';
import PropTypes from 'prop-types';
import FileUploader from 'react-firebase-file-uploader';
import firebase from '../firebase.js'

function ImageUpload (props) {
    return (
        <div className="upload">

            <h4>Upload a recipe image</h4>

            <form className="upload--form">
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
                <p>*Image looks best at width of 1200px or larger</p>
            </form>

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
