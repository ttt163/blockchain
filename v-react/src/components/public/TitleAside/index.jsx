/**
 * Author：liushaozong
 * Time：2018-01-21 21:34
 * Description：title aside
 */

import React from 'react'
import './index.scss'

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component'
const TitleAside = (WrappedComponent) => {
    return class HOC extends WrappedComponent {
        static displayName = `HOC(${getDisplayName(WrappedComponent)})`

        render() {
            const {title} = this.state
            // const {icon, title, iconStyle} = this.state
            return <div className="aside-section">
                <div className="aside-title-name clearfix">
                    {/* <img className="aside-title-icon" style={iconStyle} src={icon} alt="Icon"/> */}
                    <span className="aside-title-title">{title}</span>
                </div>
                <div className="aside-title">
                    <div className="aside-title-con">
                        {super.render()}
                    </div>
                </div>
            </div>
        }
    }
}

export default TitleAside
