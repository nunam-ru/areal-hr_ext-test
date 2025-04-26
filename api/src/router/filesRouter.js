const express = require('express')
const router = express.Router()
const pool = require('../services/db')
const multer = require('multer')
const { StatusCodes } = require('http-status-codes')

const {
  getFiles,
  addFile,
  deleteFile,
  getFileById,
  deleteFileFromSystem,
} = require('../controllers/filesController')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/files/:emp_id', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const { emp_id } = req.params
            const files = await getFiles(emp_id)
            return res.json(files)
        } catch (err) {
            console.error('Error files:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.post('/files/:emp_id', upload.single('file'), async (req, res) => {
    if (req.isAuthenticated()) {
        const connection = await pool.connect()
        try {
        const { emp_id } = req.params
        const file = req.file
        const newFile = await addFile(req, emp_id, file, connection)
        return res
            .status(StatusCodes.CREATED)
            .json({ message: 'File added successfully', fileId: newFile.id })
        } catch (err) {
            console.error('Error files:', err);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
        connection.release()
        }
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.delete('/files/:fileId', async (req, res) => {
    if (req.isAuthenticated()) {
        const connection = await pool.connect()
        try {
        const { fileId } = req.params
        const { filepath } = req.query
        await connection.query('BEGIN')

        await deleteFile(req, fileId, connection)
        await deleteFileFromSystem(filepath)

        await connection.query('COMMIT')

        return res
            .status(StatusCodes.OK)
            .json({ message: 'File successfully deleted' })
        } catch (err) {
            console.error('Error files:', err);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
        connection.release()
        }
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.get('/files/download/:fileId', async (req, res) => {
    if (req.isAuthenticated()) {
        const { fileId } = req.params
        try {
            const file = await getFileById(fileId)
            return res.download(file.path, file.name)
        } catch (err) {
            console.error('Error files:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

module.exports = router
