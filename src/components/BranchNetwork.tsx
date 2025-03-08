import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MapPin, Users, TrendingUp, TrendingDown, Building, Award, GitBranch, ChevronDown, ChevronUp, View, Box } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BranchNetwork3D from './BranchNetwork3D';

interface BranchNetworkProps {
  selectedBank: string;
}

const branchData = {
  'SBIN.NS': {
    urban: 6200,
    semiUrban: 7300,
    rural: 8500,
    metro: 3800,
    // Additional data
    atms: 58700,
    digitalKiosks: 7850,
    intlBranches: 229,
    branchEfficiency: {
      high: 45,
      medium: 35,
      low: 20
    },
    branchGrowth: [
      { year: '2021', branches: 22400 },
      { year: '2022', branches: 22950 },
      { year: '2023', branches: 24100 },
      { year: '2024', branches: 25800 }
    ],
    topRegions: [
      { name: 'Maharashtra', branches: 3250 },
      { name: 'Uttar Pradesh', branches: 2980 },
      { name: 'Tamil Nadu', branches: 2540 },
      { name: 'Karnataka', branches: 2320 },
      { name: 'West Bengal', branches: 1890 }
    ]
  },
  'AXISBANK.NS': {
    urban: 5100,
    semiUrban: 4700,
    rural: 4200,
    metro: 2900,
    // Additional data
    atms: 32800,
    digitalKiosks: 5430,
    intlBranches: 102,
    branchEfficiency: {
      high: 52,
      medium: 33,
      low: 15
    },
    branchGrowth: [
      { year: '2021', branches: 15600 },
      { year: '2022', branches: 16200 },
      { year: '2023', branches: 16900 },
      { year: '2024', branches: 17900 }
    ],
    topRegions: [
      { name: 'Maharashtra', branches: 2150 },
      { name: 'Karnataka', branches: 1890 },
      { name: 'Gujarat', branches: 1740 },
      { name: 'Delhi NCR', branches: 1620 },
      { name: 'Tamil Nadu', branches: 1520 }
    ]
  },
  'HDFCBANK.NS': {
    urban: 6800,
    semiUrban: 5500,
    rural: 5200,
    metro: 3400,
    // Additional data
    atms: 45200,
    digitalKiosks: 9860,
    intlBranches: 185,
    branchEfficiency: {
      high: 58,
      medium: 30,
      low: 12
    },
    branchGrowth: [
      { year: '2021', branches: 19200 },
      { year: '2022', branches: 19900 },
      { year: '2023', branches: 20900 },
      { year: '2024', branches: 21900 }
    ],
    topRegions: [
      { name: 'Maharashtra', branches: 2980 },
      { name: 'Karnataka', branches: 2340 },
      { name: 'Gujarat', branches: 2120 },
      { name: 'Tamil Nadu', branches: 1960 },
      { name: 'Delhi NCR', branches: 1780 }
    ]
  },
  'KOTAKBANK.NS': {
    urban: 4500,
    semiUrban: 3800,
    rural: 3200,
    metro: 2500,
    // Additional data
    atms: 27600,
    digitalKiosks: 4350,
    intlBranches: 78,
    branchEfficiency: {
      high: 50,
      medium: 35,
      low: 15
    },
    branchGrowth: [
      { year: '2021', branches: 12800 },
      { year: '2022', branches: 13400 },
      { year: '2023', branches: 13900 },
      { year: '2024', branches: 14000 }
    ],
    topRegions: [
      { name: 'Maharashtra', branches: 1890 },
      { name: 'Gujarat', branches: 1620 },
      { name: 'Karnataka', branches: 1450 },
      { name: 'Delhi NCR', branches: 1320 },
      { name: 'Tamil Nadu', branches: 1180 }
    ]
  },
  'ICICIBANK.NS': {
    urban: 5900,
    semiUrban: 5200,
    rural: 5800,
    metro: 3300,
    // Additional data
    atms: 38900,
    digitalKiosks: 7230,
    intlBranches: 156,
    branchEfficiency: {
      high: 54,
      medium: 32,
      low: 14
    },
    branchGrowth: [
      { year: '2021', branches: 18600 },
      { year: '2022', branches: 19300 },
      { year: '2023', branches: 20100 },
      { year: '2024', branches: 20200 }
    ],
    topRegions: [
      { name: 'Maharashtra', branches: 2620 },
      { name: 'Gujarat', branches: 2140 },
      { name: 'Karnataka', branches: 1980 },
      { name: 'Tamil Nadu', branches: 1860 },
      { name: 'Uttar Pradesh', branches: 1720 }
    ]
  }
};

