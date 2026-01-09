import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Define o formato dos dados que o gráfico espera
interface ChartData {
  horario: string;
  temp: number;
  ph: number;
  turbidez: number;
}

interface ChartCardProps {
  data: ChartData[]; // Recebe os dados via props
}

export const ChartCard = ({ data }: ChartCardProps) => {
  return (
    <Card className="col-span-1 lg:col-span-2 h-[400px]">
      <CardHeader>
        <CardTitle>Histórico de Monitoramento</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="horario" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            {/* Eixo Esquerdo: Temperatura e Turbidez (0 a 40) */}
            <YAxis 
              yAxisId="left" 
              domain={[0, 40]} 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Temp / NTU', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[6, 8.5]} // Escala para pH
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'pH', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            
            {/* Linha de Temperatura (Verde/Azul) */}
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="temp" 
              name="Temperatura"
              stroke="#22c55e" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />

            {/* Linha de pH (Laranja) */}
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="ph" 
              name="pH"
              stroke="#f97316" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />

            {/* NOVA LINHA: Turbidez (Azul) */}
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="turbidez" 
              name="Turbidez (NTU)"
              stroke="#3b82f6" // Azul
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};