import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

type FormData = {
	username: string
	password: string
}

const schema = z.object({
	username: z.string(),
	password: z.string(),
})

const LoginPage = () => {
	const navigate = useNavigate()
	const { register, handleSubmit, formState } = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			username: '',
			password: '',
		},
	})

	const onSubmit = async (data: FormData) => {
		try {
			await axios.post('http://localhost:5000/login', data)
			toast.success('Login successful!')
			navigate('/dashboard')
		} catch (err) {
			toast.error('Login failed. Please try again.')
		}
	}

	const { errors } = formState

	return (
		<div className='flex flex-col items-center justify-center h-screen px-4'>
			<div className='w-full max-w-md shadow-2xl shadow-slate-700 p-10'>
				<div className='mb-8 text-xl font-bold text-center text-white'>
					Sign In
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='mb-4'>
						<label
							className='block mb-2 font-bold text-gray-200'
							htmlFor='username'>
							Username
						</label>
						<input
							{...register('username')}
							placeholder='Username'
							className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
								errors.username ? 'border-red-500' : ''
							}`}
						/>
						{errors.username && (
							<p className='mt-1 text-xs text-red-500'>
								{errors.username.message}
							</p>
						)}
					</div>
					<div className='mb-6'>
						<label
							className='block mb-2 font-bold text-gray-200'
							htmlFor='password'>
							Password
						</label>
						<input
							type='password'
							{...register('password')}
							placeholder='Password'
							className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
								errors.password ? 'border-red-500' : ''
							}`}
						/>
						{errors.password && (
							<p className='mt-1 text-xs text-red-500'>
								{errors.password.message}
							</p>
						)}
					</div>
					<button
						type='submit'
						disabled={formState.isSubmitting}
						className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'>
						Sign In
					</button>
				</form>
				<div className='mt-8 text-gray-700'>
					Don't have an account?{' '}
					<a className='text-blue-500' href='/signup'>
						Sign up now
					</a>
				</div>
			</div>
			<ToastContainer />
		</div>
	)
}

export default LoginPage
