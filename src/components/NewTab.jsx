import React, { Component } from 'react';

import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

class NewTab extends Component {
    componentDidMount() {
        // bindings:
        this.detectFrame = this.detectFrame.bind(this);
        this.renderPredictions = this.renderPredictions.bind(this);

        const video = this.videoRef;
        const webCamPromise = navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    facingMode: 'user',
                    width: 640,
                    height: 480
                }
            })
            .then(stream => {
                video.srcObject = stream;

                return new Promise((resolve, reject) => {
                    video.onloadedmetadata = () => {
                        video.play();
                        resolve();
                    };
                });
            })
            .catch(err => console.warn('getUserMedia Error: ', err));
        const modelPromise = cocoSsd.load();

        Promise.all([modelPromise, webCamPromise]).then(values => {
            this.detectFrame(video, values[0]);
        });
    }

    detectFrame(video, model) {
        model.detect(video).then(predictions => {
            this.renderPredictions(predictions);

            requestAnimationFrame(() => {
                this.detectFrame(video, model);
            });
        });
    }

    renderPredictions(predictions) {
        const c = this.canvasRef;
        const ctx = c.getContext('2d');

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Font options.
        const font = '16px sans-serif';
        ctx.font = font;
        ctx.textBaseline = 'top';

        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;

            // Draw the bounding box.
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = '#00FFFF';

            const textWidth = ctx.measureText(prediction.class).width;
            const textHeight = parseInt(font, 10);

            ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

            // Draw the text last to ensure it's on top.
            ctx.fillStyle = '#000000';
            ctx.fillText(prediction.class, x, y);
            console.log(prediction.class);
        });
    }

    render() {
        const [width, height] = [640, 480];

        return (
            <div className="new-tab">
                <div className="motion-detection__window">
                    <video
                        id="video"
                        ref={el => {
                            this.videoRef = el;
                        }}
                        width={width}
                        height={height}
                    />
                    <canvas
                        id="canvas"
                        ref={el => {
                            this.canvasRef = el;
                        }}
                        width={width}
                        height={height}
                    />
                </div>
            </div>
        );
    }
}

export default NewTab;
