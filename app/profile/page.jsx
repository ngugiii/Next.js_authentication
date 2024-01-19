import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'


const page = async() => {
  const session = await getServerSession(authOptions);
  console.log(session);
  const user = session.user
  return (
    <div className='p-14'>
        <div className="grid grid-cols-4 gap-y-4">
            <p>First Name:</p><p className='col-span-3'>{user?.firstName}</p>
            <p>Last Name:</p><p className='col-span-3'>{user?.lastName}</p>
            <p>Phone:</p><p className='col-span-3'>{user?.phone}</p>
            <p>Email:</p><p className='col-span-3'>{user?.email}</p>
        </div>
    </div>
  )
}

export default page