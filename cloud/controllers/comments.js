var _ = require('underscore');
var Comment = Parse.Object.extend('Comment');

// Display all comments.
exports.index = function(req, res) {
  var query = new Parse.Query(Comment);
  query.descending('createdAt');
  query.find().then(function(results) {
    res.render('comments/index', { comments: results });
  },
  function() {
    res.send(500, 'Failed loading comments');
  });
};

// Create a new comment with specified author and body.
exports.create = function(req, res) {
  var comment = new Comment();
  var Post = Parse.Object.extend('Post');
  var post = new Post();
  post.id = req.params.post_id;
  comment.set('post', post);

  // Explicitly specify which fields to save to prevent bad input data
  comment.save(_.pick(req.body, 'author', 'author_email', 'body')).then(function() {
    res.redirect('/posts/' + req.params.post_id);
  },
  function() {
    res.send(500, 'Failed saving comment');
  });
};

// Delete a comment corresponding to the specified id.
exports.delete = function(req, res) {
  var comment = new Comment();
  comment.id = req.params.id;
  comment.destroy().then(function() {
    res.redirect('/posts/' + req.params.post_id);
  },
  function() {
    res.send(500, 'Failed deleting comment');
  });
};
