import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const TrainingManagement: React.FC = () => {
    const [trainings, setTrainings] = useState<any[]>([]); // Mock list
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('onboarding');
    const [type, setType] = useState('video');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const newTraining = { id: Date.now().toString(), title, description, category, type };
        setTrainings([...trainings, newTraining]);
        setIsCreating(false);
        // Reset form
        setTitle('');
        setDescription('');
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gerenciar Treinamentos</h2>
                <Button onClick={() => setIsCreating(true)}>Novo Treinamento</Button>
            </div>

            {isCreating && (
                <Card className="mb-6">
                    <CardHeader><CardTitle>Novo Treinamento</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Título</Label>
                                    <Input value={title} onChange={e => setTitle(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Categoria</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="onboarding">Onboarding</SelectItem>
                                            <SelectItem value="marketing">Marketing</SelectItem>
                                            <SelectItem value="sales">Vendas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tipo</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="video">Vídeo</SelectItem>
                                            <SelectItem value="pdf">PDF</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descrição</Label>
                                <Textarea value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
                                <Button type="submit">Salvar</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {trainings.map(t => (
                    <Card key={t.id}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold">{t.title}</h4>
                                <p className="text-sm text-gray-500">{t.category} - {t.type}</p>
                            </div>
                            <div>
                                <Button variant="ghost" size="sm">Editar</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {trainings.length === 0 && <p className="text-gray-500 text-center py-8">Nenhum treinamento cadastrado.</p>}
            </div>
        </div>
    );
};

export default TrainingManagement;
