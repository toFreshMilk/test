const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3000;

const resizeVideo = () => {
    const inputFilePath = 'zi.mp4';
    const outputFilePath = 'output.mp4';
    const resolution = '640x360';

    exec(`ffmpeg -i ${inputFilePath} -vf scale=${resolution} ${outputFilePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
        console.log('File has been resized successfully');
    });

    // return new Promise((resolve, reject) => {
    //     exec(`ffmpeg -i ${_inputFilePath} -vf scale=${resolution} ${outputFilePath}`, (error, stdout, stderr) => {
    //         if (error) {
    //             console.error(`Error: ${error.message}`);
    //             reject(error);
    //             return;
    //         }
    //         if (stderr) {
    //             console.error(`Stderr: ${stderr}`);
    //             reject(stderr);
    //             return;
    //         }
    //         console.log(`Stdout: ${stdout}`);
    //         console.log('File has been resized successfully');
    //         resolve(stdout);
    //     });
    // });
}
app.get('/video', (req, res) => {
    const filePath = 'zi.mp4';
    // const stat = fs.statSync(filePath);

    resizeVideo(filePath)



    //
    // resizeVideo(filePath).then((res) => {
    //     console.log(res)
    //     console.log('res')
    // }).catch((err) => {
    //     console.log(err)
    //     console.log('err')
    // })


    // console.log('rStat', rStat)
    // console.log('stat', stat)

    // const fileSize = stat.size;
    // const fileSize = video.size;
    // const range = req.headers.range;
    // console.log(range)

    // if (range) {
    //     const parts = range.replace(/bytes=/, "").split("-");
    //     const start = parseInt(parts[0], 10);
    //     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    //
    //     const chunkSize = (end - start) + 1;
    //     const file = fs.createReadStream(filePath, { start, end });
    //     const head = {
    //         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    //         'Accept-Ranges': 'bytes',
    //         'Content-Length': chunkSize,
    //         'Content-Type': 'video/mp4',
    //     };
    //
    //     res.writeHead(206, head);
    //     file.pipe(res);
    // } else {
    //     const head = {
    //         'Content-Length': fileSize,
    //         'Content-Type': 'video/mp4',
    //     };
    //     res.writeHead(200, head);
    //     fs.createReadStream(filePath).pipe(res);
    // }


});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    const filePath = 'zi.mp4';
    // const stat = fs.statSync(filePath);

    resizeVideo()


});
