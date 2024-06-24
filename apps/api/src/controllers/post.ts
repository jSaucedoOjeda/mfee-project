import { getCategory } from './category';
import { Post } from '../models/post';
import { Comment } from '../models/comment';

const posts: Array<Post> = [];
const comments: Array<Comment> = [];

const getPostById = (id: string) => {
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return;
  }

  const postCategory = getCategory(post.category);
  const postComments = comments.filter((c) => post.comments.includes(c.id));

  return {
    ...post,
    category: postCategory,
    comments: postComments
  };
};

const getPosts = (req, res) => {
  res.status(200).json(posts);
};

const getPostsByCategory = (req, res) => {
  const { category } = req.params;
  const postsByCategory = posts.filter((p) => p.category === category);
  res.status(200).json(postsByCategory);
};

const getPost = (req, res) => {
  const { id } = req.params;
  const post = getPostById(id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(200).json(post);
};

const createPost = (req, res) => {
  const { title, image, description, category } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (!image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  if (!description) {
    return res.status(400).json({ message: 'Description is required' });
  }

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  const newPost: Post = {
    id: Date.now().toString(),
    title,
    image,
    description,
    category,
    comments: []
  };

  posts.push(newPost);
  res.status(201).json(newPost);
};

const createPostComment = (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  if (!author) {
    return res.status(400).json({ message: 'Author is required' });
  }

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  const newComment: Comment = {
    id: Date.now().toString(),
    author,
    content
  };

  comments.push(newComment);
  const post = posts.find((p) => p.id === id);
  post.comments.push(newComment.id);
  res.status(201).json(newComment);
};

const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, image, description, category } = req.body;
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const post = posts[postIndex];
  const newPost = { ...post };

  if (title && title !== post.title) {
    newPost.title = title;
  }

  if (image && image !== post.image) {
    newPost.image = image;
  }

  if (description && description !== post.description) {
    newPost.description = description;
  }

  if (category && category !== post.category) {
    newPost.category = category;
  }

  posts[postIndex] = newPost;
  const updatedPost = getPostById(id);
  res.status(200).json(updatedPost);
};

const deletePost = (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const deletedPost = getPostById(id);
  posts.splice(postIndex, 1);
  res.status(200).json(deletedPost);
};

export default {
  getPosts,
  getPostsByCategory,
  getPost,
  createPost,
  createPostComment,
  updatePost,
  deletePost
};