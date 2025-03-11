import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

export default (app) => {
    app.use(cors({
        origin: [
            "http://localhost",
            "http://localhost:3000",
        ],
        credentials: true,
        optionsSuccessStatus: 200,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Content-Type", "Authorization","X-Client-App"],
        exposedHeaders: ["Content-Length", "X-Knowledge-Base"],
        preflightContinue: false,
    }));

    /*
    
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrcAttr: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", process.env.DOMAIN ],
            }
        },
        frameguard: { action: "deny" },
        hsts: process.env.NODE_ENV === "production" ? { 
            maxAge: 31536000, 
            includeSubDomains: true, 
            preload: true 
        } : false,
        xssFilter: true,
        noSniff: true,
        hidePoweredBy: true,
        referrerPolicy: { policy: "no-referrer" }
    }));

    */
};
