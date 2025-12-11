import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Video, FileText, Link as LinkIcon, Edit, Loader2 } from 'lucide-react';
import { trainingsService, Training, CreateTrainingDto, TrainingResource } from '@/services/api/trainings.service';
import { useToast } from '@/components/ui/use-toast';

const TrainingManagement: React.FC = () => {
    const { toast } = useToast();
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<string>('onboarding');
    const [type, setType] = useState<string>('video');
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [duration, setDuration] = useState<number>(0);

    // Resources state
    const [resources, setResources] = useState<TrainingResource[]>([]);
    const [newResTitle, setNewResTitle] = useState('');
    const [newResType, setNewResType] = useState('pdf');
    const [newResUrl, setNewResUrl] = useState('');

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        setIsLoading(true);
        try {
            const response = await trainingsService.findAll();
            if (response.success && response.data) {
                setTrainings(response.data);
            }
        } catch (error) {
            toast({
                title: "Erro ao carregar treinamentos",
                description: "Não foi possível buscar a lista de treinamentos.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddResource = () => {
        if (!newResTitle || !newResUrl) return;
        setResources([...resources, { title: newResTitle, type: newResType, url: newResUrl }]);
        setNewResTitle('');
        setNewResUrl('');
        setNewResType('pdf');
    };

    const handleRemoveResource = (index: number) => {
        setResources(resources.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('onboarding');
        setType('video');
        setVideoUrl('');
        setThumbnailUrl('');
        setDuration(0);
        setResources([]);
        setIsCreating(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newTraining: CreateTrainingDto = {
            title,
            description,
            category,
            type,
            videoUrl: type === 'video' ? videoUrl : undefined,
            thumbnailUrl,
            duration: Number(duration),
            resources,
            isGlobal: true, // Default to global for now
        };

        try {
            const response = await trainingsService.create(newTraining);
            if (response.success) {
                toast({
                    title: "Sucesso",
                    description: "Treinamento criado com sucesso!",
                });
                resetForm();
                fetchTrainings();
            } else {
                toast({
                    title: "Erro",
                    description: response.error || "Erro ao criar treinamento.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro inesperado.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este treinamento?')) return;

        try {
            const response = await trainingsService.remove(id);
            if (response.success) {
                toast({ title: "Treinamento excluído" });
                fetchTrainings();
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao excluir.",
                variant: "destructive"
            });
        }
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gerenciar Treinamentos</h2>
                <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Treinamento
                </Button>
            </div>

            {isCreating && (
                <Card className="mb-6 border-blue-200 shadow-md">
                    <CardHeader><CardTitle>Novo Conteúdo</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Título</Label>
                                    <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ex: Como Vender Mais" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Categoria</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="onboarding">Onboarding</SelectItem>
                                            <SelectItem value="marketing">Marketing</SelectItem>
                                            <SelectItem value="sales">Vendas</SelectItem>
                                            <SelectItem value="operations">Operações</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tipo de Conteúdo</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="video">Vídeo</SelectItem>
                                            <SelectItem value="pdf">PDF</SelectItem>
                                            <SelectItem value="article">Artigo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Duração (minutos)</Label>
                                    <Input type="number" min="0" value={duration} onChange={e => setDuration(Number(e.target.value))} />
                                </div>
                            </div>

                            {type === 'video' && (
                                <div className="space-y-2">
                                    <Label>URL do Vídeo (YouTube/Vimeo)</Label>
                                    <div className="flex items-center gap-2">
                                        <Video className="h-4 w-4 text-gray-500" />
                                        <Input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://..." />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Thumbnail URL (Capa)</Label>
                                <Input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} placeholder="https://..." />
                            </div>

                            <div className="space-y-2">
                                <Label>Descrição</Label>
                                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva o conteúdo..." />
                            </div>

                            {/* Resources Section */}
                            <div className="border p-4 rounded-md space-y-4 bg-gray-50">
                                <h4 className="font-medium flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Recursos Adicionais (Downloads/Links)</h4>

                                {resources.length > 0 && (
                                    <div className="space-y-2">
                                        {resources.map((res, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                                                <span>{res.title} ({res.type})</span>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveResource(idx)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 items-end">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs">Título do Recurso</Label>
                                        <Input value={newResTitle} onChange={e => setNewResTitle(e.target.value)} placeholder="Ex: PDF de Apoio" />
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <Label className="text-xs">Tipo</Label>
                                        <Select value={newResType} onValueChange={setNewResType}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF</SelectItem>
                                                <SelectItem value="link">Link</SelectItem>
                                                <SelectItem value="file">Arquivo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs">URL</Label>
                                        <Input value={newResUrl} onChange={e => setNewResUrl(e.target.value)} placeholder="https://..." />
                                    </div>
                                    <Button type="button" variant="secondary" onClick={handleAddResource}>Adicionar</Button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" type="button" onClick={resetForm}>Cancelar</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar Treinamento
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
            ) : (
                <div className="grid gap-4">
                    {trainings.map(t => (
                        <Card key={t._id || t.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div className="flex items-start gap-4">
                                    {t.thumbnailUrl ? (
                                        <img src={t.thumbnailUrl} alt={t.title} className="w-16 h-16 object-cover rounded" />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                            {t.type === 'video' ? <Video className="text-gray-400" /> : <FileText className="text-gray-400" />}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-lg">{t.title}</h4>
                                        <div className="flex gap-2 text-sm text-gray-500">
                                            <span className="capitalize bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{t.category}</span>
                                            <span className="capitalize bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                                                {t.type === 'video' ? <Video className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                                                {t.type}
                                            </span>
                                            {t.duration && <span>{t.duration} min</span>}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{t.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(t._id || t.id!)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {trainings.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-gray-500">Nenhum treinamento cadastrado.</p>
                            <Button variant="link" onClick={() => setIsCreating(true)}>Criar o primeiro</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrainingManagement;
