export type ProjectImage = {
    imageSrc: string;
    imageAlt: string;
}

export type Project = {
    id: string;
    slug: string;
    title: string;
    description: string;
    gallery: ProjectImage[];
    tags: string[];
};
