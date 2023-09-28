import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveChat, fetchChats } from '../redux/chatsSlice'
import { useEffect } from 'react'
import { getChatName, getChatPhoto, timeSince } from '../utils/logics'
import NoContacts from './ui/NoContacts'
// import SkeletonLoading from './ui/SkeletonLoading'
var aDay = 24 * 60 * 60 * 1000;
function Contacts() {
  const { chats, activeChat } = useSelector((state) => state.chats)
  const dispatch = useDispatch()
  const activeUser = useSelector((state) => state.activeUser)

  const  temp = chats?.length > 0 ? chats?.map((e) =>  getChatName(e,activeUser) ) : {}
  const temp1 = {}
  for(var i = 0 ; i<temp.length ; i++ )
  {
    temp1[temp[i]] = false 
  }
  console.log(temp1)
  const [ showContact,setShowContact ] = React.useState(temp1)

  useEffect(() => {
    dispatch(fetchChats())
  }, [dispatch])
  return (
    <>
      <div className='flex flex-col -space-y-1 overflow-y-scroll scrollbar-hide h-[87vh] pb-10'>
        {
          chats?.length > 0 ? chats?.map((e) => {
            console.log(getChatName(e,activeUser))
            return (
              <div onClick={() => {
                dispatch(setActiveChat(e))
              }} key={e._id} className={`flex items-center justify-between sm:gap-x-1 md:gap-x-1 mt-5 ${activeChat._id === e._id ? "bg-[#fafafa]" : "bg-[#fff]"} cursor-pointer  py-4 px-2`}>
                <div className='flex items-center gap-x-3 sm:gap-x-1 md:gap-x-3'>
                  <img 
                      className='w-12 h-12  sm:w-12 sm:h-12 rounded-[30px] shadow-lg object-cover' 
                      src={getChatPhoto(e, activeUser)} 
                      alt="" 
                      onMouseEnter={ () => setShowContact( item => {const temp = { ...item  } ; const x = getChatName(e,activeUser) ;temp[x] = true; console.log(temp);return temp} ) }
                      onMouseLeave={ () => setShowContact( item => {const temp = { ...item  } ; const x = getChatName(e,activeUser) ;temp[x] = false; console.log(temp);return temp} ) } 
                  />
                  { showContact[getChatName(e,activeUser)] && <div>
                    <h5 className='text-[13.6px] sm:text-[16px] text-[#2b2e33] font-bold'>{getChatName(e, activeUser)}</h5>
                    <h6 
                        className='text-[13.6px] sm:text-[13.5px] font-medium text-[#56585c] '>  {e.latestMessage?.message.length > getChatName(e,activeUser).length+5
                      ? e.latestMessage?.message.slice(0, getChatName(e,activeUser).length+5) + "..."
                      : e.latestMessage?.message
                    }</h6>
                  </div>}
                </div>
                </div> 

            )
          }) : <NoContacts />
        }
      </div>

    </>
  )
}

export default Contacts