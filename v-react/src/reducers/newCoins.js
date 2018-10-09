/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login info
 */

import {NEWCOINS, NEWCOINSDETAILS} from '../constants/index'

const newCoinsData = {
    code: 1,
    msg: 'ok',
    obj: {
        currentPage: 1,
        inforList: [
            {
                assignment: '',
                chainType: '',
                coinSupply: '',
                country: '',
                description: '',
                detailUrl: '',
                distribution: '',
                endTime: '',
                icoCoin: '',
                icoRatio: '',
                id: '',
                img: '',
                jurisdiction: '',
                legalForm: '',
                name: '',
                platform: '',
                raised: '',
                securityAudit: '',
                startTime: '',
                status: '',
                supply: '',
                symbol: ''
            }
        ],
        pageCount: 1,
        pageSize: 30,
        recordCount: 30
    }
}

const newCoinsDetails = {
    img: 'Loading',
    name: 'Loading',
    // startTime: 'Loading',
    // endTime: 'Loading',
    symbol: 'Loading',
    raised: 'Loading',
    legalForm: 'Loading',
    chainType: 'Loading',
    jurisdiction: 'Loading',
    securityAudit: 'Loading',
    assignment: 'Loading',
    icoCoin: 'Loading',
    icoTeamList: [
        {
            icoId: '',
            id: '',
            name: '',
            url: ''
        }
    ],
    icoLinkList: [
        {
            icoId: '',
            id: '',
            name: '',
            url: ''
        }
    ],
    icoPriceList: [
        {
            icoId: '',
            id: '',
            name: '',
            url: ''
        }
    ]
}

// 打新币
export const newCoinsReducer = (state = newCoinsData, action) => {
    switch (action.type) {
        case NEWCOINS:
            return action.data
        default:
            return state
    }
}

export const newCoinsDetailsReducer = (state = newCoinsDetails, action) => {
    switch (action.type) {
        case NEWCOINSDETAILS:
            return action.data.obj
        default:
            return state
    }
}
