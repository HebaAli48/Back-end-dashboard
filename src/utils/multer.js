const multer  = require('multer')
const DatauriParser = require('datauri/parser');
const path = require('path');
const storage = multer.memoryStorage();
const multerUploads = multer({ storage });


// const dUri = new Datauri();
const parser = new DatauriParser();
/**
* @description This function converts the buffer to data url
* @param {Object} file containing the field object
* @returns {String} The data url from the string buffer
*/
// const dataUri = async req => await DataURI.format(path.extname(req.file.originalname).toString(), req.file.buffer);
const dataUri = file => parser.format(file.originalname, file.buffer);

module.exports = { multerUploads, dataUri };