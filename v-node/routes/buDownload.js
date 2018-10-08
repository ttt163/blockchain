/**
 * @Author：zhoushuanglong
 * @Time：2018-08-13 17:23
 * @Desc：bu download
 */

const express = require('express')
const router = express.Router()

const {
    pageRender,
    getHost
} = require('../utils/public')

router.get('/', function (req, res, next) {
    pageRender({
        req: req,
        res: res,
        redirect: true,
        mRender: function () {
            res.render('m-buDownload', {
                webSiteInfo: {
                    title: '火星币优-你的数字货币管家',
                    keywords: '火星币优,交易挖矿,比特币,以太坊,Coinex,Fcoin,Coinbig,Coinpark,BTC,EOS,ETH',
                    description: '火星币优一款免费的区块链资产行情查看，免费交易挖矿工具'
                }
            })
        },
        pcRender: function () {
            res.render('buDownload', {
                domain: getHost(req),
                typeClass: 'buDownload',
                webSiteInfo: {
                    title: '火星币优-你的数字货币管家',
                    keywords: '火星币优,交易挖矿,比特币,以太坊,Coinex,Fcoin,Coinbig,Coinpark,BTC,EOS,ETH',
                    description: '火星币优一款免费的区块链资产行情查看，免费交易挖矿工具'
                }
            })
        }
    })
})

module.exports = router
