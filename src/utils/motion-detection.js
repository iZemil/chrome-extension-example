// https://developers.google.com/web/fundamentals/media/recording-video/

// Cross browser support to fetch the correct getUserMedia object.
navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

// Cross browser support for window.URL.
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

class MotionDetector {
    constructor(canvasEl, canvasFinalEl, videoEl) {
        this.alpha = 0.5;
        this.version = 0;

        this.canvas = canvasEl;
        this.canvasFinal = canvasFinalEl;
        this.video = videoEl;

        this.ctx = this.canvas.getContext('2d');
        this.ctxFinal = this.canvasFinal.getContext('2d');

        this.localStream = null;
        this.imgData = null;
        this.imgDataPrev = [];

        this.success = this.success.bind(this);
        this.handleError = this.handleError.bind(this);

        if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true }, this.success, this.handleError);
        } else {
            console.error('Your browser does not support getUserMedia');
        }

        this.snapshot = this.snapshot.bind(this);
        setInterval(this.snapshot, 60);
    }

    snapshot() {
        const { canvas, canvasFinal, video, ctx, ctxFinal, localStream, alpha } = this;

        if (localStream) {
            canvas.width = video.offsetWidth;
            canvas.height = video.offsetHeight;
            canvasFinal.width = video.offsetWidth;
            canvasFinal.height = video.offsetHeight;

            ctx.drawImage(video, 0, 0);

            // Must capture image data in new instance as it is a live reference.
            // Use alternative live referneces to prevent messed up data.
            this.imgDataPrev[this.version] = ctx.getImageData(0, 0, canvas.width, canvas.height);
            this.version = this.version == 0 ? 1 : 0;

            this.imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const { version, imgData, imgDataPrev } = this;

            let length = imgData.data.length;
            let x = 0;

            while (x < length) {
                // Alpha blending formula: out = (alpha * new) + (1 - alpha) * old.
                const imgDD = imgData.data;

                imgDD[x] = alpha * (255 - imgDD[x]) + (1 - alpha) * imgDataPrev[version].data[x];

                imgDD[x + 1] =
                    alpha * (255 - imgDD[x + 1]) + (1 - alpha) * imgDataPrev[version].data[x + 1];

                imgDD[x + 2] =
                    alpha * (255 - imgDD[x + 2]) + (1 - alpha) * imgDataPrev[version].data[x + 2];

                imgDD[x + 3] = 255;

                x += 4;
            }

            ctxFinal.putImageData(imgData, 0, 0);
        }
    }

    success(stream) {
        const { video } = this;

        this.localStream = stream;
        video.srcObject = stream;
        video.play();
    }

    handleError(error) {
        console.error(error);
    }

    detected() {
        console.log('DETECTED');
    }
}

export default MotionDetector;
