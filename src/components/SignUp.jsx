import React from 'react'
import { useState } from 'react'
import authservice, { AuthService } from '../appwrite/auth'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import {Button, Logo, Input} from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function SignUp() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState('')
    const {register, handleSubmit} = useForm()

// making a signup method 

const signUp = async(data)=>{
     setError('')
      try {
        const userData = await authservice.createAccount(data)
        if(userData){
            const userData = await authservice.getCurrentUser()
            if(userData) dispatch(login(userData));
            navigate('/')
        }
      } catch (error) {
        setError(error.message)
      }

}

  return (
    <div className='flex items-center justify-cenetr'>
    <div className={`w-full mx-auto max-w-lg bg-gray-100 
    rounded-xl p-10 border border-black/10`}>
      <div className='mb-2 flex justify-center'>
        <span className='inline-block w-full max-w-[100px]'>
        <Logo width='100%' />
        </span>
      </div>
      <h2 className='text-center text-2xl font-bold leading-tight'>
        Sign in to create a Account
      </h2>
      <p className='mt-2 text-center text-base text-black/60'>
          Already have an account? &nbsp;
          <Link to='/signUp'
          className='font-medium text-primary transition-all
          duration-200 hover:underline'>
          Sign In
          </Link>
      </p>
      {error && <p className='text-red-600 text-center'>
      {error}</p>}
      <form onSubmit={handleSubmit(create)} className='mt-8'>
        <div className='space-y-5'>
            {/* Input filed for email  */}
            <Input 
            label='Full Name:'
            placeholder='Enter your Full Name' 
            
            {...register('name',{
                required: true,
                
            })}
            />

   {/* Input for email  */}
            <Input
            label = 'Email:'
            placeholder = 'Enter your email'
            type='email'
            {...register('email',{
                required: true,
                validate:{
                    matchPattern:(value)=>/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(value)||
                    'Email addrsss must be a valid one.',
                }
            })}
            />

      {/* Input of password  */}
           <Input
           label = 'Password:'
           placeholder='Enter your Password'
           type ='password'
           {...register('Password',{
            required: true,
           })}
           />
           <Button type='submit' className='w-full'>Create Account</Button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default SignUp
