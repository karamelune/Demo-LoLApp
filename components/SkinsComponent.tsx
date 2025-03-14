import React, { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from './ui/collapsible';
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import { ChampionRiotData } from '@/types/championRiotData';
import { Champion } from '@/types/champion';

interface SkinsComponentProps {
    championRiotData: ChampionRiotData;
    champion: Champion;
}

const SkinsComponent: React.FC<SkinsComponentProps> = ({
    championRiotData,
    champion,
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const skinsPerPage = 6;

    // Calculer les skins à afficher
    const startIndex = currentPage * skinsPerPage;
    const endIndex = startIndex + skinsPerPage;
    const currentSkins = championRiotData.skins.slice(startIndex, endIndex);

    // Gestion des pages
    const totalPages = Math.ceil(championRiotData.skins.length / skinsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Collapsible className="flex flex-col gap-1 justify-center items-center p-2 w-full bg-gradient-to-r from-lolblue6 to-lolblue7 rounded-md shadow-md">
            <CollapsibleTrigger className="flex text-lolgray1 font-semibold text-sm justify-between items-center w-full">
                <p className="text-center w-full">Skins</p>
                <ChevronsUpDown />
            </CollapsibleTrigger>

            <CollapsibleContent className="w-full p-2 text-center overflow-x-auto">
                <div className="flex justify-center items-start gap-2">
                    {currentSkins.map((skin) => (
                        <div
                            key={skin.num}
                            className="flex flex-col gap-1 justify-start items-center h-[260px]">
                            <div className="p-0.5 rounded-md shadow-md bg-gradient-to-br from-lolgold5 to-lolgold4">
                                <Image
                                    src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_${skin.num}.jpg`}
                                    width={120}
                                    height={218}
                                    title={skin.name}
                                    alt={skin.name}
                                    loading="lazy"
                                    className="rounded-md w-[120px] h-[218px]"
                                />
                            </div>
                            <p className="text-lolgray1 text-xs text-center text-wrap w-[120px]">
                                {skin.name}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2">
                    {currentPage !== 0 && (
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                            title="Previous">
                            <ChevronLeft />
                        </button>
                    )}

                    {currentPage !== totalPages - 1 && (
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages - 1}
                            title="Next"
                            className="ml-auto">
                            <ChevronRight />
                        </button>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

export default SkinsComponent;
