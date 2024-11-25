import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

const areaChartData = [
  { date: "Mon", declined: 45, fraud: 15, expired: 25 },
  { date: "Tue", declined: 35, fraud: 20, expired: 15 },
  { date: "Wed", declined: 55, fraud: 10, expired: 30 },
  { date: "Thu", declined: 40, fraud: 25, expired: 20 },
  { date: "Fri", declined: 50, fraud: 15, expired: 25 },
  { date: "Sat", declined: 30, fraud: 20, expired: 15 },
  { date: "Sun", declined: 45, fraud: 30, expired: 20 },
];

const radialData = [
  {
    name: "Success Rate",
    value: 85,
    fill: "hsl(263.4, 70%, 50.4%)", // primary
  },
  {
    name: "Recovery Rate",
    value: 65,
    fill: "hsl(280, 65%, 60%)", // chart-4
  },
  {
    name: "Retention",
    value: 75,
    fill: "hsl(340, 75%, 55%)", // chart-5
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function AdvancedFeatures() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-24 px-4 md:px-6 lg:px-8"
    >
      <div className="container mx-auto">
        <motion.h2
          variants={itemVariants} 
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400"
        >
          Advanced Analytics
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={itemVariants}>
            <Card className="bg-background/5 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-white">Payment Error Trends</CardTitle>
                <CardDescription className="text-gray-400">
                  Weekly breakdown of error types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaChartData}>
                      <defs>
                        <linearGradient id="colorDeclined" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(263.4, 70%, 50.4%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(263.4, 70%, 50.4%)" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(280, 65%, 60%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(280, 65%, 60%)" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorExpired" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(340, 75%, 55%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(340, 75%, 55%)" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 27.9%, 16.9%)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(217.9, 10.6%, 64.9%)"
                        tick={{ fill: "hsl(217.9, 10.6%, 64.9%)" }}
                      />
                      <YAxis 
                        stroke="hsl(217.9, 10.6%, 64.9%)"
                        tick={{ fill: "hsl(217.9, 10.6%, 64.9%)" }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(224, 71.4%, 4.1%)",
                          border: "1px solid hsl(215, 27.9%, 16.9%)",
                          borderRadius: "8px",
                          color: "hsl(210, 20%, 98%)"
                        }}
                      />
                      <Legend 
                        wrapperStyle={{
                          color: "hsl(217.9, 10.6%, 64.9%)"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="declined"
                        name="Card Declined"
                        stroke="hsl(263.4, 70%, 50.4%)"
                        fillOpacity={1}
                        fill="url(#colorDeclined)"
                      />
                      <Area
                        type="monotone"
                        dataKey="fraud"
                        name="Fraud"
                        stroke="hsl(280, 65%, 60%)"
                        fillOpacity={1}
                        fill="url(#colorFraud)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expired"
                        name="Expired"
                        stroke="hsl(340, 75%, 55%)"
                        fillOpacity={1}
                        fill="url(#colorExpired)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-background/5 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
                <CardDescription className="text-gray-400">
                  Key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="20%"
                      outerRadius="90%"
                      data={radialData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        minAngle={15}
                        background={{ fill: "hsl(215, 27.9%, 16.9%)" }}
                        clockWise={true}
                        dataKey="value"
                        cornerRadius={12}
                      />
                      <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                          color: "hsl(217.9, 10.6%, 64.9%)"
                        }}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: "hsl(224, 71.4%, 4.1%)",
                          border: "1px solid hsl(215, 27.9%, 16.9%)",
                          borderRadius: "8px",
                          color: "hsl(210, 20%, 98%)"
                        }}
                        formatter={(value) => [`${value}%`]}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}