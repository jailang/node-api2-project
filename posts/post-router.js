const express = require("express");

const router = express.Router();

const Posts = require("../data/db");

// GET POSTS
router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// GET POST by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then(post => {
      post
        ? res.status(200).json(post)
        : res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// GET COMMENT by ID

router.get("/:post_id/comments", (req, res) => {
  const { post_id } = req.params;
  Posts.findById(post_id)
    .then(([post]) => {
      if (post) {
        Posts.findPostComments(post_id).then(comments => {
          res.status(200).json(comments);
        });
      } else {
        res.status(404).json({ error: "Post with id does not exist" });
      }
    })
    .catch(err => {
      console.log("get comments", err);
      res.status(500).json({ error: "Error getting post comments" });
    });
});

// POST A POST
router.post("/", (req, res) => {
  const postData = req.body;

  if (!postData.title || !postData.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }

  Posts.insert(postData)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "These was an error while saving the post to the database."
      });
    });
});

// POST A COMMENT
router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  const commentData = req.body;

  if (!commentData.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    Posts.findById(id)
      .then(post => {
        if (post.length !== 0) {
          Posts.insertComment(commentData)
            .then(comment => {
              res.status(201).json({ ...comment, ...commentData });
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database."
              });
            });
        } else {
          res
            .status(404)
            .json({ message: "The post with specified ID does not exist." });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message:
            "There was an error while saving the comment to the database."
        });
      });
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Posts.remove(id)
    .then(post => {
      post > 0
        ? res.status(200).json({ message: "The post has been removed" })
        : res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The post could not be removed." });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const postData = req.body;

  Posts.findById(id)
    .then(post => {
      if (post.length > 0) {
        if (!postData.title || !postData.contents) {
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
          });
        } else {
          Posts.update(id, {
            title: postData.title,
            contents: postData.contents
          })
            .then(updated => {
              Posts.findById(id)
                .then(post => res.status(200).json(post))
                .catch(error => {
                  console.log(error);
                  res.status(500).json({
                    error: "The post information could not be modified."
                  });
                });
            })
            .catch(error => {
              console.log(error);
              res
                .status(500)
                .json({ error: "The post information could not be modified." });
            });
        }
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router;
