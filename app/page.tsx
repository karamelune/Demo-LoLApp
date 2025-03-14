'use client';

import { useRef } from 'react';
import { redirect } from 'next/navigation';
import {
    Award,
    BarChart2,
    Clock,
    Code,
    Database,
    Layers,
    List,
    Search,
    Server,
    Shield,
    User,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function Home() {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
        if (inputRef.current) {
            const inputValue = inputRef.current.value;
            const [gameName, tagLine] = inputValue.split('#');
            redirect(`/summoner/${gameName}/${tagLine}`);
        }
    };

    return (
        <section className="flex flex-col items-center">
            {/* Background Image */}
            <div className="fixed -z-50 w-[100vw] h-[100vh] bg-cover bg-center rounded-md shadow-md top-0 left-0 blur-xl">
                <Image
                    src="/default-background.jpg"
                    alt="Background Image"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                    League of Legends Demo App
                </h1>
                <p className="text-slate-200 opacity-80 text-sm italic">
                    Best on 1920x1080p screens as responsive isn&apos;t fully
                    implemented yet.
                </p>
            </div>

            <Separator
                className="bg-lolgold2/40 h-[1px] w-40 my-4"
                orientation="horizontal"
            />

            <p className="text-white font-semibold mb-2">
                Enter your username and tag (case sensitive) :
            </p>

            {/* Summoner search */}
            <div className="mx-2 flex ">
                <input
                    type="text"
                    aria-label='Game name and tag line, e.g. "Karamelune#TEEMO"'
                    placeholder="GameName#TagLine"
                    className="bg-slate-200 rounded-l-md py-1 px-2 border-r-2 border-gray-400"
                    ref={inputRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <button
                    aria-label="Search"
                    onClick={handleSearch}
                    className="bg-slate-200 rounded-r-md py-1 px-2">
                    <Search className="h-5 w-5" />
                </button>
            </div>

            <p className="text-white my-2">or</p>

            {/* Demo */}

            <p className="text-white font-semibold mb-2">
                Click on this button to see what this app is capable of :
            </p>
            <button
                className="bg-gradient-to-r from-lolblue4 to-lolblue2 transform hover:scale-105 hover:from-lolblue5 hover:to-lolblue3 text-white py-1 px-2 rounded-md"
                onClick={() => {
                    redirect('/summoner/Karamelune/TEEMO');
                }}>
                Demo
            </button>

            <Separator
                className="bg-lolgold2/40 h-[1px] w-40 my-8"
                orientation="horizontal"
            />

            {/* Features Section */}
            <div className="w-full max-w-2xl mb-6">
                <h2 className="text-2xl font-bold text-white mb-3 text-center">
                    Features
                </h2>
                <div className="grid grid-cols-2 gap-4 px-4">
                    <div className="bg-gradient-to-r from-lolblue6 to-lolblue7 p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <User className="h-5 w-5 text-lolgold2 mr-2" />
                            <h3 className="text-white font-semibold">
                                Summoner Profile
                            </h3>
                        </div>
                        <p className="text-white/70 text-sm">
                            View player level, profile icon, and account details
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-lolblue6 to-lolblue7 p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <Award className="h-5 w-5 text-lolgold2 mr-2" />
                            <h3 className="text-white font-semibold">
                                Ranked Stats
                            </h3>
                        </div>
                        <p className="text-white/70 text-sm">
                            Check current rank, LP, and competitive performance
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-lolblue6 to-lolblue7 p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <Clock className="h-5 w-5 text-lolgold2 mr-2" />
                            <h3 className="text-white font-semibold">
                                Match History
                            </h3>
                        </div>
                        <p className="text-white/70 text-sm">
                            Browse recent matches with detailed performance
                            metrics
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-lolblue6 to-lolblue7 p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <Shield className="h-5 w-5 text-lolgold2 mr-2" />
                            <h3 className="text-white font-semibold">
                                Champion Stats
                            </h3>
                        </div>
                        <p className="text-white/70 text-sm">
                            View champions played, masteries, and performance
                            data
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-lolblue6 to-lolblue7 p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <List className="h-5 w-5 text-lolgold2 mr-2" />
                            <h3 className="text-white font-semibold">
                                Item Analysis
                            </h3>
                        </div>
                        <p className="text-white/70 text-sm">
                            See item builds and equipment choices from matches
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-lolblue6 to-lolblue7 p-3 rounded-md">
                        <div className="flex items-center mb-2">
                            <BarChart2 className="h-5 w-5 text-lolgold2 mr-2" />
                            <h3 className="text-white font-semibold">
                                Performance Metrics
                            </h3>
                        </div>
                        <p className="text-white/70 text-sm">
                            Analyze KDA, CS, vision score, and other key
                            statistics
                        </p>
                    </div>
                </div>
            </div>

            <Separator
                className="bg-lolgold2/40 h-[1px] w-40 my-8"
                orientation="horizontal"
            />

            {/* What I Learned Section */}
            <div className="w-full max-w-2xl mb-6">
                <h2 className="text-2xl font-bold text-white mb-3 text-center">
                    My Development Journey
                </h2>
                <div className="bg-gradient-to-r from-lolblue6 to-lolblue7 p-5 rounded-md mb-4">
                    <p className="text-white/90 mb-3">
                        This project served as a comprehensive training ground
                        for modern web development technologies and practices.
                        Building this application allowed me to gain hands-on
                        experience with:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-start">
                            <Server className="h-5 w-5 text-lolgold2 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-white font-semibold">
                                    API Integration
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Implemented complex data fetching from the
                                    Riot Games API, handling rate limits,
                                    authentication, and data transformation
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <Database className="h-5 w-5 text-lolgold2 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-white font-semibold">
                                    MongoDB Atlas
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Designed and implemented a cloud database
                                    solution for storing player data, match
                                    history, and caching API responses
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <Layers className="h-5 w-5 text-lolgold2 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-white font-semibold">
                                    Next.js Framework
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Leveraged server-side rendering, API routes,
                                    and the App Router for optimized performance
                                    and SEO
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <Code className="h-5 w-5 text-lolgold2 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-white font-semibold">
                                    TypeScript
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Implemented strong typing throughout the
                                    application for improved code quality,
                                    maintainability, and developer experience
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-slate-700/30 p-3 rounded border border-lolgray1/20">
                        <p className="text-white/80 text-sm italic">
                            &quot;This project challenged me to integrate
                            multiple technologies into a cohesive application.
                            From handling complex API data structures to
                            designing an intuitive user interface, each aspect
                            provided valuable learning opportunities in modern
                            web development.&quot;
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
