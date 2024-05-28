import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {Button, Input, Logo} from './index'
import authservice, { AuthService } from '../appwrite/auth'
import { useDispatch } from 'react-redux'
import {useForm} from 'react-hook-form'


function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState();

    const login = async(data)=>{
        setError('')
        try {
            const session = await authservice.login(data)
            if(session){
                const userData = await authservice.getCurrentUser()
                if(userData) dispatch(authLogin(userData))
                navigate('/')    
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className='flex items-center justify-center w-full'>
    <div className={`mx-auto w-full max-w-lg bg-gray-500
    rounded-xl p-10 border border-black/10 `}>
      <div className='mb-2 flex justify-center'>
        <span className='inline-block w-full max-w-[100px]'>
         <Logo width='100%'/>
        </span>
      </div>
      <h2 className='text-center text-2xl font-bold leading-tight'>
        Sign in to your Account
      </h2>
      <p className='mt-2 text-center text-base text-black/60'>
          Don&apos;t have an account? &nbsp;
          <Link to='/signUp'
          className='font-medium text-primary transition-all
          duration-200 hover:underline'>
          Sign Up
          </Link>
      </p>
      {error && <p className='text-red-600 mt-8 text-center'>
        {error}</p>}

    <form onSubmit={handleSubmit(login)} className='mt-8'>
      <div className='space-y-5'>

        {/* Input field for email  */}

       <Input
       label='Email:'
       placeholder='Enter your email'
       type='email'
       {...register('email',{
        required: true,
        validate: {
            matchPattern: (value)=>/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(value)||
            'Email address must be a valid one.',
        }
       })}
       />

       {/* Input field for password */}

       <Input
       label='Password:'
       placeholder='Enter your Password'
       type='password'
       {...register('password',{
        required: true,
       })}
       
       />
        <Button type='submit' className='w-full'>Sign In</Button>
      </div>
    </form>
    </div>
    </div>
  )
}

export default Login
