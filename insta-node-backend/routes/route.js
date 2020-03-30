const controller = require('../controllers');
const corsMiddleware = require('../middlewares/cors');


module.exports=(app) => {

         app.post("/login", controller.loginSignup.checkUserAuthentication);
         app.post("/signup", controller.loginSignup.createUser);
         app.get("/users", controller.user.showAll);
         app.get("/user", controller.user.show);  
         app.put("/user/:id", controller.user.update);
         app.delete("/user/:id", controller.user.deleteAccount);
         app.put("/checkIfDuplicate", controller.user.checkIfDuplicate);
         app.patch('/api/user', corsMiddleware, controller.user.changeProfilePic);


        //  app.post("/upload", upload.single('image'), controller.posts.createNewPost); //doubt 
        //  app.get("/posts/:id",controller.post.showAll);
        //  app.get("/upload/:id",controller.post.show);
        //  app.put("/follow",controller.follow.updateFollow);
        //  app.get("/followers/:id", controller.follow.getFollowers);
        //  app.get("/following/:id", controller.follow.getFollowing);
        //  app.get("/followRelation", controller.follow.followRelation);
        //  app.put("/unfollow",controller.unfollow.updateUnfollow);
        //  app.put("/like",controller.likes.updateLike);
        //  app.post("/comment",controller.comments.addComment);


         //Will add route for post operations!!!
}

