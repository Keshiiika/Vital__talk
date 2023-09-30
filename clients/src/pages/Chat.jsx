import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Model from '../components/Model';
import { BsEmojiSmile, BsFillEmojiSmileFill } from "react-icons/bs"
import { fetchMessages, sendMessage } from '../apis/messages';
import { useEffect } from 'react';
import MessageHistory from '../components/MessageHistory';
import io from "socket.io-client"
import "./home.css"
import { fetchChats, setNotifications } from '../redux/chatsSlice';
import Loading from '../components/ui/Loading';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { getChatName } from '../utils/logics';
import Typing from '../components/ui/Typing';
import { validUser } from '../apis/auth';
const ENDPOINT = process.env.REACT_APP_SERVER_URL
let socket, selectedChatCompare;


function Chat(props) {
  const { activeChat, notifications } = useSelector((state) => state.chats)
  const dispatch = useDispatch()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPicker, setShowPicker] = useState(false);
  const activeUser = useSelector((state) => state.activeUser)

  const keyDownFunction = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && (message)) {
      setMessage("")
      socket.emit("stop typing", activeChat._id)
      const data = await sendMessage({ chatId: activeChat._id, message })
      socket.emit("new message", data)
      setMessages([...messages, data])
      dispatch(fetchChats())
    }
  }


  useEffect(() => {
    socket = io(ENDPOINT)
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))
  }, [])

  useEffect(() => {
    socket.emit("setup", activeUser)
    socket.on("connected", () => {
      setSocketConnected(true)
    })
  }, [messages, activeUser])
  useEffect(() => {
    const fetchMessagesFunc = async () => {
      if (activeChat) {
        setLoading(true)
        const data = await fetchMessages(activeChat._id)
        setMessages(data)
        socket.emit("join room", activeChat._id)
        setLoading(false)

      }
      return
    }
    fetchMessagesFunc()
    selectedChatCompare = activeChat

  }, [activeChat])
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if ((!selectedChatCompare || selectedChatCompare._id) !== newMessageRecieved.chatId._id) {
        if (!notifications.includes(newMessageRecieved)) {
          dispatch(setNotifications([newMessageRecieved, ...notifications]))
        }
      }
      else {
        setMessages([...messages, newMessageRecieved])
      }
      dispatch(fetchChats())
    })
  })
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser()
      if (!data?.user) {
        window.location.href = "/login"
      }

    }
    isValid()
  }, [])
  if (loading) {
    return <div className={props.className}>
      <Loading />
    </div>
  }
  return (
    <>
      {
        activeChat ?
          <div className={`flex flex-col justify-between ${props.className} bg-[#76effd]`}   >
            {/* thf */}
            <div>

              <div className='flex justify-between items-center px-5 bg-[#ffff] w-[100%]'>
                <div className='flex items-center gap-x-[10px]'>
                  <div className='flex flex-col items-start justify-center'>
                    <h5 className='text-[17px] text-[#2b2e33] font-bold tracking-wide'>{getChatName(activeChat, activeUser)}</h5>
                    {/* <p className='text-[11px] text-[#aabac8]'>Last seen 5 min ago</p> */}
                    
                  </div>
                </div>
                <div>
                <div>
                <div className='flex px-5 '>
                  <div className='flex px-5 py-4 ms-5'>

                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
</svg>
                  </div>
                  <div className='px-5 py-4'>

                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-camera-video" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
</svg>
                  </div>
                  <div className='px-5 py-2'>

                <Model />
                  </div>
                </div>
              </div>
                </div>
              </div>
              <div className='scrollbar-hide h-[85vh] flex flex-col overflow-y-scroll p-4'>
                <MessageHistory typing={isTyping} messages={messages} />
                <div className='ml-7 -mb-10'>
                  {
                    isTyping ?
                    <Typing width="100" height="100" /> : ""
                  }

                </div>
              </div>
            </div>
                {/* yjgh   */}
            <div className='' >
              <div className=' border-[1px] border-[#aabac8] px-1 py-3  rounded-t-[10px]' style={{width:"100%"}}>
                  {/* rdf */}
                <form onKeyDown={(e) => keyDownFunction(e)} onSubmit={(e) => e.preventDefault()}>
                  <div className='flex'>

                  {
                    showPicker && <Picker data={data} onEmojiSelect={(e) => setMessage(message + e.native)} />
                  }
                                    <div className='cursor-pointer' onClick={() => setShowPicker(!showPicker)}>

{showPicker ? <BsFillEmojiSmileFill className='mx-1 w-[20px] h-[20px] text-[#ffb02e] border-[black]' /> : <BsEmojiSmile className='w-[20px] h-[20px]' />}
</div>

                <div className='mx-1 cursor-pointer'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-ai" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2H6v-1h6a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.113 14.82.8 15.85H0l1.342-3.999h.926l1.336 3.999h-.841l-.314-1.028H1.113Zm1.178-.588-.49-1.617h-.034l-.49 1.617h1.014Zm2.425-2.382v3.999h-.791V11.85h.79Z"/>
</svg>
                  </div>
<div className='mx-1 cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-paperclip" viewBox="0 0 16 16">
  <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
</svg></div>
                {/* <button onClick={(e) => keyDownFunction(e)} className='bg-[#f8f9fa] border-[2px] border-[#d4d4d4] text-[14px] px-2 py-[3px] text-[#9e9e9e] font-medium rounded-[7px] -mt-1'>Send</button> */}
                  <input onChange={(e) => {
                    setMessage(e.target.value)
                    if (!socketConnected) return
                    if (!typing) {
                      setTyping(true)
                      socket.emit('typing', activeChat._id)
                    }
                    let lastTime = new Date().getTime()
                    var time = 3000
                    setTimeout(() => {
                      var timeNow = new Date().getTime()
                      var timeDiff = timeNow - lastTime
                      if (timeDiff >= time && typing) {
                        socket.emit("stop typing", activeChat._id)
                        setTyping(false)
                      }
                    }, time)
                  }} className='bg-[#76effd] focus:outline-0 w-[100%] bg-[#f8f9fa]' type="text" name="message" placeholder="Enter message" value={message} />
                {/* FG */}
                <div onClick={(e) => keyDownFunction(e)} >
                <div className='mx-1 cursor-pointer'><svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
</svg></div>
                </div>
                </div>
                </form>

              </div>
{/* 
              <div className='border-x-[1px] border-b-[1px] bg-[#f8f9fa] border-[#aabac8] px-6 py-3 rounded-b-[10px] h-[50px]' style={{width:"100%"}}>

              </div> */}
            </div>
          </div> :
          <div className={props.className}>
            <div className='relative' style={{ backgroundColor: '#99DBF5' }}>
              <div className='absolute top-[10vh] left-[34%] flex flex-col items-center justify-center gap-y-3'>

                <img className='w-[600px] h-[600px] rounded-[25px] ' alt="User profile" src='https://unblast.com/wp-content/uploads/2020/10/Live-Chat-Vector-Illustration.jpg' />
                <h3 className='text-[#12486B] text-[32px] font-medium tracking-wider'>Welcome <span className='text-[#191D88] text-[32px] font-bold'> {activeUser.name}</span></h3>
              </div>
            </div>
          </div>

      }
    </>
  )
}

export default Chat