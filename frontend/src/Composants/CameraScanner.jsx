import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button, Modal, Image, notification, Upload, Checkbox } from 'antd';
import Tesseract from 'tesseract.js';
import Camera from "../assets/images/cam.png";
import { useTranslation } from 'react-i18next';
import { hatch } from 'ldrs';

hatch.register();


const CameraScanner = ({ visible, onClose, onCapture }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [skipScan, setSkipScan] = useState(false); // Nouvel état pour gérer le passage du scan
  const {t} = useTranslation();
  // Regular expressions for validation
  const patterns = {
    dateOfBirth: /\bDate de Naissance:\s*(\d{2}\/\d{2}\/\d{4})\b/i,
    placeOfBirth: /\bLieu de Naissance:\s*([^\n\r]+)\b/i,
    address: /\bAdresse:\s*([^\n\r]+)\b/i,
    placeOfIssue: /\bLieu de Délivrance:\s*([^\n\r]+)\b/i,
    issueDate: /\bDate de Délivrance:\s*(\d{2}\/\d{2}\/\d{4})\b/i,
    drivingLicenseNumber: /\bNuméro de Permis de Conduire:\s*(\d{11})\b/i,
    signature: /\bSignature du Titulaire:\s*([^\n\r]+)\b/i,
    bloodGroup: /\bGroupe Sanguin:\s*([^\n\r]+)\b/i,
  };

  // Validate permit
  const validatePermit = (text) => {
    const missingFields = [];
    let isValid = true;

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (!match || match.length < 2) {
        missingFields.push(key);
        isValid = false;
      }
    }

    if (!isValid) {
      notification.error({
        message: t('permis.validation'),
        description: t('permis.desc' , missingFields.join(', ')),
      });
    }

    return isValid;
  };

  // Capture photo
  const capture = useCallback(() => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
    setOcrResult('');
  }, [webcamRef]);

  // Enhance image for OCR
  const enhanceImage = (image) => {
    return image;
  };

  // Perform OCR on the captured photo
  const scan = useCallback(() => {
    if (image) {
      setLoading(true);

      const enhancedImage = enhanceImage(image);
      Tesseract.recognize(
        enhancedImage,
        'fr',
        {
          logger: info => console.log(info),
          
        }
      ).then(({ data: { text } }) => {
        setOcrResult(text);
        setLoading(false);
        if (validatePermit(text)) {
          notification.success({
            message: t('permis.valide'),
            description: t('permis.desc1'),
          });
          onCapture(text);
        }
      }).catch(error => {
        setLoading(false);
        notification.error({
          message: t('permis.err'),
          description: t('permis.desc2' , error.message),
        });
      });
    } else {
      notification.warning({
        message: 'Aucune image',
        description: 'Veuillez d\'abord prendre une photo.',
      });
    }
  }, [image, onCapture]);

  // Handle modal close
  const handleClose = () => {
    setImage(null);
    setOcrResult('');
    setLoading(false);
    setFileLoading(false);
    setSkipScan(false); // Réinitialiser l'état de la checkbox
    onClose();
  };

  // Handle skip scan checkbox change
  const handleSkipChange = (e) => {
    setSkipScan(e.target.checked);
    if (e.target.checked) {
      // Simuler le temps de traitement avant de fermer le modal
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onCapture(''); // Passez un texte vide pour indiquer que le scan est ignoré
        handleClose();
      }, 1000); // 1 seconde pour simuler le traitement
    }
  };

  return (
    <Modal
      title={t('permis.scan')}
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="scan" className='custom-button' onClick={scan} disabled={!image || skipScan}>
          {t('permis.btn')}
        </Button>,
        <Checkbox
          key="skip"
          checked={skipScan}
          onChange={handleSkipChange}
          style={{ marginRight: '10px' }}
        >
         {t('permis.check')}
        </Checkbox>
      ]}
      width={800}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <img
              src={Camera}
              onClick={capture}
              style={{ width: '100%', marginBottom: '70px', fontSize: '16px', border: "1px solid #3a9188", padding: "50px", borderRadius: "50%" }}
            />
          </div>
        </div>
      </div>
      {image && !loading && (
        <Image
          preview={false}
          width={200}
          src={image}
          style={{ marginTop: 10, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        />
      )}
      {loading && <l-hatch
        size="25"
        stroke="4"
        speed="3.5" 
        color="#3a9188"
      ></l-hatch>}
      {ocrResult && (
        <div style={{ marginTop: 20 }}>
          <h3>{t('permis.info')}</h3>
          <p>{ocrResult}</p>
        </div>
      )}
    </Modal>
  );
}

export default CameraScanner;
