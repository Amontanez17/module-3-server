const errorHandler = (err, req, res, next) => {
  console.log(`ERROR: `, req.method, req.originalUrl, err.message, err);
  if (!res.headersSent) {
    res.status(500).json({ message: "Server error" });
  }
};
const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: "No page found" });
};

module.exports = { errorHandler, notFoundHandler };
