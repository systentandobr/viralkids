import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CohortData {
  cohort: string; // Período de aquisição (ex: "Jan 2024")
  customers: number;
  month0: number; // Retenção no mês 0
  month1: number;
  month2: number;
  month3: number;
  month6: number;
  month12: number;
}

interface CohortTableProps {
  data: CohortData[];
}

export const CohortTable: React.FC<CohortTableProps> = ({ data }) => {
  const getRetentionColor = (value: number) => {
    if (value >= 80) return 'bg-green-500/20 text-green-600';
    if (value >= 60) return 'bg-yellow-500/20 text-yellow-600';
    if (value >= 40) return 'bg-orange-500/20 text-orange-600';
    return 'bg-red-500/20 text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Coortes</CardTitle>
        <CardDescription>
          Taxa de retenção e engajamento de clientes por período de aquisição
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead className="text-right">Clientes</TableHead>
                <TableHead className="text-right">Mês 0</TableHead>
                <TableHead className="text-right">Mês 1</TableHead>
                <TableHead className="text-right">Mês 2</TableHead>
                <TableHead className="text-right">Mês 3</TableHead>
                <TableHead className="text-right">Mês 6</TableHead>
                <TableHead className="text-right">Mês 12</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((cohort, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{cohort.cohort}</TableCell>
                  <TableCell className="text-right">{cohort.customers}</TableCell>
                  <TableCell className={`text-right font-semibold ${getRetentionColor(cohort.month0)}`}>
                    {cohort.month0.toFixed(1)}%
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getRetentionColor(cohort.month1)}`}>
                    {cohort.month1.toFixed(1)}%
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getRetentionColor(cohort.month2)}`}>
                    {cohort.month2.toFixed(1)}%
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getRetentionColor(cohort.month3)}`}>
                    {cohort.month3.toFixed(1)}%
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getRetentionColor(cohort.month6)}`}>
                    {cohort.month6.toFixed(1)}%
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getRetentionColor(cohort.month12)}`}>
                    {cohort.month12.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Valores representam a taxa de retenção (%) de clientes que continuam ativos em cada período.</p>
        </div>
      </CardContent>
    </Card>
  );
};

