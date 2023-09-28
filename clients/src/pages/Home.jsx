import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchUsers, validUser } from '../apis/auth'
import { setActiveUser } from '../redux/activeUserSlice'
import { RiNotificationBadgeFill } from "react-icons/ri"
import { BsSearch } from "react-icons/bs"
import { BiNotification } from "react-icons/bi"
import { IoIosArrowDown } from "react-icons/io"
import { setShowNotifications, setShowProfile } from '../redux/profileSlice'
import Chat from './Chat'
import Profile from "../components/Profile"
import { acessCreate } from "../apis/chat.js"
import "./home.css"
import { fetchChats, setNotifications } from '../redux/chatsSlice'
import { getSender } from '../utils/logics'
import { setActiveChat } from '../redux/chatsSlice'
import Group from '../components/Group'
import Contacts from '../components/Contacts'
import { Effect } from "react-notification-badge"
// import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';
import NotificationBadge from 'react-notification-badge';
import Search from '../components/group/Search'

function Home() {
  const dispatch = useDispatch()
  const { showProfile, showNotifications } = useSelector((state) => state.profile)
  const { notifications } = useSelector((state) => state.chats)
  const { activeUser } = useSelector((state) => state)
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [tapsearch , setTapsearch] = useState(false)
  const handleSearch = async (e) => {
    setSearch(e.target.value)
  }
  const handleClick = async (e) => {
    await acessCreate({ userId: e._id })
    dispatch(fetchChats())
    setSearch("")
  }
  useEffect(() => {
    const searchChange = async () => {
      setIsLoading(true)
      const { data } = await searchUsers(search)
      setSearchResults(data)
      setIsLoading(false)
    }
    searchChange()
  }, [search])
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser()

      const user = {
        id: data?.user?._id,
        email: data?.user?.email,
        profilePic: data?.user?.profilePic,
        bio: data?.user?.bio,
        name: data?.user?.name
      }
      dispatch(setActiveUser(user))
    }
    isValid()

  }, [dispatch, activeUser])


  return (
    <>

      <div className="">
        <div className='flex'>
          {
            !showProfile ?
            <div className="md:flex md:flex-col  h-[100vh] md:h-[98.6vh] bg-[#ffff] relative">           
                <div className='h-[61px] px-4'>
                  <div className='flex'>
                    <a className='flex items-center relative  -top-4 block h-[90px]' href='/'>

                      <h3 className='text-[20px] text-[#1f2228] font-body font-extrabold tracking-wider'>VT</h3>
                    </a>
                  </div>
                  <div className='absolute top-4 right-5 flex items-center gap-x-3'>                    
                  </div>
                </div>

                <div>

                  <div className='-mt-6 relative pt-6 px-4'>
                    { tapsearch && 
                    <form onSubmit={(e) => e.preventDefault()}>

                    {/* iyhkjyh */}
                      <input onChange={handleSearch} className='w-[99.5%] bg-[#f6f6f6] text-[#111b21] tracking-wider pl-9 py-[8px] rounded-[9px] outline-0' type="text" name="search" placeholder="Search" />

                    </form>
}
                    <div className='' onClick={() => setTapsearch( item => !item )}>
                      <div style={{ color: "#616c76", height: "14px", width: "14px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                      </div>
                    </div>
                    <Group />

                    <div style={{ display: search ? "" : "none" }} className='h-[100vh] absolute z-10 w-[100%] left-[0px] top-[70px] bg-[#fff] flex flex-col gap-y-3 pt-3 px-4'>
                      <Search searchResults={searchResults} isLoading={isLoading} handleClick={handleClick} search={search} />

                    </div>
                  </div>


                  <Contacts />
          <button onClick={() => dispatch(setShowProfile(true))} className='flex items-center gap-x-1 relative'>
                      {/* <img className='w-[28px] h-[28px] rounded-[25px]'  alt="" /> */}
                      <img 
                      className='w-12 h-12  sm:w-12 sm:h-12 rounded-[30px] shadow-lg object-cover' 
                      src={activeUser?.profilePic}
                      alt="" 
                                       />

                    </button>


                </div>


              </div> : <Profile className="min-w-[100%] sm:min-w-[360px] h-[100vh] bg-[#fafafa] shodow-xl relative" />
          }
          {/* <div style={{border:"1px solid black"}}> */}

          <Chat className="chat-page relative lg:w-[100%] h-[100vh] bg-[#fafafa]" />
          {/* </div> */}

          <div></div>


        </div>
      </div >

    </>
  )
}

export default Home