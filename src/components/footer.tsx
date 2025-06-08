import cdclogo from "../assets/logo.png";

interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface FooterProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const Footer = ({
    logo = {
        src: `${cdclogo}`,
        alt: "Logo Chef de Cuisine",
        title: "Chef de Cuisine",
        url: "/",
    },
    tagline = "Your Go-To Recipe Platform",
    menuItems = [
        {
            title: "Project",
            links: [
                { text: "About", url: "https://github.com/CSSE6400/2025_P2_ChefdeCuisine" },
                { text: "Team", url: "https://github.com/CSSE6400/2025_P2_ChefdeCuisine/graphs/contributors" },
            ],
        },
    ],
    copyright = "© 2025 Chef de Cuisine. All rights reserved.",
    bottomLinks = [],
}: FooterProps) => {
    return (
        <section className="py-16 bg-white mt-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <footer>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="col-span-1 lg:col-span-2 mb-8 lg:mb-0">
                            <div className="flex items-center gap-2">
                                <a href={logo.url}>
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        title={logo.title}
                                        className="h-10"
                                    />
                                </a>
                                <div>
                                    <p className="text-xl font-semibold text-orange-600">
                                        {logo.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{tagline}</p>
                                </div>
                            </div>
                        </div>
                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold text-gray-900">
                                    {section.title}
                                </h3>
                                <ul className="space-y-4 text-gray-600">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-orange-600 transition-colors duration-200"
                                        >
                                            <a href={link.url}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <p className="text-sm font-medium text-gray-600">{copyright}</p>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export { Footer };
