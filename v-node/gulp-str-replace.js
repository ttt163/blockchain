/**
 * Author：zhoushuanglong
 * Time：2018-04-09 22:41
 * Description：gulp-str-replace
 */

const through = require('through-gulp')

const removeEmptyArrayEle = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === undefined || arr[i] === '') {
            arr.splice(i, 1)
            i = i - 1
        }
    }
    return arr
}

const replace = (obj) => {
    const stream = through(function (file, encoding, callback) {
        if (file.isNull()) {
            this.push(file)
            return callback()
        }

        if (file.isStream()) {
            this.emit('error')
            return callback()
        }

        if (file.isBuffer()) {
            // 替换manifest已添加hash的文件名
            // const manifest = JSON.parse(file.contents.toString('utf-8'))
            // let newManifest = {}
            // for (let key in manifest) {
            //     const value = manifest[key]
            //     const pointArr = value.split('.')
            //     const fileSuffix = pointArr[pointArr.length - 1]
            //     const lineArr = value.split('-')
            //     let fileName = ''
            //     for (let key in lineArr) {
            //         if (parseInt(key) < lineArr.length - 1) {
            //             if (parseInt(key) === 0) {
            //                 fileName += lineArr[key]
            //             } else {
            //                 fileName += `-${lineArr[key]}`
            //             }
            //         }
            //     }
            //     newManifest[key] = `${fileName}.${fileSuffix}`
            // }
            // file.contents = new Buffer(JSON.stringify(newManifest), 'utf-8')

            const fileContent = file.contents.toString('utf-8')
            let newFileContents = fileContent
            if (obj) {
                for (let key in obj) {
                    newFileContents = removeEmptyArrayEle(newFileContents.split(key)).join(obj[key])
                    // newFileContents = newFileContents.replace(new RegExp(key, 'gm'), obj[key])
                }
            } else {
                newFileContents = fileContent
            }

            file.contents = new Buffer(newFileContents, 'utf-8')
        }

        this.push(file)
        callback()
    }, function (callback) {
        callback()
    })

    return stream
}

module.exports = replace