const BranchNetwork = ({ selectedBank }: BranchNetworkProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [view3D, setView3D] = useState(false);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const EFFICIENCY_COLORS = ['#4ade80', '#facc15', '#f87171'];
  
  const getBranchDistribution = () => {
    const data = branchData[selectedBank];
    return [
      { name: 'Urban', value: data.urban },
      { name: 'Semi-Urban', value: data.semiUrban },
      { name: 'Rural', value: data.rural },
      { name: 'Metro', value: data.metro },
    ];
  };

  const getEfficiencyData = () => {
    const data = branchData[selectedBank].branchEfficiency;
    return [
      { name: 'High Efficiency', value: data.high },
      { name: 'Medium Efficiency', value: data.medium },
      { name: 'Low Efficiency', value: data.low },
    ];
  };

  const branchDistribution = getBranchDistribution();
  const efficiencyData = getEfficiencyData();
  const bankData = branchData[selectedBank];
  const totalBranches = branchDistribution.reduce((sum, item) => sum + item.value, 0);

  const toggleView = () => {
    setView3D(!view3D);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Branch Network
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of branch distribution and performance
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleView}
              className="gap-1"
            >
              {view3D ? (
                <>2D View <View className="h-4 w-4" /></>
              ) : (
                <>3D View <Box className="h-4 w-4" /></>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDetails(!showDetails)}
              className="gap-1"
            >
              {showDetails ? (
                <>Less Details <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>More Details <ChevronDown className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view3D ? (
          <BranchNetwork3D 
            branchData={bankData} 
            totalBranches={totalBranches} 
          />
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-around">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={branchDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {branchDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} branches`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col space-y-2 text-center md:text-left mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">{totalBranches.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total branches nationwide</div>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                {branchDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <div className="text-sm">
                      <span className="font-medium">{item.name}:</span> {Math.round((item.value / totalBranches) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showDetails && (
          <div className="mt-8">
            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                <TabsTrigger value="growth">Growth Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg flex flex-col items-center">
                    <Users className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-600">ATMs</span>
                    <span className="text-2xl font-bold text-blue-900">{bankData.atms.toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg flex flex-col items-center">
                    <GitBranch className="h-8 w-8 text-emerald-600 mb-2" />
                    <span className="text-sm text-gray-600">Digital Kiosks</span>
                    <span className="text-2xl font-bold text-emerald-900">{bankData.digitalKiosks.toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg flex flex-col items-center">
                    <Award className="h-8 w-8 text-amber-600 mb-2" />
                    <span className="text-sm text-gray-600">International Branches</span>
                    <span className="text-2xl font-bold text-amber-900">{bankData.intlBranches}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Top 5 Regions by Branch Count</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={bankData.topRegions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="branches" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="efficiency" className="space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-around">
                  <div className="h-[200px] w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={efficiencyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {efficiencyData.map((entry, index) => (
                            <Cell key={`efficiency-cell-${index}`} fill={EFFICIENCY_COLORS[index % EFFICIENCY_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <h4 className="font-medium text-gray-800">Branch Efficiency Metrics</h4>
                    <p className="text-gray-600">Branch efficiency is measured based on:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Customer throughput per day</li>
                      <li>Transaction processing time</li>
                      <li>Revenue per employee</li>
                      <li>Digital adoption rate</li>
                      <li>Customer satisfaction score</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="growth" className="space-y-4">
                <h4 className="font-medium text-gray-800 mb-3">Branch Network Growth (2021-2024)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={bankData.branchGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="branches" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <h5 className="font-medium text-indigo-900">Growth Analysis</h5>
                  </div>
                  <p className="text-sm text-indigo-700 mt-2">
                    Annual growth rate: {(((bankData.branchGrowth[3].branches / bankData.branchGrowth[0].branches) ** (1/3) - 1) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-indigo-700">
                    Focus regions for expansion: North-East, Western India, and Tier-3 cities
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BranchNetwork;
