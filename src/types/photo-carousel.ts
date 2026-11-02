export type Card = {
	id: string;
	imageSrc: string;
	imageAlt: string;
	title: string;
	tags: string[];
};

export type PhotoCarouselProps = {
	items: Card[];
	ariaLabel: string;
	speed?: number;
	id?: string;
};
