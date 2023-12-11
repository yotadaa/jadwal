export function generateMetadata(page) {
    const title = page.title || 'Jadwalku';
    const description = page.description || 'A Simple schedule and task management app';
    const icon = page.icon || 'assets/schedule.ico';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: page.url,
            type: 'website',
            images: [
                {
                    url: icon,
                    width: 128,
                    height: 128,
                    alt: 'Jadwalku logo',
                },
            ],
        },
    };
}