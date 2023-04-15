import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type FormData = {
	email: string
	username: string
	password: string
	confirm_password: string
}

const schema = z
	.object({
		email: z.string().email(),
		username: z.string(),
		password: z.string().min(8),
		confirm_password: z.string().min(8),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: 'Passwords do not match',
		path: ['confirm_password'],
	})

const SignupPage = () => {
	const { register, handleSubmit, formState } = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			username: '',
			password: '',
			confirm_password: '',
		},
	})

	const onSubmit = async (data: FormData) => {
		try {
			await axios.post('http://localhost:5000/signup', data)
			toast.success('Signup successful!')
		} catch (err) {
			toast.error('Signup failed. Please try again.')
		}
	}

	const { errors } = formState

	return (
		<div className='flex flex-col items-center justify-center h-screen px-4'>
			<div className='w-full max-w-md shadow-2xl shadow-slate-700 p-10'>
				<div className='mb-8 text-xl font-bold text-center text-white'>
					Sign Up
				</div>
				<form
					className='flex flex-col max-w-md gap-4 mx-auto'
					onSubmit={handleSubmit(onSubmit)}>
					<div>
						<input
							{...register('email')}
							placeholder='Email'
							className={`border p-2 rounded-md w-full ${
								errors.email ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						{errors.email && (
							<span className='text-red-500'>{errors.email.message}</span>
						)}
					</div>

					<div>
						<input
							{...register('username')}
							placeholder='Username'
							className={`border p-2 rounded-md w-full ${
								errors.username ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						{errors.username && (
							<span className='text-red-500'>{errors.username.message}</span>
						)}
					</div>

					<div>
						<input
							type='password'
							{...register('password')}
							placeholder='Password'
							className={`border p-2 rounded-md w-full ${
								errors.password ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						{errors.password && (
							<span className='text-red-500'>{errors.password.message}</span>
						)}
					</div>

					<div>
						<input
							type='password'
							{...register('confirm_password')}
							placeholder='Confirm Password'
							className={`border p-2 rounded-md w-full ${
								errors.confirm_password ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						{errors.confirm_password && (
							<span className='text-red-500'>
								{errors.confirm_password.message}
							</span>
						)}
					</div>

					<button
						type='submit'
						disabled={formState.isSubmitting}
						className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'>
						Submit
					</button>

					<ToastContainer />
				</form>
				<div className='mt-8 text-gray-600'>
					Do have an account?{' '}
					<a className='text-blue-500' href='/login'>
						Sign in
					</a>
				</div>
			</div>
		</div>
	)
}

export default SignupPage
