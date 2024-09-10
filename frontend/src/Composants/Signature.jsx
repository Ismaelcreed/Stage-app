// SignatureComponent.jsx
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureComponent = ({ onSignature }) => {
    const sigCanvas = useRef(null);

    const clear = () => {
        sigCanvas.current.clear();
    };

    const save = () => {
        const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        onSignature(dataURL);
    };

    return (
        <div style={{ margin: '20px' }}>
            <SignatureCanvas
                ref={sigCanvas}
                penColor='black'
                canvasProps={{ width: 400, height: 200, className: 'signature-canvas' }}
            />
            <button className='custom-button' onClick={clear}>Effacer</button>
            <button className="custom-button" style={{ marginLeft: '10px' }} onClick={save}>
                Enregistrer
            </button>

        </div>
    );
};

export default SignatureComponent;
