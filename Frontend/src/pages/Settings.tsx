import Layout from "@/components/layout/Layout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  // Example state - replace with your actual state management
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    alertThreshold: 5000, // ms
    monitoringFrequency: 5, // minutes
    darkMode: false,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings logic here
    console.log("Settings saved:", settings);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <Button onClick={handleSubmit}>Save Settings</Button>
        </div>

        <div className="space-y-8">
          {/* Monitoring Configuration */}
          <div className="rounded-lg border p-6 space-y-6">
            <h2 className="text-lg font-medium">Monitoring Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="monitoringFrequency">Check Frequency</Label>
                <Select 
                  value={settings.monitoringFrequency.toString()}
                  onValueChange={(value) => setSettings({...settings, monitoringFrequency: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Every minute</SelectItem>
                    <SelectItem value="5">Every 5 minutes</SelectItem>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertThreshold">Response Time Threshold (ms)</Label>
                <Input
                  id="alertThreshold"
                  name="alertThreshold"
                  type="number"
                  value={settings.alertThreshold}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="rounded-lg border p-6 space-y-6">
            <h2 className="text-lg font-medium">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via text message
                  </p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="rounded-lg border p-6 space-y-6">
            <h2 className="text-lg font-medium">System Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark theme
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily pause all monitoring
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-lg border border-red-200 p-6 space-y-4 bg-red-50">
            <h2 className="text-lg font-medium text-red-800">Danger Zone</h2>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <Label className="text-red-800" htmlFor="deleteAccount">
                  Delete All Monitoring Data
                </Label>
                <p className="text-sm text-red-600">
                  This will permanently delete all your website monitoring history
                </p>
              </div>
              <Button variant="destructive">Delete Data</Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <Label className="text-red-800" htmlFor="deleteAccount">
                  Delete Account
                </Label>
                <p className="text-sm text-red-600">
                  This will permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;