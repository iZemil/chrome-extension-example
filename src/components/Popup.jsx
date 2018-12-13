import React from 'react';
import speak from '../utils/speak-synthesis';

function Popup() {
    speak('Hello world');

    return <div>Zemil</div>;
}

export default Popup;
