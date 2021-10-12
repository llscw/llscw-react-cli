const axios = require('axios')
const inquirer = require('inquirer')

async function rollback() {
    async function setTemplateMsg() {
        return await inquirer.prompt([
            {
                name: 'project',
                type: 'input',
                message: '项目名称',
                default: 'llscw'
            },
            {
                name: 'version',
                type: 'input',
                message: '版本号',
                default: '0.0.1'
            }
        ])
    }

    const config = await setTemplateMsg()

    axios.post('http://localhost:3020/rollback', {
        version: config.version,
        project: config.project,
        time: Date.now()
    })
    .then(res => {
        let obj = res.data
        console.log(obj)
    }).catch(err => {
        console.log(err,'----')
    })
}

module.exports = rollback