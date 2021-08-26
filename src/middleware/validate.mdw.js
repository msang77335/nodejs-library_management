module.exports = function (schema) {
   return function validate(req, res, next) {
      const valid = new schema(req.body);
      const error = valid.validateSync();
      if (error) {
         return res.status(400).json(error);
      }
      next();
   };
};
