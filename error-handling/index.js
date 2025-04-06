module.exports = (app) => {
  app.use((req, res, next) => {
    res.status(404).json({ message: "This route does not exist" });
  });

  app.use((err, req, res, next) => {
    console.error("ERROR", req.method, req.path, err);
    if(err.message.includes("Email is already in use")){
      return res.status(409).json({ error: "Internal Server Error" })
    }
    if(err.message.includes("Email not verified")){
      return res.status(401).json({ error: "Email not verified" });
    }
    if (err.message.includes("Database Error")) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!res.headersSent) {
      res.status(400).json({ error: err.message });
    }

    res
      .status(500)
      .json({ message: "Internal server error. Check server console" });
  });
};
