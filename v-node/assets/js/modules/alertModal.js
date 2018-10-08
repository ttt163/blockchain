/**
 * Author：tantingting
 * Time：2018/5/16
 * Description：Description
 */

// 提示弹窗
class Alert {
    constructor () {
        this.modal = $('#alertWarp')
        this.content = ''
        this.time = 2000
    }

    showModal (content) {
        this.modal.find('.alert-contain').html(content)
        this.modal.css({'display': 'block'})
    }

    hideModal () {
        this.modal.find('.alert-contain').empty()
        this.modal.css({'display': 'none'})
    }

    msg (content, time, callBack) {
        this.content = content
        if (time) {
            this.time = time
        }
        this.showModal(content)
        time = !time ? this.time : time
        setTimeout(() => {
            this.hideModal()
            if (callBack) {
                callBack()
            }
        }, time)
    }
}

export {
    Alert
}
