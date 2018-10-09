/**
 * Author：zhoushuanglong
 * Time：2018-01-30 18:23
 * Description：footer
 */

import React, {Component} from 'react'

import './index.scss'

export default class ToTop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            top: 0
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', () => {
            let top = document.body.scrollTop || document.documentElement.scrollTop
            this.setState({top})
        })
    }

    handleClick = () => {
        let timer
        clearInterval(timer)
        timer = setInterval(() => {
            let osTop = document.documentElement.scrollTop || document.body.scrollTop
            document.documentElement.scrollTop = osTop - (osTop) / 8
            document.body.scrollTop = osTop - (osTop) / 8
            if (osTop <= 10) {
                document.documentElement.scrollTop = 0
                document.body.scrollTop = 0
                this.setState({
                    top: 0
                })
                clearInterval(timer)
            }
        }, 10)
    }

    render() {
        return <div onClick={this.handleClick} className={`to-top ${this.state.top >= 1200 && 'active'}`}>
            <span>Top</span>
        </div>
    }
}
