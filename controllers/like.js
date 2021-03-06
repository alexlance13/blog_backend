const models = require("../database/models");

async function toggle(req, res) {
  if (!req.body.postId) {
    return res.sendStatus(400);
  }
  const id = req.body.postId;
  const post = await models.post.findById(id);
  const userId = req.session.user._id.toString();
  const isLiked = post.likes.some(el => el.owner == userId);
  if (isLiked) {
    const like = await models.like.findOneAndDelete({ owner: req.session.user._id, post: id });
    const post = await models.post.findByIdAndUpdate(id, { $pull: { likes: like._id } }, { new: true });
    console.log(`Post ${post._id} unliked`);
    res.send(like);
  } else {
    const like = await models.like.create({
      owner: req.session.user._id,
      post: id
    });
    const post = await models.post.findByIdAndUpdate(id, { $push: { likes: like } }, { new: true });
    console.log(`Post ${post._id} liked`);
    res.send(like);
  }
}

module.exports = {
  toggle
};
