import { ChatbotPage } from "./ChatbotPage";
import { getUrlParam } from "./utils/urlParams";

interface MessagesProps {
    unitId?: string;
}

const Messages = ({ unitId = '#BR#ALL#SYSTEM#0001' }: MessagesProps) => {
    // Extrair unitId da URL ou usar padrão
    const urlUnitId = getUrlParam("unitId") || undefined;
    const defaultUnitId = urlUnitId || unitId;

    return (
        <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl h-[calc(100vh-6rem)] bg-background rounded-xl overflow-hidden shadow-2xl border border-border">
                <ChatbotPage defaultUnitId={defaultUnitId} />
            </div>
        </div>
    );
};

export default Messages;