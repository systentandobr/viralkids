import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Loader2, Save, X, List, CheckSquare, Palette, Lock } from 'lucide-react';
import { taskTemplatesService, TaskTemplate, CreateTaskTemplateDto, TaskStep, TaskResource } from '@/services/api/task-templates.service';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const TaskTemplateManagement: React.FC = () => {
    const { toast } = useToast();
    const [templates, setTemplates] = useState<TaskTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state - Basics
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<string>('onboarding');
    const [type, setType] = useState<string>('checklist');
    const [instructions, setInstructions] = useState('');

    // Form state - Gameification & Logic
    const [points, setPoints] = useState<number>(100);
    const [difficulty, setDifficulty] = useState<string>('medium');
    const [estimatedTime, setEstimatedTime] = useState<number>(15);
    const [isDefault, setIsDefault] = useState(false);
    const [dependencies, setDependencies] = useState<string[]>([]);

    // Styling
    const [color, setColor] = useState('#3b82f6');
    const [icon, setIcon] = useState('CheckCircle');

    // Validation
    const [validationType, setValidationType] = useState('none');

    // Resources & Steps
    const [steps, setSteps] = useState<TaskStep[]>([]);
    const [newStepTitle, setNewStepTitle] = useState('');

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            const response = await taskTemplatesService.findAll();
            if (response.success && response.data) {
                setTemplates(response.data);
            }
        } catch (error) {
            toast({
                title: "Erro ao carregar templates",
                description: "Não foi possível buscar a lista de templates.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddStep = () => {
        if (!newStepTitle) return;
        // Backend requires description for steps too
        setSteps([...steps, { order: steps.length + 1, title: newStepTitle, description: newStepTitle, required: true }]);
        setNewStepTitle('');
    };

    const handleRemoveStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 })));
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setCategory('onboarding');
        setType('checklist');
        setPoints(100);
        setEstimatedTime(15);
        setIsDefault(false);
        setSteps([]);
        setDependencies([]);
        setDifficulty('medium');
        setInstructions('');
        setColor('#3b82f6');
        setIcon('CheckCircle');
        setValidationType('none');
        setIsCreating(false);
        setEditingId(null);
    };

    const handleEdit = (template: TaskTemplate) => {
        setEditingId(template._id || template.id!);
        setName(template.name);
        setDescription(template.description);
        setCategory(template.category);
        setType(template.type);
        setPoints(template.points || 100);
        setEstimatedTime(template.estimatedTime || 15);
        setIsDefault(template.isDefault);
        setSteps(template.steps || []);

        // New fields
        setDifficulty(template.difficulty || 'medium');
        setInstructions(template.instructions || '');
        setDependencies(template.dependencies || []);
        setColor(template.color || '#3b82f6');
        setIcon(template.icon || 'CheckCircle');
        setValidationType(template.validation?.type || 'none');

        setIsCreating(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const templateData: CreateTaskTemplateDto = {
            name,
            description,
            category,
            type,
            steps,
            points,
            difficulty,
            estimatedTime,
            isDefault,
            dependencies,
            instructions,
            color,
            icon,
            validation: {
                type: validationType,
                required: validationType !== 'none',
                instructions: validationType !== 'none' ? 'Validação necessária' : '',
            }
        };

        try {
            let response;
            if (editingId) {
                response = await taskTemplatesService.update(editingId, templateData);
            } else {
                response = await taskTemplatesService.create(templateData);
            }

            if (response.success) {
                toast({ title: "Sucesso", description: "Template salvo!" });
                resetForm();
                fetchTemplates();
            } else {
                toast({ title: "Erro", description: response.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Erro", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">SOPs e Tarefas</h2>
                <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Template
                </Button>
            </div>

            {isCreating && (
                <Card className="mb-6 border-blue-200">
                    <CardHeader><CardTitle>{editingId ? 'Editar Template' : 'Novo Template'}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome da Tarefa</Label>
                                    <Input value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Descrição Curta</Label>
                                    <Input value={description} onChange={e => setDescription(e.target.value)} required placeholder="Breve descrição..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Categoria</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="onboarding">Onboarding</SelectItem>
                                            <SelectItem value="marketing">Marketing</SelectItem>
                                            <SelectItem value="sales">Sales</SelectItem>
                                            <SelectItem value="setup">Setup</SelectItem>
                                            <SelectItem value="social_media">Redes Sociais</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Details: Diff, Points, Time, Color */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Dificuldade</Label>
                                    <Select value={difficulty} onValueChange={setDifficulty}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Fácil</SelectItem>
                                            <SelectItem value="medium">Médio</SelectItem>
                                            <SelectItem value="hard">Difícil</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Pontos</Label>
                                    <Input type="number" value={points} onChange={e => setPoints(Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cor (Hex)</Label>
                                    <div className="flex gap-2">
                                        <Input value={color} onChange={e => setColor(e.target.value)} type="color" className="w-12 p-1" />
                                        <Input value={color} onChange={e => setColor(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Validação</Label>
                                    <Select value={validationType} onValueChange={setValidationType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhuma</SelectItem>
                                            <SelectItem value="link">Link</SelectItem>
                                            <SelectItem value="upload">Upload</SelectItem>
                                            <SelectItem value="text">Texto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Dependencies Selector */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Lock className="h-3 w-3" /> Pré-requisitos (Dependências)</Label>
                                <div className="flex flex-wrap gap-2 p-3 border rounded bg-gray-50 max-h-32 overflow-y-auto">
                                    {templates.filter(t => t._id !== editingId).map(t => (
                                        <div
                                            key={t._id}
                                            className={`
                                                cursor-pointer px-3 py-1 rounded text-xs border transition-colors
                                                ${dependencies.includes(t._id || t.id!)
                                                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                                                    : 'bg-white border-gray-200 hover:bg-gray-100'}
                                            `}
                                            onClick={() => {
                                                const id = t._id || t.id!;
                                                if (dependencies.includes(id)) {
                                                    setDependencies(dependencies.filter(d => d !== id));
                                                } else {
                                                    setDependencies([...dependencies, id]);
                                                }
                                            }}
                                        >
                                            {t.name}
                                        </div>
                                    ))}
                                    {templates.length === 0 && <span className="text-gray-400 text-sm">Nenhum outro template disponível para depender.</span>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Instruções Detalhadas</Label>
                                <Textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Passo a passo detalhado..." rows={4} />
                            </div>

                            {/* Steps */}
                            <div className="border p-4 rounded bg-gray-50">
                                <Label>Checklist (Sub-tarefas)</Label>
                                <div className="space-y-2 mt-2">
                                    {steps.map((s, idx) => (
                                        <div key={idx} className="flex gap-2 items-start bg-white p-2 border rounded">
                                            <span className="mt-2 font-bold w-6">{s.order}.</span>
                                            <div className="flex-1 space-y-1">
                                                <Input
                                                    value={s.title}
                                                    onChange={(e) => {
                                                        const newSteps = [...steps];
                                                        newSteps[idx].title = e.target.value;
                                                        setSteps(newSteps);
                                                    }}
                                                    placeholder="Título da etapa"
                                                    className="h-8 font-medium"
                                                />
                                                <Input
                                                    value={s.description}
                                                    onChange={(e) => {
                                                        const newSteps = [...steps];
                                                        newSteps[idx].description = e.target.value;
                                                        setSteps(newSteps);
                                                    }}
                                                    placeholder="Descrição da etapa (obrigatório)"
                                                    className="h-8 text-sm text-gray-500"
                                                />
                                            </div>
                                            <Button size="sm" variant="ghost" onClick={() => handleRemoveStep(idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Input value={newStepTitle} onChange={e => setNewStepTitle(e.target.value)} placeholder="Nova etapa (título)..." />
                                    <Button type="button" onClick={handleAddStep} variant="secondary">Add</Button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" type="button" onClick={resetForm}>Cancelar</Button>
                                <Button type="submit" disabled={isSubmitting}><Save className="mr-2 h-4 w-4" /> Salvar</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {!isCreating && (
                <div className="grid gap-4">
                    {templates.map(t => (
                        <Card key={t._id}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-16 rounded-full self-stretch" style={{ backgroundColor: t.color || '#ddd' }}></div>
                                    <div>
                                        <h4 className="font-bold">{t.name}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-1">{t.description}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="outline">{t.category}</Badge>
                                            <Badge variant="secondary">+{t.points} pts</Badge>
                                            {t.dependencies?.length > 0 && <Badge variant="destructive" className="flex gap-1"><Lock className="h-3 w-3" /> {t.dependencies.length} req</Badge>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(t)}><Edit className="h-4 w-4" /></Button>
                                    <Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskTemplateManagement;
