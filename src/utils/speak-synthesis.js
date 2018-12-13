const synth = window.speechSynthesis;

const speak = message =>
    new Promise((resolve, reject) => {
        if (synth.speaking) {
            console.error('speechSynthesis.speaking');
            reject('speechSynthesis.speaking');
        }

        if (message.trim() !== '') {
            const utterThis = new SpeechSynthesisUtterance(message);
            const voices = synth.getVoices();

            utterThis.onerror = event => {
                console.error('SpeechSynthesis ERORR');
                reject('SpeechSynthesis ERORR');
            };

            utterThis.onend = event => {
                resolve(event);
            };

            for (let i = 0; i < voices.length; i += 1) {
                if (voices[i].name === 'Google US English') {
                    utterThis.voice = voices[i];
                }
            }
            utterThis.pitch = 0.7;
            utterThis.rate = 1;

            synth.speak(utterThis);
        }
    });

export default speak;
