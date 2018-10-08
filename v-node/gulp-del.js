/**
 * Author：zhoushuanglong
 * Time：2018-04-09 22:41
 * Description：gulp-str-replace
 */

const through = require('through-gulp')

const del = (fn) => {
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
            const fileContent = file.contents.toString('utf-8')

            if (fn) {
                let fileArr = []
                for (let key in JSON.parse(fileContent)) {
                    fileArr.push(`public/css/${key}`)
                    fileArr.push(`public/css/${key}.map`)
                    fileArr.push(`public/js/${key}`)
                    fileArr.push(`public/img/${key}`)
                }
                fn(fileArr)
            }

            file.contents = new Buffer(fileContent, 'utf-8')
        }

        this.push(file)
        callback()
    }, function (callback) {
        callback()
    })

    return stream
}

module.exports = del
