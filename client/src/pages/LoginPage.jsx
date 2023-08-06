/* eslint-disable react/no-unescaped-entities */
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function LoginPage () {
  const { isAuthenticated, signin, errors: loginErrors } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = handleSubmit(data => {
    signin(data)
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks')
    }
  }, [isAuthenticated])

  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center flex-col'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
        <h1 className='text-2xl font-bold'>Login</h1>
        {
          loginErrors.map((error, i) => (
            <div className='bg-red-500 p-2 text-whte rounded' key={i}>
              {error}
            </div>
          ))
        }

        <form onSubmit={onSubmit}>
          <input
            type='email'
            {...register('email', { required: true })}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='email'
          />
          {errors.email && (
            <span className='text-red-500'>This field is required</span>
          )}
          <input
            type='password'
            {...register('password', { required: true })}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='******'
          />
          {errors.password && (
            <span className='text-red-500 block'>This field is required</span>
          )}
          <button type='submit' className=''>
            Login
          </button>
        </form>
        <p className='flex gap-x-2 justify-between '>
          Don't have an account?
          <Link className='text-sky-200' to='/register'>Register</Link>
        </p>
      </div>
    </div>
  )
}
