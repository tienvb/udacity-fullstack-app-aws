import express from 'express';
import bodyParser from 'body-parser';
import { isUri } from 'valid-url';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';

const BAD_REQUEST_CODE = 400;
const SUCCESS_CODE = 200;
const INTERNAL_SERVER_ERROR = 500;

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
app.get("/filteredimage", async (req, res) => {
  try{
    const { image_url } = req.query;
    if(!image_url) {
      return res.status(BAD_REQUEST_CODE).send({
        success: false,
        message: "Image url is empty!"
      });
    }

    if(!isUri(image_url)){
      return res.status(BAD_REQUEST_CODE).send({
        success: false,
        message: "Image url is not valid!"
      });
    }

    const filtered_path = await filterImageFromURL(image_url);

    res.status(SUCCESS_CODE).sendFile(filtered_path);
    
    res.on('finish', () => deleteLocalFiles([filtered_path]));
  } catch{
    res.status(INTERNAL_SERVER_ERROR).send({
      success: false,
      message: "Server error!"
    });
  }
});
//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get( "/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});


// Start the Server
app.listen(port, () => {
    console.log(`server running http://localhost:${ port }`);
    console.log(`press CTRL+C to stop server`);
});
