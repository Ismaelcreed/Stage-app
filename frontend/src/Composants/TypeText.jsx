// WriterComponent.jsx
import React from 'react';
import TypingEffect from 'react-typing-effect';
import '../assets/css/TextComponent.css';

const WriterComponent = () => {
    return (
        <div className="writer-container">
            <TypingEffect
                text={["Payer les amendes par version numériques"]}
                speed={100}
                eraseSpeed={50}
                typingDelay={500}
                eraseDelay={2000}
            />
        </div>
    );
}

export default WriterComponent;
