import jwt from 'jsonwebtoken';

export const genToken =async (userID,isadmin) => {
    try {        const token = jwt.sign({ userID:userID, isAdmin: isadmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
};


export const genTokenFromUser = async (user) => {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};