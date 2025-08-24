import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router'
import HighLightText from '../components/HighLightText'
import Button from '../components/Button'
import section1Vid from "../assets/section-1-vid.mp4"

const Home = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 items-center text-white max-w-[1080px] justify-between'>

        <Link to='/signup'>
           <div className='group mt-16 p-1 mx-auto rounded-full bg-gray-800 font-bold text-white transition-all duration-200 hover:scale-95 w-fit'>
            <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-black'>
              <p>Become an Instructor</p>
              <FaArrowRight/>
            </div>
           </div>
        </Link>

        <div className='text-center text-3xl mt-6 font-semibold'>
          Empower Your Future with
          <HighLightText text={"Coding Skills"}/>
        </div>

        <div className='mt-4 w-[90%] text-center text-lg font-bold text-gray-600'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world and get access to wealth of resources, including hands on projects,quizzes, and personalized feedback from instructors.
        </div>

        <div className='flex flex-row gap-7 mt-8'>
          <Button active={true} linkto={'/signup'}>
            Learn More
          </Button>
          <Button active={false} linkto={'/login'}>
            Book a Demo
          </Button>
        </div>

        <div className='mx-3 my-12 shadow-blue-200'>
          <video muted loop autoPlay>
            <source src={section1Vid} type='video/mp4'/>
          </video>
        </div>
      </div>


      {/* Section 2 */}
      {/* Section 3 */}
      {/* Section 4 */}
    </div>
  )
}

export default Home