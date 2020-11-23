
const express = require("express");
const router = express.Router();
const fs = require('fs')
const moment = require('moment');
const path = require("path")

const uploadsDir = path.join(__dirname, '../', '/uploads')

router
.route('/')
.post( async(req, res) => {
    try {
        const { id } = req.body
        let fileDir = `${uploadsDir}/${id}`

        fs.readdir(fileDir, (err, files) => {
            let formattedFiles = []
            files.forEach(file => {
                let created_at = moment(fs.statSync(`${fileDir}/${file}`).ctime).format('D MMM Y - HH:mm:ss')
                let f = file.split('.')
                formattedFiles.push({ name: f[0], created_at  })
            })
            res.json(formattedFiles)
        })
    } catch(err) {
        res.send({ error: true, msg: err })
    }
})


router
.route('/delete')
.post( async(req, res) => {
    try {
        const { fileName, id } = req.body
        fs.unlinkSync(`${uploadsDir}/${id}/${fileName}.mp3`)
        res.send("success delete")
    } catch(err) {
        console.log(err)
    }
})

router
.route('/rename')
.post( async(req, res) => {
    try {
        const { newName, prevName, id } = req.body
        fs.rename(
            `${uploadsDir}/${id}/${prevName}.mp3`, 
            `${uploadsDir}/${id}/${newName}.mp3`,
            (err) => {
                if(err) res.send("error")
                else res.send('success update')
            })
    } catch(err) {
        console.log(err)
    }
})


module.exports = router