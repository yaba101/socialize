import { useState } from 'react'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface FormData {
	content: string
	approve: boolean
	image?: File
}

export async function createPost(formData: FormData) {
	try {
		const response = await axios.post('/api/posts', formData)
		if (response.status === 201) {
			return response.data
		} else {
			throw new Error('Server error')
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}

const schema = z.object({
	content: z.string().min(10),
	approve: z.boolean(),
	image: z.any().optional(),
})

const initialState: FormData = {
	content: '',
	approve: false,
	image: undefined,
}

type CreatePostModalProps = {
	onClose: () => void
}

const PostModal = ({ onClose }: CreatePostModalProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<FormData>({ resolver: zodResolver(schema) })

	const [formData, setFormData] = useState(initialState)
	const [error, setError] = useState<Error | null>(null)

	const { mutateAsync, isLoading } = useMutation(createPost, {
		onSuccess: () => {
			onClose()
		},
	})

	const handleDrop = (event: React.DragEvent<HTMLInputElement>) => {
		event.preventDefault()
		if (!event.dataTransfer.files.length) {
			return
		}
		const imageFile = event.dataTransfer.files[0]
		if (!imageFile.type.startsWith('image/')) {
			setError(new Error('Please select an image file (JPG, PNG, or GIF)'))
			return
		}
		// Read the dropped file using FileReader
		const reader = new FileReader()
		reader.readAsDataURL(imageFile)
		reader.onloadend = () => {
			setFormData((prevState) => ({
				...prevState,
				image: imageFile,
				imageUrl: reader.result as string,
			}))
		}
	}

	const onSubmit = async (data: FormData) => {
		setError(null)
		try {
			await mutateAsync(data)
		} catch (error) {
			if (error instanceof Error) {
				setError(error)
				setTimeout(() => {
					setError(null)
				}, 3000)
			}
		}
	}

	return (
		<div className='fixed inset-0 z-10 overflow-y-auto'>
			<div className='flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
				<div className='fixed inset-0 transition-opacity' aria-hidden='true'>
					<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
				</div>
				<span
					className='hidden sm:inline-block sm:align-middle sm:h-screen'
					aria-hidden='true'>
					&#8203;
				</span>
				<div className='inline-block overflow-hidden text-left align-bottom transition-all transform rounded-lg shadow-xl bg-slate-950 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
					<div className='px-4 pt-5 pb-4 bg-slate-950 sm:p-6 sm:pb-4'>
						<div className='sm:flex sm:items-start'>
							<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
								<h3 className='text-lg font-medium leading-6 text-gray-100'>
									Create Post
								</h3>
								<div className='mt-2'>
									<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
										<div className='p-4'>
											<label
												htmlFor='content'
												className='block mb-1 text-gray-100'>
												Content
											</label>
											<textarea
												id='content'
												{...register('content', {
													required: 'Required field.',
												})}
												rows={5}
												className={`block w-full p-2 border bg-slate-950 text-gray-100 ${
													errors.content ? 'border-red-600' : 'border-gray-300'
												}`}
											/>
											{errors.content && (
												<p className='text-sm text-red-600'>
													{errors.content.message}
												</p>
											)}
										</div>

										<div>
											<label
												htmlFor='image'
												className='block mb-1 text-gray-100'>
												Image
											</label>
											<input
												type='file'
												id='image'
												{...register('image', {
													required: 'Please upload an image.',
												})}
												className={`block w-full p-2 border text-gray-100 ${
													errors.image ? 'border-red-600' : 'border-gray-300'
												}`}
											/>
											{errors.image && (
												<p className='text-sm text-red-600'>
													{errors.image.message}
												</p>
											)}
										</div>

										<div>
											<label
												htmlFor='approve'
												className='flex items-center text-gray-100'>
												<input
													type='checkbox'
													id='agreeTerms'
													{...register('approve', {
														required: 'You must approve.',
													})}
												/>
												<span className='pl-2 text-gray-100'>
													approve to post
												</span>
											</label>
											{errors.approve && (
												<p className='text-sm text-red-600'>
													{errors.approve.message}
												</p>
											)}
										</div>

										<button
											type='submit'
											className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
											{isLoading ? 'posting....' : 'Post'}
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
					<div className='px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
						<button
							onClick={onClose}
							type='button'
							className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-200 border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default PostModal
