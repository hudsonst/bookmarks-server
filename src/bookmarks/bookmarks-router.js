const express = require('express')
const logger = require('../logger')
const uuid = require('uuid/v4')
const { bookmarks } = require('../store')

const bookmarkRouter = express.Router()
const bodyParser = express.json()


bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
        res
          .json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
        const { title, url, description, rating } = req.body;
        if (!title) {
          logger.error(`Title is required`);
          return res
            .status(400)
            .send('Invalid data');
        }
        
        if (!url) {
          logger.error(`Url is required`);
          return res
            .status(400)
            .send('Invalid data');
        }

        if (!description) {
            logger.error(`Description is required`);
            return res
              .status(400)
              .send('Invalid data');
          }

        if (!rating) {
            logger.error(`Rating is required`);
            return res
              .status(400)
              .send('Invalid data');
          }
      
      const id = uuid();
      const bookmark = {
        id,
        title,
        url,
        description,
        rating,
      };
      
      bookmarks.push(bookmark);
      
      logger.info(`Bookmark with title ${title}, id ${id} created`);
      
      res
        .status(201)
        .location(`http://localhost:8000/bookmarks/${id}`)
        .json(bookmark);
  })

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
        const { id } = req.params;
        const bookmark = bookmarks.find(c => c.id == id);
      
        // make sure we found a bookmark
        if (!bookmark) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res
            .status(404)
            .send('Bookmark Not Found');
        }
      
        res.json(bookmark);
  })
  .delete((req, res) => {
        const { id } = req.params;
      
        const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
      
        if (bookmarkIndex === -1) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res
            .status(404)
            .send('Not found');
        }
      
        //remove bookmark from Bookmark array

      
        bookmarks.splice(bookmarkIndex, 1);
      
        logger.info(`Bookmark with id ${id} deleted.`);
      
        res
          .status(204)
          .end();
  })

module.exports = bookmarkRouter