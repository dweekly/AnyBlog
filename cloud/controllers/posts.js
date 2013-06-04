var _ = require('underscore');
var Post = Parse.Object.extend('Post');

// Display all posts.
exports.index = function(req, res) {
  var query = new Parse.Query(Post);
  query.descending('createdAt');
  query.find().then(function(results) {
    res.render('posts/index', { 
      posts: results
    });
  },
  function() {
    res.send(500, 'Failed loading posts');
  });
};

// Display a form for creating a new post.
exports.new = function(req, res) {
  res.render('posts/new', {});
};

// Create a new post with specified title and body.
exports.create = function(req, res) {
  var post = new Post();

  // Explicitly specify which fields to save to prevent bad input data
  post.save(_.pick(req.body, 'title', 'body')).then(function() {
    res.redirect('/posts');
  },
  function() {
    res.send(500, 'Failed saving post');
  });
};

// Show a given post based on specified id.
exports.show = function(req, res) {
  var postQuery = new Parse.Query(Post);
  var foundPost;
  postQuery.get(req.params.id).then(function(post) {
    if (post) {
      foundPost = post;
      var Comment = Parse.Object.extend('Comment');
      var commentQuery = new Parse.Query(Comment);
      commentQuery.equalTo('post', post);
      commentQuery.descending('createdAt');
      return commentQuery.find();
    } else {
      return [];
    }
  }).then(function(comments) {
    res.render('posts/show', {
      post: foundPost,
      comments: comments
    });
  },
  function() {
    res.send(500, 'Failed finding the specified post to show');
  });
};

// Display a form for editing a specified post.
exports.edit = function(req, res) {
  var query = new Parse.Query(Post);
  query.get(req.params.id).then(function(post) {
    if (post) {
      res.render('posts/edit', { 
        post: post
      })
    } else {
      res.send('specified post does not exist')
    }
  },
  function() {
    res.send(500, 'Failed finding post to edit');
  });
};

// Update a post based on specified id, title and body.
exports.update = function(req, res) {
  var post = new Post();
  post.id = req.params.id;
  post.save(_.pick(req.body, 'title', 'body')).then(function() {
    res.redirect('/posts/' + post.id);
  },
  function() {
    res.send(500, 'Failed saving post');
  });
};

// Initial call should be deleteRecursive(objects, 0, function() {...});
// Invokes callback after all items in objects are deleted.
// Only works if number of objects is small (to avoid Cloud Code timeout).
var deleteRecursive = function(objects, index, callback) {
  if (index >= objects.length) {
    callback();
  } else {
    objects[index].destroy().then(function() {
      deleteRecursive(objects, index + 1, callback);
    });
  }
}

// Delete a post corresponding to the specified id.
exports.delete = function(req, res) {
  var post = new Post();
  post.id = req.params.id;

  // Also delete post's comments by chaining destroy calls.
  // Assumption: there will be a small number of comments per post.
  var query = new Parse.Query(Parse.Object.extend('Comment'));
  query.equalTo("post", post);
  query.find().then(function(results) {
    deleteRecursive(results, 0, function() {
      // After all comments are deleted, delete the post itself.
      post.destroy().then(function() {
        res.redirect('/posts');
      },
      function() {
        res.send(500, 'Failed deleting post');
      });
    });
  },
  function() {
    res.send(500, 'Failed finding comments for post');
  });
};
