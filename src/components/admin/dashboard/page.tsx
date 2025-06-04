"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleAdminLayout } from "@/components/simple-admin-layout"
import { Users, Star, MessageSquare, Building2 } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const stats = [
    { title: "Total Businesses", value: "156", icon: Building2, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Total Reviews", value: "2,847", icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Average Rating", value: "4.2", icon: Star, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Total Users", value: "1,234", icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
  ]

  const recentLogins = [
    { business: "Pizza Palace", owner: "John Smith", time: "2 min ago", email: "john@pizzapalace.com" },
    { business: "Tech Solutions", owner: "Sarah Johnson", time: "15 min ago", email: "sarah@techsolutions.com" },
    { business: "Coffee Corner", owner: "Mike Davis", time: "1 hour ago", email: "mike@coffeecorner.com" },
    { business: "Auto Repair Pro", owner: "Lisa Wilson", time: "2 hours ago", email: "lisa@autorepairpro.com" },
    { business: "Beauty Salon", owner: "Emma Brown", time: "3 hours ago", email: "emma@beautysalon.com" },
  ]

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <SimpleAdminLayout>
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Overview of your ReviewUplift platform</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={item}>
              <Card 
                className={`border border-orange-200 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 ${stat.bg}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">{stat.title}</CardTitle>
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-800">{stat.value}</div>
                  <div className="mt-2 h-1 bg-gradient-to-r from-orange-300 to-orange-100 rounded-full"></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Logins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border border-orange-200 shadow-md transition-all hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-white rounded-t-lg">
              <CardTitle className="text-xl font-bold text-orange-800">Recent Business Logins</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {recentLogins.map((login, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-all duration-200 border-b border-orange-100 last:border-b-0"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-medium group">
                          <span className="group-hover:text-orange-600 transition-colors">
                            {login.business}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">{login.owner}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{login.email}</p>
                      <p className="text-xs text-orange-500 font-medium">{login.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SimpleAdminLayout>
  )
}