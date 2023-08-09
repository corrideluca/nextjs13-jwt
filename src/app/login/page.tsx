"use client"
import verifyResponse from '@/axios/localAuthAxios'
import { useLogin } from '@/lib/hooks/useLogin'
import axios from 'axios'
import { NextResponse } from 'next/server'
import React, { useState } from 'react'

const Page = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')


  const handleLogin = async () => {
    try {
      await axios.post("/api/auth/login", { username, password })
    } catch (error) {
      console.error(error, 'adasdas')
    }
  } 

  const handleGet = async () => {
      try {
        const response = await axios.get("/api/auth/me")
        verifyResponse(response)
    } catch (error) {
      console.error(error)
    }
  } 

  return (
    <div style={{ height: '100vh' }}>
      <div style={{flexDirection: 'column'}}>
        <input onChange={ e => setUsername(e.currentTarget.value)} placeholder='Name' />
        <input onChange={e => setPassword(e.currentTarget.value)} placeholder='Passoword' type='password' />
      </div>
      <button onClick={handleLogin} style={{ background: 'red' }}>Login</button>
      
      <button onClick={handleGet}>Get auth data</button>

    </div>

  )
}

export default Page