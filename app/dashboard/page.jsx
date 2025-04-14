"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'

const Page = () => {
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setisLoggedIn(false)
            router.push('/')
        } else {
            setisLoggedIn(true)
        }
    }, [])

    return (
        <div>
            <Navbar isLoggedIn={isLoggedIn} />
            This is Dashboard
        </div>
    )
}

export default Page
