const express = require("express");
const router = express.Router();
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require ('fluent-ffmpeg')
const ytdl = require('ytdl-core')
const moment = require('moment');

const path = require("path")

const uploadsDir = path.join(__dirname, '../', '/uploads')

router
.route("/")
.post( async(req, res) => {
    const { guildId, fileName, url, startTime, endTime } = req.body
    const mp3 = `${uploadsDir}/${guildId}/${fileName}.mp3`
    const stream = ytdl(url)
   
    let start = moment(startTime, "HH:mm:ss")
    let end = moment(endTime, "HH:mm:ss")

    let formattedDuration = moment.utc(end.diff(start)).format("HH:mm:ss")

    let duration = moment(formattedDuration, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');

    const proc = new ffmpeg({ source:stream })
    proc.setFfmpegPath(ffmpegInstaller.path)
    proc.setStartTime(startTime)
    proc.setDuration(duration)
    proc.on('error', err => console.log(err))
    proc.on('end', () => {
        res.send("success")
    });
    proc.saveToFile(mp3)
});

module.exports = router;
