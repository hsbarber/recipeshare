import React from 'react';
import PropTypes from 'prop-types';
import FileUploader from 'react-firebase-file-uploader';
import firebase from '../firebase/firebase';

function ImageUpload(props) {
  const {
    isUploading,
    progress,
    imageURL,
    handleUploadStart,
    handleUploadError,
    handleUploadSuccess,
    handleProgress,
  } = props;
  return (
    <div className="rForm--img">
      <h4>Upload a recipe image</h4>

      <div className="rForm--img-input">
        {isUploading && <p>Progress: {progress}</p>}
        {imageURL && <img src={imageURL} alt="imageUpload" />}
        <FileUploader
          accept="image/*"
          name="image"
          randomizeFilename
          storageRef={firebase.storage().ref('images')}
          onUploadStart={handleUploadStart}
          onUploadError={handleUploadError}
          onUploadSuccess={handleUploadSuccess}
          onProgress={handleProgress}
        />
        <p className="image-note">
          *Image looks best at width of 1200px or larger
        </p>
      </div>
    </div>
  );
}
ImageUpload.propTypes = {
  isUploading: PropTypes.bool,
  progress: PropTypes.number,
  imageURL: PropTypes.string,
  handleUploadStart: PropTypes.func,
  handleUploadError: PropTypes.func,
  handleUploadSuccess: PropTypes.func,
  handleProgress: PropTypes.func,
};
export default ImageUpload;
