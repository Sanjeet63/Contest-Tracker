import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
  // Validate user with DB
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.json({ token }); // Send token to frontend
};
