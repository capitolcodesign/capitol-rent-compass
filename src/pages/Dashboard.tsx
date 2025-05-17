
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Building2, 
  FileText, 
  BarChart3, 
  Clock, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for dashboard
  const stats = [
    { name: 'Properties in Database', value: '1,249', icon: Building2, change: '+12%', trend: 'up' },
    { name: 'Completed Studies', value: '847', icon: FileText, change: '+5%', trend: 'up' },
    { name: 'Avg. Rent Increase', value: '3.2%', icon: TrendingUp, change: '-0.5%', trend: 'down' },
    { name: 'Pending Approvals', value: '28', icon: Clock, change: '+3', trend: 'up' },
  ];
  
  const recentStudies = [
    { id: 'RS-2025-042', address: '123 Oak Avenue', date: '2025-05-15', status: 'approved' },
    { id: 'RS-2025-041', address: '456 Elm Street', date: '2025-05-14', status: 'pending' },
    { id: 'RS-2025-040', address: '789 Pine Road', date: '2025-05-13', status: 'approved' },
    { id: 'RS-2025-039', address: '321 Cedar Lane', date: '2025-05-12', status: 'rejected' },
  ];
  
  const areaComparisons = [
    { area: 'Downtown', avgRent: '$1,850', marketRate: '$1,920', percentage: 96 },
    { area: 'Midtown', avgRent: '$1,650', marketRate: '$1,750', percentage: 94 },
    { area: 'North Sacramento', avgRent: '$1,450', marketRate: '$1,520', percentage: 95 },
    { area: 'South Sacramento', avgRent: '$1,350', marketRate: '$1,380', percentage: 98 },
    { area: 'East Sacramento', avgRent: '$1,750', marketRate: '$1,800', percentage: 97 },
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}. Here's what's happening with rent studies.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Download Report</Button>
          <Button>New Analysis</Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full flex items-center
                  ${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stat.trend === 'up' ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-muted-foreground text-sm">{stat.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Studies */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Rent Studies</CardTitle>
            <CardDescription>Latest rent reasonableness analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 font-medium text-sm">ID</th>
                    <th className="text-left pb-3 font-medium text-sm">Property</th>
                    <th className="text-left pb-3 font-medium text-sm">Date</th>
                    <th className="text-left pb-3 font-medium text-sm">Status</th>
                    <th className="text-left pb-3 font-medium text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudies.map((study, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="py-3">{study.id}</td>
                      <td className="py-3">{study.address}</td>
                      <td className="py-3">{study.date}</td>
                      <td className="py-3">
                        {study.status === 'approved' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" /> Approved
                          </span>
                        )}
                        {study.status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </span>
                        )}
                        {study.status === 'rejected' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Area Comparisons */}
        <Card>
          <CardHeader>
            <CardTitle>Area Comparisons</CardTitle>
            <CardDescription>Program rents vs. market rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {areaComparisons.map((area, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{area.area}</span>
                    <span>{area.avgRent} / {area.marketRate}</span>
                  </div>
                  <Progress value={area.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
