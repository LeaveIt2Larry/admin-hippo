import Image from 'next/image'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
type props = {
	images: string[]
}
function Slider({ images }: props) {
	return (
		<Swiper
			// install Swiper modules
			className='h-[23vw] min-h-[230px]'
			modules={[Navigation, Pagination, Scrollbar, A11y]}
			spaceBetween={10}
			slidesPerView={1}
			pagination={{ clickable: true }}
			scrollbar={{ draggable: true, hide: true }}
		>
			{images.map((image, index) => (
				<SwiperSlide key={`${image}-${index}`}>
					<Image
						src={image}
						height={100}
						width={100}
						alt={'slider image'}
						className='object-contain bg-center'
					/>
				</SwiperSlide>
			))}
		</Swiper>
	)
}

export default Slider
