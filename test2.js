const express = require('express');
const fs = require('fs');
const { exec, spawn } = require('child_process');

const app = express();
const port = 3000;

app.get('/video', (req, res) => {
    const outputFilePath = 'output.mp4';
    const inputFilePath = 'zi.mp4';
    const resolution = '640x360';
    const ffmpegProcess = spawn('ffmpeg', ['-i', inputFilePath, '-vf', `scale=${resolution}`, outputFilePath]);

    ffmpegProcess.on('close', (code) => {
        console.log('ffmpeg process exited successfully');
        if (code === 0) {
            const stat = fs.statSync(outputFilePath);
            const fileSize = stat.size;
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

                const chunkSize = (end - start) + 1;
                const file = fs.createReadStream(outputFilePath, { start, end });
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(206, head);

                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(200, head);
                fs.createReadStream(outputFilePath).pipe(res);
            }
        } else {
            console.error(`ffmpeg process exited with code ${code}`);
            // reject(new Error(`ffmpeg process exited with code ${code}`));
        }
    });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const resizeVideo = (_outputFilePath) => {
    const inputFilePath = 'zi.mp4';
    const resolution = '640x360';
    return new Promise((resolve, reject) => {

        const ffmpegProcess = spawn('ffmpeg', ['-i', inputFilePath, '-vf', `scale=${resolution}`, _outputFilePath]);

        ffmpegProcess.on('close', (code) => {
            if (code === 0) {
                console.log('ffmpeg process exited successfully');
                resolve();
            } else {
                console.error(`ffmpeg process exited with code ${code}`);
                reject(new Error(`ffmpeg process exited with code ${code}`));
            }
        });
    });
}
