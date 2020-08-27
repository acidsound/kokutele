import React, { useEffect, useRef } from 'react'

import './rtc-video.css'

// fixup vendor prefix
window.AudioContext = window.AudioContext||window.webkitAudioContext;

export default function(props) {
  const _video = useRef()
  const _wrapper = useRef()
  const _canvas = useRef()
  const _requestId = useRef()
  let _finished = false
  const { stream, width, showAudioWave, type, muted, thumbnail, userName } = props

  useEffect( _ => {
    if( _canvas && _wrapper && stream ) {
      const ctx = _canvas.current.getContext('2d')
        , w = _wrapper.current.offsetWidth
        , h = _wrapper.current.offsetHeight
        , x0 = 0
        , y0 = Math.floor(h / 2)
        , aCtx = new AudioContext()
        , aSource = aCtx.createMediaStreamSource( stream )
        , aGain = aCtx.createGain()
        , analyser = aCtx.createAnalyser()
        , timesArr = []
      _canvas.current.width = w
      _canvas.current.height = h

      aSource.connect(analyser)
      analyser.connect(aGain)
      aGain.connect( aCtx.destination )
      analyser.fftSize = 2048;  // The default value

      aGain.gain.setValueAtTime(0, aCtx.currentTime)

      const _draw = _ => {
        if( true ) {
          const times = new Uint8Array(analyser.fftSize);
          const d = w / times.length

          analyser.getByteTimeDomainData(times);
          timesArr.push(times)
          if( timesArr.length > 25) timesArr.shift()

          ctx.clearRect(0, 0, w, h)

          timesArr.forEach( (times, idx ) => {
            const alpha = 1 / (timesArr.length / idx )
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 139, 139, ${alpha})`//'#008b8b'
            ctx.moveTo(x0, y0)
            for( let i = 0; i < times.length; i++) {
              const _x = x0 + d * i
              const _y = y0 + (times[i] - 128)
              ctx.lineTo(_x, _y)
            }
            ctx.stroke()
          })

          ctx.fillText(userName || '名無しさん', Math.ceil( w / 2 ), Math.ceil(0.9 * h), w);
        }

        _requestId.current = requestAnimationFrame(_draw)
      }

      ctx.fillStyle = '#fff'
      ctx.font = "1em 'ＭＳ ゴシック'";
      ctx.textBaseline='bottom'
      ctx.textAlign='center'
      //ctx.strokeStyle = '#f0e68c'
      _draw()
    }
    return function clean() {
      window.cancelAnimationFrame(_requestId.current)
    }
  }, [stream, _canvas, _wrapper, _finished, userName])

  useEffect( _ => {
    if( stream ) {
      _video.current.srcObject = stream
    }
  }, [_video, stream])
  const _show = showAudioWave === undefined ? false : showAudioWave
  const display = _show ? "none" : "block"

  return (
    <div className="RTCVideo">
      <div className="video-ratio-wrapper" ref={e => _wrapper.current = e} style={{ width }}>
        <canvas ref={e => _canvas.current = e} width="100%" height="100%"></canvas>
        { type!=="audio" ? (
          <video ref={e => _video.current = e} style={{ display }} muted={!!muted} autoPlay playsInline />
        ):(
          <div>
            <audio ref={e => _video.current = e} style={{ display }} muted={!!muted} autoPlay playsInline />
          </div>
        )}
        { thumbnail !=='' && (
          <div>
            <img src={thumbnail} alt="thumbnail" />
          </div>
        )}
      </div>
    </div>
  )
}