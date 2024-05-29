const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3000;

const resizeVideo = (_outputFilePath) => {
    const inputFilePath = 'zi.mp4';
    const resolution = '64x36';

    return new Promise((resolve, reject) => {
        const already = fs.statSync(_outputFilePath);
        if (already) {
            reject('')
        } else {
            exec(`ffmpeg -i ${inputFilePath} -vf scale=${resolution} ${_outputFilePath}`, (error, stdout, stderr) => {
                if (error) {
                    // console.error(`Error: ${error.message}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    // console.error(`Stderr: ${stderr}`);
                    reject(stderr);
                    return;
                }
                // console.log(`Stdout: ${stdout}`);
                // console.log('File has been resized successfully');
                resolve(stdout);
            });
        }
    });
}

app.get('/video', (req, res) => {
    const outputFilePath = 'output2.mp4';

    resizeVideo(outputFilePath).then((result) => {

    }).catch((err) => {
        const stat = fs.statSync(outputFilePath);

        // console.log('stat', stat)

        const fileSize = stat.size;
        const range = req.headers.range;
        console.log(range)
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
    })
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
