import React, { useState, useEffect } from "react";

const ScannerDisplay = ({ setScannedData }) => {
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        let inputBuffer = "";
        let scanTimeout;

        const handleKeyPress = (event) => {
            const key = event.key;

            if (key.length === 1) {
                inputBuffer += key;
                setIsScanning(true);
                clearTimeout(scanTimeout);

                scanTimeout = setTimeout(() => {
                    const scannedArray = inputBuffer.split("|");
                    setScannedData(scannedArray);
                    inputBuffer = "";
                    setIsScanning(false);
                }, 200);
            }
        };

        window.addEventListener("keypress", handleKeyPress);

        return () => {
            window.removeEventListener("keypress", handleKeyPress);
            clearTimeout(scanTimeout);
        };
    }, [setScannedData]);

    
};

export default ScannerDisplay;