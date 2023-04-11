import React from 'react';

const parseScan = (scan) => {
    let rinStart = scan.indexOf('=');
    return scan.slice(rinStart+1,-3);
}

const Scan = ({scan, onScan, updateBarcode}) => {
    console.log(scan);
    if(!scan) {
        return null;
    }

    let scannedBarcode = '';

    window.onkeypress = function(e) {
        let barcode = "";
        let code = e.keyCode;
        barcode = barcode+String.fromCharCode(code);
        scannedBarcode += barcode;

        if(code === 13 && scannedBarcode[0] === ';'){
            scannedBarcode = parseScan(scannedBarcode)
            {onScan()} {updateBarcode(scannedBarcode)}
        }
    }
}

export default Scan;
