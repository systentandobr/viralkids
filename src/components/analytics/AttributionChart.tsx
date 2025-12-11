import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AttributionData {
  touchpoint: string;
  firstTouch: number;
  lastTouch: number;
  linear: number;
  timeDecay: number;
}

interface AttributionChartProps {
  data: AttributionData[];
}

export const AttributionChart: React.FC<AttributionChartProps> = ({ data }) => {
  const maxValue = Math.max(
    ...data.flatMap(d => [d.firstTouch, d.lastTouch, d.linear, d.timeDecay])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atribuição Multi-Touch</CardTitle>
        <CardDescription>
          Distribuição de crédito de conversão entre diferentes pontos de contato
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item, index) => {
            const firstTouchWidth = maxValue > 0 ? (item.firstTouch / maxValue) * 100 : 0;
            const lastTouchWidth = maxValue > 0 ? (item.lastTouch / maxValue) * 100 : 0;
            const linearWidth = maxValue > 0 ? (item.linear / maxValue) * 100 : 0;
            const timeDecayWidth = maxValue > 0 ? (item.timeDecay / maxValue) * 100 : 0;

            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.touchpoint}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      First: {item.firstTouch.toFixed(1)}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Last: {item.lastTouch.toFixed(1)}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Linear: {item.linear.toFixed(1)}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Decay: {item.timeDecay.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-20 text-muted-foreground">First Touch</span>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${firstTouchWidth}%` }}
                      />
                    </div>
                    <span className="text-xs w-12 text-right">{item.firstTouch.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-20 text-muted-foreground">Last Touch</span>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${lastTouchWidth}%` }}
                      />
                    </div>
                    <span className="text-xs w-12 text-right">{item.lastTouch.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-20 text-muted-foreground">Linear</span>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${linearWidth}%` }}
                      />
                    </div>
                    <span className="text-xs w-12 text-right">{item.linear.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-20 text-muted-foreground">Time Decay</span>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-500"
                        style={{ width: `${timeDecayWidth}%` }}
                      />
                    </div>
                    <span className="text-xs w-12 text-right">{item.timeDecay.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">First Touch</div>
              <div className="text-muted-foreground text-xs">
                Crédito total ao primeiro ponto de contato
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Last Touch</div>
              <div className="text-muted-foreground text-xs">
                Crédito total ao último ponto de contato
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Linear</div>
              <div className="text-muted-foreground text-xs">
                Crédito distribuído igualmente entre todos os pontos
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Time Decay</div>
              <div className="text-muted-foreground text-xs">
                Mais crédito aos pontos mais recentes
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

