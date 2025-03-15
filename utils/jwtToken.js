import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
    return jwt.sign( payload , process.env.JWT_SECRET , {
        expiresIn: "7d",
        issuer: "tech-frenzy"
    });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify( token , process.env.JWT_SECRET , {
            expiresIn: "3d",
            sign: "HS256",
            issuer: "tech-frenzy"
        });
    } catch (error) {
        return null;
    };
}
