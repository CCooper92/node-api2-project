// implement your posts router here
const Post = require('./posts-model.js');
const express = require("express");
const { update } = require('./posts-model.js');
const router = express.Router()

router.get("/", (req,res) => {
    Post.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({message: 'The posts information could not be retrieved'});
    })
});

router.get('/:id', (req, res) => {
    const {id} = req.params
    Post.findById(id)
      .then(post => {
        if (!post) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' });
        } else {
            res.status(200).json(post);
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: 'The post information could not be retrieved',
        });
      });
  });

  router.post('/', (req,res) => {
      const newPost = req.body
      if(!newPost.title || !newPost.contents){
          res.status(400).json({message: "Please provide title and contents for the post"})
      }else{
          Post.insert(newPost)
          .then(post => {
              res.status(201).json(post);
          })
          .catch(error => {
              console.log(error);
              res.status(500).json({ message: "There was an error while saving the post to the database"})
          })
      }
  });

  router.put('/:id', async (req,res) => {
      const {id} = req.params
      const changes = req.body

      try{
          if(!changes.title || !changes.contents){
              res.status(400).json({message: "Please provide title and contents for the post"})
          }else{
              const updatedPost = await Post.update(id, changes)
              if(!updatedPost){
                  res.status(404).json({message: "The post with the specified ID does not exist"})
              }else{
                  res.status(200).json(updatedPost)
              }
          }
      }catch(err){
          res.status(500).json({message: "The post information could not be modified"})
      }
    })

    router.delete("/:id", async (req,res) => {
        try{
            const {id} = req.params
            const deletedPost = await Post.delete(id)
            if(!deletedPost){
                res.status(404).json({ message: "The post with the specified ID does not exist"})
            }else{
                res.status(201).json(deletedPost)
            }
        }catch(err){
            res.status(500).json({message: "The post could not be removed"})
        }
    })

    router.post("/:id/comments", (req,res) => {
        const postId = req.params
        Post.findPostComments(postId)
        .then(comments => {
            if(!comments){
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }else{
                res.status(200).json(comments)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The comments information could not be retrieved"})
        })
    })

module.exports = router