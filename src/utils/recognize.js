import helpers from './helpers';

const { debounce } = helpers;

// docs with events: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
const recognize = readTranscript =>
    new Promise((resolve, reject) => {
        const recognition = new webkitSpeechRecognition();
        window.Recognition = recognition;

        const stopRecognition = () => {
            resolve(finalTranscript, event);
            recognition.stop();
        };
        const debouncedStop = debounce(stopRecognition, 1000 * 5);
        let finalTranscript = '';

        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.start();

        recognition.onstart = event => {
            if (!window.isRunnig) {
                recognition.stop();
                reject('Stopped');
            }
        };

        recognition.onresult = event => {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            readTranscript(interimTranscript, finalTranscript);

            debouncedStop();
        };

        recognition.onend = event => {
            resolve(finalTranscript, event);
        };

        recognition.onerror = event => {
            reject(event);
        };

        // Stop recognition by click
        // const answerBtn = document.querySelector('.ui__answer');
        // answerBtn.addEventListener('click', () => {
        //     stopRecognition();
        // });
    });

export default recognize;
