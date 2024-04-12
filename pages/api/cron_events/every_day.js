const { default: axios } = require('axios');
const fs = require('fs')

const path = require('path');
const root = path.join(__dirname, '/../../..');

if (fs.existsSync(root + '\\.env.local')) {
    let envFile = root + '\\.env.local';
    require('dotenv').config({ path: envFile });
} else {
    let envFile = root + '\/.env.local';
    require('dotenv').config({ path: envFile });
}

(async function start() {
    try {
        const domen = process.env.DOMEN
        await axios.post(`${domen ? domen : "http://localhost:3000"}/api/admin_api/cronFunctions`, {
            type: 'daily'
        })
    } catch (error) {
        console.log(error)
    }
    process.exit()
})()