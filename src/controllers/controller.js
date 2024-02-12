const uploadFile = require("../middleware/middleware");
const fs = require("fs");


const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }
        const fileName = req.file ? req.file.originalname : 'Unknown File';
        res.status(500).send({
            message: `Could not upload the file: ${fileName}. ${err}`,
        });
    }
};


const getListFiles = (req, res) => {
    const directoryPath = "./uploads/";

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
            });
        });

        res.status(200).send(fileInfos);
    });
};


const remove = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = "./uploads/";

    fs.unlink(directoryPath + fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not delete the file. " + err,
            });
        }

        res.status(200).send({
            message: "File is deleted.",
        });
    });
};

module.exports = {
    upload,
    getListFiles,
    remove,
};
