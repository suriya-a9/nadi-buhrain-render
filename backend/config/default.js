require('dotenv').config();

const config = {
    port: process.env.PORT,
    url: process.env.URL,
    node_env: process.env.NODE_ENV,
    jwt: process.env.JWT_SECRET
}
module.exports = config;