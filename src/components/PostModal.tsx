import { useState } from 'react'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

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
	image: z.instanceof(File).optional(),
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
	const [formData, setFormData] = useState(initialState)
	const [error, setError] = useState<Error | null>(null)

	const { mutateAsync, isLoading, isError } = useMutation(createPost, {
		onSuccess: () => {
			onClose()
		},
	})

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)
		try {
			const validatedData = schema.parse(formData)
			await mutateAsync(validatedData)
		} catch (error) {
			if (error instanceof Error) {
				setError(error)
				setTimeout(() => {
					setError(null)
				}, 3000)
			}
		}
	}

	const handleFormChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target
		setFormData((prevState) => ({ ...prevState, [name]: value }))
	}

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target
		setFormData((prevState) => ({ ...prevState, [name]: checked }))
	}

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) {
			return
		}
		const imageFile = event.target.files[0]
		if (!imageFile.type.startsWith('image/')) {
			setError(new Error('Please select an image file (JPG, PNG, or GIF)'))
			return
		}

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
									<form className='space-y-4' onSubmit={handleSubmit}>
										{' '}
										<div>
											{' '}
											<label
												htmlFor='content'
												className='block font-medium text-gray-100'>
												Content:{' '}
											</label>{' '}
											<textarea
												name='content'
												value={formData.content}
												onChange={handleFormChange}
												rows={5}
												className='w-full px-6 py-3 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
											/>{' '}
										</div>{' '}
										<div>
											{' '}
											<label
												htmlFor='image'
												className='block font-medium text-gray-100'>
												Image:{' '}
											</label>{' '}
											<input
												id='image'
												type='file'
												name='image'
												onChange={handleImageChange}
												onDrop={handleDrop}
												onDragOver={(e) => e.preventDefault()}
												className='w-full px-4 py-3 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
											/>{' '}
										</div>{' '}
										<div className='flex items-center'>
											{' '}
											<input
												id='approve'
												type='checkbox'
												name='approve'
												checked={formData.approve}
												onChange={handleCheckboxChange}
												className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
											/>
											<label
												htmlFor='approve'
												className='block ml-2 font-medium text-gray-700'>
												Approve
											</label>{' '}
										</div>
										{error && (
											<div className='text-red-500'>{error.message}</div>
										)}
										<button
											type='submit'
											className='px-4 py-2 mt-4 font-bold text-white bg-indigo-500 rounded hover:bg-indigo-700'>
											{isLoading ? 'Creating Post...' : 'Create Post'}
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
