import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="z-40 flex flex-col items-center justify-center mx-auto my-4 w-[25vw] p-4 rounded-md bg-gradient-to-r from-lolblue6 to-lolblue7">
            <p className="text-white">
                Made with{' '}
                <span className="inline-block animate-pulse transition-transform duration-1000">
                    💛
                </span>{' '}
                by{' '}
                <Link
                    href="https://portfolio-karamelunes-projects.vercel.app/"
                    target="_blank"
                    className="text-transparent bg-clip-text bg-gradient-to-tr from-lolgold2 via-lolgold3 to-lolgold4 hover:from-lolblue2 hover:via-lolblue3 hover:to-lolblue4">
                    Dylan CLERCKX
                </Link>
            </p>
        </footer>
    );
};
