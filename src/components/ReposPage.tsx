import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, FileText, Settings, Users } from 'lucide-react';

const ReposPage: React.FC = () => {
  const repoSections = [
    {
      title: 'Data Management',
      icon: Database,
      description: 'Repository for managing auction data, backups, and exports',
      items: ['Data Export Tools', 'Backup Management', 'Data Migration'],
    },
    {
      title: 'Reports & Analytics',
      icon: FileText,
      description: 'Generate and manage various auction reports',
      items: ['Sales Reports', 'Client Analytics', 'Performance Metrics'],
    },
    {
      title: 'System Configuration',
      icon: Settings,
      description: 'System settings and configuration management',
      items: ['Exchange Rate Settings', 'Email Templates', 'Notification Rules'],
    },
    {
      title: 'User Management',
      icon: Users,
      description: 'Manage user roles and permissions',
      items: ['User Roles', 'Access Controls', 'Activity Logs'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Repositories</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage system resources, reports, and configuration settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {repoSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.title} className="hover:shadow-lg transition-shadow shadow-sm">
              <CardHeader className="p-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">{section.title}</CardTitle>
                    <p className="text-base text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center text-base text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-4"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200 shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900">Coming Soon</h3>
              <p className="text-base text-blue-700 mt-1">
                Repository features are currently in development. These will include
                advanced data management tools, automated reporting, and system
                configuration options.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReposPage;