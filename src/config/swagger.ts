import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";
import { config } from "./server_config";

const router = Router();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Sales System API Documentation",
            version: "1.0.0",
            description: "API documentation for the Sales-oriented System",
            contact: {
                name: "Vishal Panchal",
                email: "vishal65.p@gmail.com",
            },
        },
        servers: [
            {
                url: `http://localhost:${config.PORT}`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/docs/**/*.ts", "./src/routes/**/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default router;
