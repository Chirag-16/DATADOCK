
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceMetric } from "@/services/websiteService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PerformanceChartProps {
  data: PerformanceMetric[];
  title: string;
  description: string;
}

export default function PerformanceChart({ data, title, description }: PerformanceChartProps) {
  const [timespan, setTimespan] = useState<"6h" | "12h" | "24h">("24h");
  
  // Filter data based on timespan
  const getFilteredData = () => {
    const hoursToShow = timespan === "6h" ? 6 : timespan === "12h" ? 12 : 24;
    const startIndex = data.length - hoursToShow;
    return data.slice(startIndex > 0 ? startIndex : 0);
  };
  
  const filteredData = getFilteredData();
  
  // Format data for recharts
  const chartData = filteredData.map((item) => {
    const date = new Date(item.timestamp);
    return {
      time: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
      value: item.value,
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex gap-1">
          <Button 
            variant={timespan === "6h" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimespan("6h")}
          >
            6h
          </Button>
          <Button 
            variant={timespan === "12h" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimespan("12h")}
          >
            12h
          </Button>
          <Button 
            variant={timespan === "24h" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimespan("24h")}
          >
            24h
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
