import React from 'react';

const parseScan = (scan) => {
    let rinStart = scan.indexOf('=');
    return scan.slice(rinStart+1,-3);
}

const getStudentInfo = (barcode) => {
    let data = {first_name: "Linus", last_name: "Zwaka", email: "zwakal@rpi.edu", rin: barcode};
    return data;
}

const Scan = ({scan, setBarcode}) => {
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
            // TODO make db call to get student info
            let studentData = getStudentInfo(scannedBarcode);
            console.log("Student data", studentData);
            {setBarcode(studentData)}
        }
    }
}

export default Scan;
