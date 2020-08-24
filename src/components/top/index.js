import React, { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button, Divider, Space, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'

import Logo from '../common/logo'

const styleTop = {
  paddingTop: "3em",
  textAlign: "center",
  height: "100%"
}

const { Title } = Typography


export default function() {
  const handleCreate = useCallback( _ => {
    const roomId = uuidv4()
    const type="small"

    window.location = `./?r=${roomId}&entered=false&type=${type}`
  }, [])
  return (
    <div className="Top">
      <main>
        <div className="tower">
          <div className="container">
            <div className="top" style={styleTop}>
              <Space direction="vertical">
                <Logo desc="国産で、誰でも無料で使える安心テレカン" />
                <Button icon={<ArrowRightOutlined />} onClick={handleCreate} type="primary" shape="round" size="large">
                  create room
                </Button>
              </Space>
              <Divider />
              <div style={{ textAlign: "left"}}>
                <Title level={2}>Links</Title>
                <ul>
                  <li><a href="https://medium.com/@komasshu" target="_blank" rel="noopener noreferrer">ブログ</a></li>
                  <li><a href="https://www.facebook.com/groups/307692313780090" target="_blank" rel="noopener noreferrer">Facebookグループ</a></li>
                  <li><a href="https://github.com/kokutele/kokutele" target="_blank" rel="noopener noreferrer">Github - kokutele -</a></li>
                </ul>
              </div>
              <Divider />
              <div>
                &copy; 2020 Kokutele OSS Community.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}