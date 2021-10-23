const path = require('path')
const axios = require('axios')
const fs = require('fs')
const inquirer = require('inquirer')
const ora = require('ora');
const { travel } = require('../lib/utils')

async function release() {
    const obj = {}

    // function travel(dir, callback) {
    //     fs.readdirSync(dir).forEach((file) => {
    //         var pathname = path.join(dir, file)
    //         if (fs.statSync(pathname).isDirectory()) {
    //             travel(pathname, callback)
    //         } else if (fs.statSync(pathname).isFile()) {
    //             let doc;
    //             if (dir.includes('/img')) {
    //                 doc = fs.readFileSync(pathname, 'binary')
    //             } else {
    //                 doc = fs.readFileSync(pathname, 'utf-8')
    //             }
    //             callback(pathname.split('build')[1], doc)
    //         }
    //     })
    // }


    await travel('./build', 'build', function (key, pathname, dir) {
        let doc;
        if (dir.includes('/img')) {
            doc = fs.readFileSync(pathname, 'binary')
        } else {
            doc = fs.readFileSync(pathname, 'utf-8')
        }
        Object.assign(obj, {
            [key]: doc
        })
    })

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
    const spinner = ora('🗃 开始发布项目...').start();

    axios.post('http://localhost:3020/upload', {
        data: obj,
        version: config.version,
        project: config.project,
        time: Date.now()
    })
        .then(res => {
            let obj = res.data
            console.log()
            spinner.succeed('🎉 项目发布成功');
        }).catch(err => {
            spinner.fail()
            console.error(err,'----')
        })
}

module.exports = release;