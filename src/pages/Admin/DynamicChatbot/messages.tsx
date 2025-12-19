import { useState, useEffect } from "react";
import { ChatbotPage } from "./ChatbotPage";
import { getUrlParam } from "./utils/urlParams";

interface MessagesProps {
    unitId?: string;
}

const Messages = ({ unitId = '#BR#ALL#SYSTEM#0001' }: MessagesProps) => {
    // Estado para reagir a mudanças no hash
    const [currentUnitId, setCurrentUnitId] = useState<string>(() => {
        const urlUnitId = getUrlParam("unitId");
        return urlUnitId || unitId;
    });

    // Atualizar unitId quando o hash mudar
    useEffect(() => {
        const handleHashChange = () => {
            const urlUnitId = getUrlParam("unitId");
            const newUnitId = urlUnitId || unitId;
            console.log('Hash changed - urlUnitId:', urlUnitId, 'newUnitId:', newUnitId);
            if (newUnitId !== currentUnitId) {
                setCurrentUnitId(newUnitId);
            }
        };

        // Verificar mudanças no hash
        window.addEventListener('hashchange', handleHashChange);
        
        // Verificar também na montagem inicial (caso o hash mude sem disparar evento)
        handleHashChange();

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [unitId, currentUnitId]);

    console.log('Rendering Messages with unitId:', currentUnitId);

    return (
        <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl h-[calc(100vh-6rem)] bg-background rounded-xl overflow-hidden shadow-2xl border border-border">
                <ChatbotPage key={currentUnitId} defaultUnitId={currentUnitId} />
            </div>
        </div>
    );
};

export default Messages;