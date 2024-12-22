import * as dotenv from "dotenv";
import app from "./app";
dotenv.config();

const PORT = process.env.PORT || 0

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => {
        process.exit(1);
    });
});
