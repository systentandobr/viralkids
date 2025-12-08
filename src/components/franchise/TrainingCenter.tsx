import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Download, BookOpen, ExternalLink } from 'lucide-react';

// Types
interface Resource {
    type: string;
    url: string;
    title: string;
}

interface Training {
    id: string;
    title: string;
    description: string;
    category: string;
    type: 'video' | 'pdf' | 'article' | 'interactive';
    videoUrl?: string;
    thumbnailUrl?: string;
    resources: Resource[];
}

const TrainingCenter: React.FC<{ franchiseId: string }> = ({ franchiseId }) => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        setTimeout(() => {
            setTrainings([
                {
                    id: '1',
                    title: 'Marketing no Instagram',
                    description: 'Como criar conteúdo que vende',
                    category: 'marketing',
                    type: 'video',
                    videoUrl: 'https://example.com/video.mp4',
                    resources: []
                },
                {
                    id: '2',
                    title: 'Atendimento ao Cliente',
                    description: 'Técnicas de vendas e relacionamento',
                    category: 'sales',
                    type: 'pdf',
                    resources: [{ type: 'pdf', url: '#', title: 'Guia de Vendas' }]
                }
            ]);
            setLoading(false);
        }, 1000);
    }, [franchiseId]);

    if (loading) return <div>Carregando treinamentos...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Centro de Treinamento</h2>
                <p className="text-muted-foreground">
                    Materiais de apoio e treinamentos para sua franquia
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainings.map(training => (
                    <Card key={training.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-lg">
                                {training.type === 'video' ? <Play className="h-5 w-5 text-blue-500" /> : <BookOpen className="h-5 w-5 text-green-500" />}
                                <span>{training.title}</span>
                            </CardTitle>
                            <CardDescription>
                                {training.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {training.type === 'video' ? (
                                <Button className="w-full" variant="outline">
                                    <Play className="h-4 w-4 mr-2" />
                                    Assistir Treinamento
                                </Button>
                            ) : (
                                <Button className="w-full" variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Baixar Material
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrainingCenter;
