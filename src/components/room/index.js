import React, {useState, useEffect} from 'react'
import { Alert, Space } from 'antd'

import Logo from '../common/logo'
import ConnectVideo from './connect-video'
import Enter from './enter'
import VideoRoom from './video-room'

const styleRoom = {
  position: "relative",
  paddingTop: "3em",
  textAlign: "center",
  height: "calc(100vh - 32px)",
}

const descs = {
  "IDLE": "まず、ビデオカメラに接続しよう",
  "CONNECTED": "名前を入力してビデオルームに入ろう",
  "ENTERED": "@@@"
}

export default function Room( props ) {
  const [state, changeState] = useState("IDLE")
  const [mesg, setMessage] = useState('')
  const [_localStream, setLocalStream ] = useState( null )
  const [_userName, setUserName ] = useState( '' )

  useEffect( _ => {
    if( state === "CONNECTED" && !_localStream ) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 720, height: 480}, audio: true })
        .then( stream => {
          console.log( stream )
          setLocalStream( stream )
        })
        .catch( err => setMessage(err.message) )
    } 
  }, [state, _localStream])

  return (
    <div className="Room">
      <main>
        <div className="tower">
          <div className="container">
            <div style={styleRoom}>
              <Space direction="vertical">
                { state === "IDLE" && (
                  <div>
                    <Logo desc={descs[state]} />
                    <ConnectVideo onClick={ e=> {changeState("CONNECTED")}}/>
                  </div>
                )}
                { state === "CONNECTED" && (
                  <div>
                    <Logo desc={descs[state]} />
                    { !!mesg && (
                      <Alert mesg={mesg} />
                    )}
                    <Enter stream={_localStream} onFinish={e => {
                      console.log(e)
                      setUserName(e.username)
                      changeState('ENTERED')
                    }} onError={setMessage} />
                  </div>
                )}
                { state === "ENTERED" && (
                  <VideoRoom localStream={_localStream} userName={_userName} roomId={props.roomId} type={props.type} />
                )}
              </Space>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}