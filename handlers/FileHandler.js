const  fs = require('fs');
const { isEmpty: _isEmpty } = require('lodash');

const { Util } = require('../components');
const { File }  = require('../data/models');
const {ErrorMessages} = require('../constants');

const config = require('../config/config.json');

class FileHandler {
    async findAll(req, res) {
            try {
                const { page = 1, list_size = 10 } = req.query;
                const offset = (page -1) * list_size;

                const files = await File.findAll({  limit: +list_size, offset })

                return res.status(200).json({page, files});
            }catch (e) {
                return res.status(500).json({message: e.message})
            }
        }

    async findOne(req, res) {
            try{
                const { id } = req.params;

                const file = await File.findByPk(id);

                if(_isEmpty(file)) {
                    return res.sendStatus(404);
                }

                return res.status(200).json(file);

            }
            catch (e) {
                return res.status(500).json({message: e.message})
            }
        }
    
    async upload(req, res) {
            try {
                const { file = {} } = req.files;

                if (_isEmpty(file)) {
                    return res.status(400).send(ErrorMessages.FILE_IS_REQUIRED);
                }

                const { mimetype, name, size, data } = file;
                const filePath = Util.getFilePath(name);
                const ext = name.split('.').pop();
                const dir = __dirname + '/../files';

                await File.create( { name, mimetype, ext, size });

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                fs.writeFileSync(filePath, data);

                return res.sendStatus(200);

            }catch (e) {
                return res.status(500).json({message: e.message})
            }

    }

    async download(req, res) {
        try {
            const { id } = req.params;

            const file = await File.findByPk(id);

            if(_isEmpty(file)) {
                return res.status(404).send(ErrorMessages.FILE_NOT_FOUND);
            }

            const { name } = file;
            const filePath = Util.getFilePath(name);

            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=" + name
            });

            fs.createReadStream(filePath).pipe(res);
        }catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

    async update(req, res) {
       try {
           const { id } = req.params;
           const { file: newFile = {} } = req.files;

           if (_isEmpty(newFile)) {
               return res.status(400).send(ErrorMessages.FILE_IS_REQUIRED);
           } else if(newFile.size > config.fileMaxSize) {
               return res.status(400).send(ErrorMessages.INVALID_FILE_SIZE);
           }

           const file = await File.findByPk(id);

           if(_isEmpty(file)) {
               return res.status(404).send(ErrorMessages.FILE_NOT_FOUND);
           }
           const filePath = Util.getFilePath(file.name);

           fs.unlinkSync(filePath);

           const { mimetype, name, size, data } = newFile;
           const newFilePath = Util.getFilePath(name);
           const ext = name.split('.').pop();


           await file.update( { name, mimetype, ext, size });

           fs.writeFileSync(newFilePath, data);

           return res.sendStatus(200);
       } catch (e) {
           return res.status(500).json({message: e.message})
       }
    }

    async remove(req, res) {
            try{
                const { id } = req.params;

                const file = await File.findByPk(id);

                if(_isEmpty(file)) {
                    return res.status(404).json({message: ErrorMessages.FILE_NOT_FOUND});
                }
                const filePath = Util.getFilePath(file.name);

                fs.unlinkSync(filePath);

                await file.destroy();

                res.sendStatus(202);
            }
            catch (e) {
                return res.status(500).json({message: e.message})
            }
    }

}

module.exports = new FileHandler();