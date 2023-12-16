import { db } from '@/firebase/firebase.config'
import { ICustomer } from '@/types'
import formatTimestamp from '@/utils/formatTimestamp'
import {
	DocumentData,
	FieldValue,
	QueryDocumentSnapshot,
	Timestamp,
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from 'firebase/firestore'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'

type LoadData = {
	id: string
	data: ICustomer
}
type field = 'offer' | 'rent' | 'sale'
type props = {
	lastItem: QueryDocumentSnapshot<DocumentData> | string
	setNewCustomers: Dispatch<SetStateAction<LoadData[]>>
	setLastCustomer: Dispatch<
		SetStateAction<QueryDocumentSnapshot<DocumentData> | null>
	>
	field: field
}

function LoadMore({
	lastItem,
	setNewCustomers,
	field,
	setLastCustomer,
}: props): JSX.Element {
	const [loading, setLoading] = useState(false)
	async function handleLoadMore() {
		setLoading(true)
		try {
			const docRef = collection(db, 'customers')
			let whereField = field === 'offer' ? field : 'type'
			let clientField =
				field === 'offer' ? true : field === 'rent' ? field : 'sale'
			//firestore query
			const q = query(
				docRef,
				where(whereField, '==', clientField),
				orderBy('timestamp', 'desc'),
				startAfter(lastItem),
				limit(5)
			)
			// fetch data from firebase.
			const docSnap = await getDocs(q)
			const customers: LoadData[] = []
			const lastVisible = docSnap.docs[docSnap.docs.length - 1]
			setLastCustomer(lastVisible)
			console.log('last lisitng', lastVisible)

			docSnap.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
				let timestampString: string = formatTimestamp(doc.data() as ICustomer)
				customers.push({
					id: doc.id,
					data: {
						...(doc.data() as ICustomer),
						timestamp: FieldValue ? timestampString : doc.data().timestamp,
					},
				})
			})
			setNewCustomers((prevState) => [...prevState, ...customers])
		} catch (err) {
			toast.error('Could not fetch more customers.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<button
			disabled={loading}
			onClick={handleLoadMore}
			className='w-[8rem] mx-auto my-0 text-center py-1 px-2 flex items-center justify-center opacity-70 mt-8 bg-primary-black text-primary-white font-bold rounded-2xl'
		>
			{!loading ? (
				<span>Load More</span>
			) : (
				<span className='h-6 w-6 border-t-transparent block border-solid border rounded-[50%] border-primary-white animate-spin'></span>
			)}
		</button>
	)
}

export default LoadMore
