/**
 * Author：zhoushuanglong
 * Time：2018-03-04 00:39
 * Description：radio group
 */

import React, {Component} from 'react'
import {object, string, oneOfType, number, bool, func, node} from 'prop-types'

class Radio extends Component {
    render() {
        const {name, selectedValue, onChange} = this.context.radioGroup
        const {children, disabled} = this.props
        const optional = {}
        if (selectedValue !== undefined) {
            optional.checked = (this.props.value === selectedValue)
        }
        if (disabled !== undefined) {
            optional.disabled = (this.props.disabled === disabled)
        }
        if (typeof onChange === 'function') {
            optional.onChange = onChange.bind(null, this.props.value)
        }

        return (
            <div className="edit-radio">
                <input type="radio" name={name} {...optional} className="radio-input"/>
                <i className="box"/>{children}
            </div>
        )
    }
}

Radio.contextTypes = {
    radioGroup: object
}

class RadioGroup extends Component {
    static defaultProps = {
        Component: 'div'
    }

    getChildContext() {
        const {name, selectedValue, onChange} = this.props
        return {
            radioGroup: {
                name, selectedValue, onChange
            }
        }
    }

    render() {
        const {Component, name, selectedValue, onChange, children, ...rest} = this.props
        return (<Component {...rest}>{children}</Component>)
    }
}

RadioGroup.childContextTypes = {
    radioGroup: object
}

RadioGroup.propTypes = {
    name: string,
    selectedValue: oneOfType([
        string,
        number,
        bool
    ]),
    onChange: func,
    children: node.isRequired,
    Component: oneOfType([
        string,
        func,
        object
    ])
}

export {RadioGroup, Radio}
