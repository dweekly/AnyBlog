var _ = require('underscore');
var Post = Parse.Object.extend('Post');
var Comment = Parse.Object.extend('Comment');

// Display all posts.
exports.index = function(req, res) {
  var query = new Parse.Query(Post);
  query.descending('createdAt');

  query.find().then(function(posts) {
    var query = new Parse.Query(Comment);
    query.descending('createdAt');
    query.find().then(function(comments) {
      res.render('admin/index', { 
        posts: posts,
        comments: comments 
      });
    },
    function() {
      res.send(500, 'Failed loading comments');
    });
  },
  function() {
    res.send(500, 'Failed loading posts');
  });
};
