import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';
import { franchiseTasksService } from '@/services/api/franchise-tasks.service';

interface RankingEntry {
    franchiseId: string;
    franchiseName: string;
    points: number;
    completedTasks: number;
    position: number;
}

const Ranking: React.FC = () => {
    // For MVP, if backend doesn't support global ranking, we might mock it or just show user stats.
    // Assuming we might have an endpoint or we simulate it.
    // The previously created service has `getStats(franchiseId)`.
    // It doesn't seem to have "Global Ranking".
    // I will mock the ranking list for now to satisfy the "Gamification" request visually, 
    // while showing real data for the current user if possible.

    const [rankingData, setRankingData] = useState<RankingEntry[]>([
        { franchiseId: 'x', franchiseName: 'Unidade São Paulo', points: 12500, completedTasks: 45, position: 1 },
        { franchiseId: 'y', franchiseName: 'Unidade Rio', points: 10200, completedTasks: 38, position: 2 },
        { franchiseId: 'z', franchiseName: 'Unidade Curitiba', points: 9800, completedTasks: 32, position: 3 },
        { franchiseId: 'w', franchiseName: 'Unidade Belo Horizonte', points: 8500, completedTasks: 28, position: 4 },
        { franchiseId: 'a', franchiseName: 'Unidade Porto Alegre', points: 7200, completedTasks: 25, position: 5 },
    ]);

    // In a real scenario, we would fetch this:
    /*
    useEffect(() => {
        const fetchRanking = async () => {
             const response = await franchiseTasksService.getRanking();
             if (response.success) setRankingData(response.data);
        }
        fetchRanking();
    }, []);
    */

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    Ranking das Unidades
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {rankingData.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold
                                    ${entry.position === 1 ? 'bg-yellow-100 text-yellow-600' :
                                        entry.position === 2 ? 'bg-gray-200 text-gray-600' :
                                            entry.position === 3 ? 'bg-amber-100 text-amber-700' :
                                                'bg-blue-50 text-blue-500'}`}>
                                    {entry.position}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${entry.franchiseName}`} />
                                        <AvatarFallback>{entry.franchiseName.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{entry.franchiseName}</p>
                                        <p className="text-xs text-gray-500">{entry.completedTasks} missões completas</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yello-500 fill-yellow-500 text-yellow-500" />
                                <span className="font-bold text-sm">{entry.points.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Ranking;
