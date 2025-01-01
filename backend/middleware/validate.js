
function validator(validateFunc) {
  return (req, res, next) => {
    const { error } = validateFunc(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    next()
  }
}

export default validator
