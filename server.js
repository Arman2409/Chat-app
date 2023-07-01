import express from "express";

const app = new express();

app.get("/", (req, res) => {
    res.json("Server running succesfully");
});

app.listen(3005, () => {
    console.log("server running"); 
})