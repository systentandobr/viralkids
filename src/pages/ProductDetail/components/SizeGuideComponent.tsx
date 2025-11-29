import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SizeGuide, SizeChart, SizeGuideProps } from '../types/product-detail.types';
import { Ruler, Smartphone, Hand, Info, ChevronDown, ChevronUp } from 'lucide-react';

// Componente de régua eletrônica
const ElectronicRuler: React.FC<{
  selectedSize?: string;
  sizeChart?: SizeChart;
  onCalibrate: (calibration: number) => void;
}> = ({ selectedSize, sizeChart, onCalibrate }) => {
  const [calibration, setCalibration] = useState(1); // pixels por cm
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [measurementMode, setMeasurementMode] = useState<'phone' | 'card' | 'coin'>('phone');
  const rulerRef = useRef<HTMLDivElement>(null);

  // Referências de objetos para calibração
  const referenceObjects = {
    phone: { name: 'Smartphone (iPhone)', size: 14.7 }, // cm
    card: { name: 'Cartão de Crédito', size: 8.56 }, // cm
    coin: { name: 'Moeda de R$ 1,00', size: 2.7 } // cm
  };

  const handleCalibration = () => {
    const selectedObject = referenceObjects[measurementMode];
    // Simulação - em um caso real, seria necessário medir o objeto na tela
    const measuredPixels = 100; // Placeholder
    const pixelsPerCm = measuredPixels / selectedObject.size;
    setCalibration(pixelsPerCm);
    onCalibrate(pixelsPerCm);
    setIsCalibrating(false);
  };

  const renderMeasurement = (label: string, value?: number, unit: string = 'cm') => {
    if (!value) return null;
    
    const pixels = value * calibration;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-700">{label}</span>
          <span className="text-base text-gray-600">{value} {unit}</span>
        </div>
        
        {/* Régua visual */}
        <div className="relative bg-gray-100 rounded-md p-2">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-4 rounded relative"
            style={{ width: `${Math.min(pixels, 300)}px` }}
          >
            {/* Marcadores de medida */}
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <div className="w-0.5 h-6 bg-white/80 -mt-1"></div>
              <div className="w-0.5 h-6 bg-white/80 -mt-1"></div>
            </div>
          </div>
          
          {/* Indicador de escala */}
          <div className="absolute -bottom-1 left-0 text-sm text-gray-500">
            0
          </div>
          <div className="absolute -bottom-1 text-sm text-gray-500" style={{ left: `${Math.min(pixels, 300)}px` }}>
            {value} {unit}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ruler className="h-5 w-5 text-primary" />
          Régua Eletrônica
          <Badge variant="secondary" className="text-sm">BETA</Badge>
        </CardTitle>
        <p className="text-base text-gray-600">
          Visualize as medidas reais do produto na sua tela
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Calibração */}
        {!calibration || calibration === 1 ? (
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-base font-medium text-blue-900">
                Calibração necessária
              </span>
            </div>
            
            <p className="text-base text-blue-800">
              Para medidas precisas, calibre a régua usando um objeto de referência:
            </p>
            
            <div className="flex gap-2">
              <Button
                variant={measurementMode === 'phone' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMeasurementMode('phone')}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                Celular
              </Button>
              <Button
                variant={measurementMode === 'card' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMeasurementMode('card')}
              >
                💳 Cartão
              </Button>
              <Button
                variant={measurementMode === 'coin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMeasurementMode('coin')}
              >
                🪙 Moeda
              </Button>
            </div>
            
            <div className="text-sm text-blue-700">
              Coloque seu {referenceObjects[measurementMode].name.toLowerCase()} na tela e ajuste:
            </div>
            
            <Button onClick={handleCalibration} size="sm" className="w-full">
              Calibrar ({referenceObjects[measurementMode].size} cm)
            </Button>
          </div>
        ) : (
          /* Medidas do produto */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-green-700">
                ✓ Régua calibrada
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCalibration(1)}
                className="text-sm"
              >
                Recalibrar
              </Button>
            </div>
            
            {selectedSize && sizeChart && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Medidas - Tamanho {selectedSize}
                </h4>
                
                {renderMeasurement('Peito/Tórax', sizeChart.chest)}
                {renderMeasurement('Cintura', sizeChart.waist)}
                {renderMeasurement('Quadril', sizeChart.hips)}
                {renderMeasurement('Comprimento', sizeChart.length)}
                {renderMeasurement('Manga', sizeChart.sleeve)}
                {renderMeasurement('Pé', sizeChart.foot)}
                {renderMeasurement('Cabeça', sizeChart.head)}
              </div>
            )}
          </div>
        )}
        
        {/* Dicas */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600 space-y-1">
            <div>💡 <strong>Dica:</strong> Meça suas roupas favoritas para comparar</div>
            <div>📱 Mantenha a tela perpendicular para medidas precisas</div>
            <div>📏 As medidas são aproximadas - consulte a tabela completa</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal do guia de tamanhos
export const SizeGuideComponent: React.FC<SizeGuideProps> = ({
  sizeGuide,
  selectedSize,
  onSizeSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [calibration, setCalibration] = useState(1);
  const [activeTab, setActiveTab] = useState<'table' | 'ruler' | 'tips'>('table');

  if (!sizeGuide) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-400 text-4xl mb-2">📏</div>
          <p className="text-gray-600">Guia de tamanhos não disponível</p>
        </CardContent>
      </Card>
    );
  }

  const selectedSizeData = sizeGuide.sizes.find(size => size.size === selectedSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Guia de Tamanhos
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 text-base font-medium border-b-2 transition-colors ${
            activeTab === 'table'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('table')}
        >
          Tabela de Medidas
        </button>
        <button
          className={`px-4 py-2 text-base font-medium border-b-2 transition-colors ${
            activeTab === 'ruler'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('ruler')}
        >
          Régua Eletrônica
        </button>
        <button
          className={`px-4 py-2 text-base font-medium border-b-2 transition-colors ${
            activeTab === 'tips'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('tips')}
        >
          Como Medir
        </button>
      </div>

      {/* Conteúdo das tabs */}
      {activeTab === 'table' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-900">Tamanho</th>
                    {sizeGuide.sizes[0]?.chest && <th className="px-4 py-3 text-center font-medium text-gray-900">Peito (cm)</th>}
                    {sizeGuide.sizes[0]?.waist && <th className="px-4 py-3 text-center font-medium text-gray-900">Cintura (cm)</th>}
                    {sizeGuide.sizes[0]?.hips && <th className="px-4 py-3 text-center font-medium text-gray-900">Quadril (cm)</th>}
                    {sizeGuide.sizes[0]?.length && <th className="px-4 py-3 text-center font-medium text-gray-900">Comprimento (cm)</th>}
                    {sizeGuide.sizes[0]?.age && <th className="px-4 py-3 text-center font-medium text-gray-900">Idade</th>}
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.sizes.map((size, index) => (
                    <tr
                      key={size.size}
                      className={`
                        border-b transition-colors cursor-pointer
                        ${selectedSize === size.size 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'hover:bg-gray-50'
                        }
                      `}
                      onClick={() => onSizeSelect(size.size)}
                    >
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {size.size}
                          {selectedSize === size.size && (
                            <Badge variant="default" className="text-sm">Selecionado</Badge>
                          )}
                        </div>
                      </td>
                      {size.chest && <td className="px-4 py-3 text-center">{size.chest}</td>}
                      {size.waist && <td className="px-4 py-3 text-center">{size.waist}</td>}
                      {size.hips && <td className="px-4 py-3 text-center">{size.hips}</td>}
                      {size.length && <td className="px-4 py-3 text-center">{size.length}</td>}
                      {size.age && <td className="px-4 py-3 text-center">{size.age}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'ruler' && (
        <ElectronicRuler
          selectedSize={selectedSize}
          sizeChart={selectedSizeData}
          onCalibrate={setCalibration}
        />
      )}

      {activeTab === 'tips' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h4 className="font-medium text-gray-900">Como tirar medidas corretas</h4>
            
            <div className="space-y-3">
              {sizeGuide.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-base font-medium text-primary">
                    {index + 1}
                  </div>
                  <p className="text-base text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>

            {sizeGuide.videoUrl && (
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  📹 Ver vídeo explicativo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};