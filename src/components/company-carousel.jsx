"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import companies from "@/data/companies";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

function CompanyCarousel() {
	return (
		<Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full py-10">
			<CarouselContent className="flex gap-4 sm:gap-20 items-center">
				{companies.map((company, index) => (
					<CarouselItem
						key={`idx-${index}-company-${company.name}-${company.id}`}
						className={"basis-1/3 lg:basis-1/6"}
					>
						<Image
							src={company.path}
							alt={company.name}
							width={200}
							height={56}
							className="h-9 sm:h-14 w-auto object-contain"
						/>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}

export default CompanyCarousel;
