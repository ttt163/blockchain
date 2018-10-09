/**
 * Author：zhoushuanglong
 * Time：2018-01-20 21:34
 * Description：Header nav
 */

import React, {Component} from 'react'
import {Link} from 'react-router'
import './index.scss'
import {FormattedMessage} from 'react-intl'
import {urlPath} from '../../../public/index'

class InfoHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0
        }

        this.tabData = [
            {path: `/projectProjectmaterial?coinid=${this.props.coinid}`, id: 'project.data'},
            // {path: '/projectInfo', id: 'project.info'},
            // {path: '/projectProjectmaterial', id: 'project.grade'},
            {path: `/projectRelatenews?coinid=${this.props.coinid}`, id: 'title.correlation'}
        ]
    }

    handleClick(index) {
        this.setState({
            index: index
        })
    }

    render() {
        return <div className="project-info-head">
            <div className="info-head">
                {this.tabData.map((item, index) => {
                    const path = urlPath()
                    let classStr = ''

                    if (path.indexOf('Projectmaterial') === -1 && path.indexOf('Relatenews') === -1) {
                        if (index === 0) {
                            classStr = 'active'
                        }
                    } else {
                        if (index === 0 && path.indexOf('Projectmaterial') > -1) {
                            classStr = 'active'
                        }

                        if (index === 1 && path.indexOf('Relatenews') > -1) {
                            classStr = 'active'
                        }
                    }

                    return <Link
                        to={item.path} key={index} index={index}
                        className={classStr}
                        onClick={() => this.handleClick(index)}>
                        <FormattedMessage id={item.id}/>
                    </Link>
                })}
            </div>
        </div>
    }
}

export default InfoHeader
