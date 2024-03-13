require('dotenv').config();
const express = require("express");
const app = express();
const PORT = 5000;
const path = require('path');
const mongoose = require('mongoose');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/blog").then(() => {
    console.log('connected to db');
})

const blogSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    blog: {
        type: String,
        required: true,
        trim: true
    },
    class: {
        type: String,
        required: true,
        trim: true
    }
})

const Blog = mongoose.model('Blog', blogSchema);



app.get("/", async (req, res) => {
    let blogs = await Blog.find()
    res.render("blogs", { blogs })
})


app.post("/postblog", async (req, res) => {
    console.log(req.body);
    const { name, blog, } = req.body;

    const newblog = await Blog.create({
        name,
        blog,
        class: req.body.class
    })

    newblog.save();
    res.redirect('/');
})

app.get('/delete/:id', async (req, res) => {
    let blogId = req.params.id;
    console.log(blogId)
    await Blog.deleteOne({ _id: blogId })
    console.log('deleted');
    res.redirect('/');
})

app.get("/update/:blogId", async (req, res) => {
    let _id = req.params.blogId
    let updateBlog = await Blog.findOne({ _id })

    res.render("updateblog", {
        updateBlog
    })

})

app.post("/updateblog", async (req, res) => {
    // console.log(req.body);
    const { name, Class, blog, _id } = req.body
    const newObj = {
        name,
        Class,
        blog,
    }

    await Blog.updateOne({ _id }, newObj)

    res.redirect("/getblogs")
})

app.listen(process.env.PORT, () => console.log("Server running on port " + PORT));