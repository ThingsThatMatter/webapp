import React from 'react'

import {Spin} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'


function Spinner() {

const logo = <LoadingOutlined style={{ fontSize: 70, color: "#355c7d" }} spin/>

    return (
        <div className="spinner">
            <Spin
                size="large"
                indicator={logo}
            />
        </div>         
    )
}

export default Spinner