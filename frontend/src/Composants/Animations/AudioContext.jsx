import React, { createContext, useContext, useRef } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(null);

    return (
        <AudioContext.Provider value={{ audioRef }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    return useContext(AudioContext);
};