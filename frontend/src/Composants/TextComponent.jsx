import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import '../assets/css/TextComponent.css';

const TextComponent = () => {
    const { t } = useTranslation();

    return (
        <motion.div 
            className="text-container"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <h2>{t('textComponent.title')}</h2>
            <p>{t('textComponent.paragraph1')}</p>
            <br />
            <p>{t('textComponent.paragraph2')}</p>
        </motion.div>
    );
}

export default TextComponent;
