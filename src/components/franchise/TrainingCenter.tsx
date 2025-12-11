import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Download, BookOpen, ExternalLink, Video, FileText, Loader2 } from 'lucide-react';
import { trainingsService, Training } from '@/services/api/trainings.service';
import { useToast } from '@/components/ui/use-toast';

const TrainingCenter: React.FC<{ franchiseId: string }> = ({ franchiseId }) => {
    const { toast } = useToast();
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                // Determine if we should fetch global trainings or franchise specific.
                // For now, let's assume we want to listed all available trainings for this franchise context
                // If the backend has a specific endpoint for "available to franchise", use that.
                // Based on previous service, `findAll` fetches all (admin view likely), 
                // `findAllByFranchise` fetches specific assignment.
                // However, usually "Training Center" shows Global + Assigned.
                // Let's try findAllByFranchise first, if empty, maybe fallback or just show empty.
                // Actually, looking at the Controller, `findAllByFranchise` is what we implemented.
                const response = await trainingsService.findAllByFranchise(franchiseId);

                // Fallback attempt: if findAllByFranchise fails (e.g. not implemented correctly on backend for "Global" inclusion),
                // we might want to just call findAll() if it returns everything. 
                // But let's trust the primary intent first.

                if (response.success && response.data) {
                    setTrainings(response.data);
                } else if (!response.success) {
                    // If endpoint not found or error, maybe try generic list? 
                    // Or just show error.
                    console.error("Failed to load trainings", response.error);
                    // Optional: Try loading global list if franchise specific returns nothing/error?
                    // const globalResponse = await trainingsService.findAll();
                    // if (globalResponse.success && globalResponse.data) setTrainings(globalResponse.data);
                }
            } catch (error) {
                console.error("Error fetching trainings:", error);
                toast({
                    title: "Erro ao carregar treinamentos",
                    description: "Não foi possível carregar o conteúdo de treinamento.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        if (franchiseId) {
            fetchTrainings();
        }
    }, [franchiseId, toast]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-muted-foreground">Carregando treinamentos...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Centro de Treinamento</h2>
                <p className="text-muted-foreground">
                    Materiais de apoio e treinamentos para sua unidade
                </p>
            </div>

            {trainings.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        Nenhum treinamento disponível no momento.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trainings.map(training => (
                        <Card key={training._id || training.id} className="flex flex-col">
                            {training.thumbnailUrl && (
                                <div className="h-40 w-full overflow-hidden rounded-t-lg bg-gray-100">
                                    <img
                                        src={training.thumbnailUrl}
                                        alt={training.title}
                                        className="h-full w-full object-cover transition-transform hover:scale-105"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="flex items-start justify-between text-lg gap-2">
                                    <span className="line-clamp-2">{training.title}</span>
                                    {training.type === 'video' ?
                                        <Video className="h-5 w-5 text-blue-500 flex-shrink-0" /> :
                                        <FileText className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    }
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {training.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <div className="space-y-4">
                                    {training.type === 'video' ? (
                                        <Button className="w-full" variant="default" onClick={() => window.open(training.videoUrl, '_blank')}>
                                            <Play className="h-4 w-4 mr-2" />
                                            Assistir Agora
                                        </Button>
                                    ) : (
                                        <Button className="w-full" variant="outline" onClick={() => {
                                            // Open first resource or the training url if valid
                                            const target = training.resources?.[0]?.url || '#';
                                            window.open(target, '_blank');
                                        }}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Acessar Material
                                        </Button>
                                    )}

                                    {training.duration && (
                                        <p className="text-xs text-center text-muted-foreground">
                                            Duração estimada: {training.duration} min
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrainingCenter;
