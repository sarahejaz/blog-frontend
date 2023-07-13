import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from '../styles/sass-styles/styles.module.scss';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Image from 'next/image';

const FileUploader = (props) => {
  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    props.handleFile(fileUploaded);
  };

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [existingImage, setExistingImage] = useState(props.image);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      //setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    //console.log('objurl ', objectUrl);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setExistingImage(null);
    setSelectedFile(e.target.files[0]);
    props.handleFile(e.target.files[0]);
  };

  return (
    <>
      {existingImage && (
        <>
          {' '}
          <Image
            src={existingImage}
            alt={existingImage ? existingImage : 'Image'}
            width="400"
            height="220"
            objectFit="cover"
          />{' '}
          <br />
          <br />
        </>
      )}
      {selectedFile !== undefined && preview !== undefined && (
        <>
          {' '}
          <Image
            src={preview}
            alt="preview"
            width="400"
            height="220"
            objectFit="cover"
          />{' '}
          <br />
          <br />
        </>
      )}

      <Button
        onClick={handleClick}
        className={styles.uploadFileButton}
        startIcon={<AttachFileIcon />}
      >
        Upload Cover image
      </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={onSelectFile}
        style={{ display: 'none' }}
      />
      <br />
      <p className={styles.coverImageSizeMessage}>
        (Cover image size will be 900px x 500px)
      </p>
    </>
  );
};

export default FileUploader;
