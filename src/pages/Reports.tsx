import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download, Calendar, TrendingUp, Users, Laptop, Bike } from "lucide-react";

const weeklyData = [
  { name: "T2", laptops: 2, motorbikes: 0, students: 3, donors: 2 },
  { name: "T3", laptops: 1, motorbikes: 1, students: 2, donors: 1 },
  { name: "T4", laptops: 3, motorbikes: 0, students: 4, donors: 3 },
  { name: "T5", laptops: 2, motorbikes: 1, students: 2, donors: 2 },
  { name: "T6", laptops: 4, motorbikes: 0, students: 5, donors: 4 },
  { name: "T7", laptops: 1, motorbikes: 1, students: 3, donors: 1 },
  { name: "CN", laptops: 0, motorbikes: 0, students: 1, donors: 0 },
];

const monthlyTrend = [
  { name: "T8", value: 12 },
  { name: "T9", value: 18 },
  { name: "T10", value: 25 },
  { name: "T11", value: 22 },
  { name: "T12", value: 30 },
  { name: "T1", value: 28 },
];

const distributionData = [
  { name: "Laptop", value: 45, color: "hsl(25, 95%, 53%)" },
  { name: "Xe máy", value: 15, color: "hsl(174, 60%, 40%)" },
  { name: "Học phí", value: 25, color: "hsl(142, 76%, 36%)" },
  { name: "Linh kiện", value: 15, color: "hsl(45, 93%, 47%)" },
];

const summaryStats = [
  { label: "Tổng hỗ trợ tuần này", value: "23", change: "+15%", icon: TrendingUp },
  { label: "Sinh viên mới", value: "12", change: "+8%", icon: Users },
  { label: "Laptop đã tặng", value: "8", change: "+20%", icon: Laptop },
  { label: "Xe máy đã tặng", value: "2", change: "+100%", icon: Bike },
];

export default function Reports() {
  return (
    <MainLayout title="Báo cáo" description="Thống kê và báo cáo hoạt động">
      {/* Summary Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat, index) => (
          <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success">{stat.change} so với tuần trước</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="weekly">Tuần</TabsTrigger>
            <TabsTrigger value="monthly">Tháng</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" /> Chọn khoảng thời gian
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Activity Chart */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Hoạt động trong tuần</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="laptops" name="Laptop" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="students" name="Sinh viên" fill="hsl(174, 60%, 40%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribution Chart */}
            <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle>Phân bố hỗ trợ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  {distributionData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle>Xu hướng hỗ trợ 6 tháng qua</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Lượt hỗ trợ"
                      stroke="hsl(25, 95%, 53%)"
                      strokeWidth={3}
                      dot={{ fill: "hsl(25, 95%, 53%)", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo chi tiết tuần này</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Đang phát triển...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo chi tiết tháng này</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Đang phát triển...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
