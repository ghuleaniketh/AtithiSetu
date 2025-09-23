import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Dashboard from '@/components/Dashboard';
import SafeTourMap from '@/components/SafeTourMap';
import { 
  Shield, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Navigation, 
  Phone, 
  Clock,
  CheckCircle,
  Globe,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

type UserRole = 'traveler' | 'admin' | 'friend' | null;

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    setCurrentView('dashboard');
  };

  if (currentView === 'dashboard' && userRole) {
    return <Dashboard userRole={userRole} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-info/5 to-safe/5" />
        <div className="container mx-auto px-6 pt-20 pb-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-info/10 rounded-full">
                <Shield className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-info to-safe bg-clip-text text-transparent">
              SafeTour
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Real-time safety monitoring and location tracking for travelers, 
              with comprehensive dashboards for friends and authorities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="xl"
                variant="hero"
                onClick={() => handleRoleSelect('traveler')}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Start as Traveler
              </Button>
              <Button 
                size="xl"
                variant="outline"
                onClick={() => handleRoleSelect('admin')}
              >
                <Shield className="w-5 h-5 mr-2" />
                Admin Dashboard
              </Button>
              <Button 
                size="xl"
                variant="outline"
                onClick={() => handleRoleSelect('friend')}
              >
                <Users className="w-5 h-5 mr-2" />
                Friend Network
              </Button>
            </div>
          </div>

          {/* Demo Map */}
          <div className="max-w-5xl mx-auto">
            <SafeTourMap height="h-[500px]" showControls={true} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Safety Ecosystem
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitor, track, and respond to travel situations with real-time maps, 
              alerts, and peer-to-peer networking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-full w-fit">
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Real-Time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Live location updates with route comparison between planned vs actual paths. 
                  Instant alerts for deviations from safe routes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="p-3 bg-danger/10 rounded-full w-fit">
                  <AlertTriangle className="w-6 h-6 text-danger" />
                </div>
                <CardTitle>Smart Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Color-coded risk zones with automated alerts for high-risk areas. 
                  Instant notifications to friends and authorities when needed.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="p-3 bg-safe/10 rounded-full w-fit">
                  <Users className="w-6 h-6 text-safe" />
                </div>
                <CardTitle>Friend Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mesh network for peer-to-peer location sharing. Stay connected 
                  with your travel circle both online and offline.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="p-3 bg-info/10 rounded-full w-fit">
                  <Globe className="w-6 h-6 text-info" />
                </div>
                <CardTitle>Offline Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cached map tiles and queued updates ensure functionality 
                  even without internet connection. Critical for remote areas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="p-3 bg-caution/10 rounded-full w-fit">
                  <Shield className="w-6 h-6 text-caution" />
                </div>
                <CardTitle>Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive monitoring for authorities with all active travelers, 
                  unacknowledged alerts, and response coordination.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-full w-fit">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Mobile Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Optimized for mobile devices with native map integration, 
                  GPS tracking, and push notifications for instant alerts.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-safe/10 rounded-full">
                <CheckCircle className="w-8 h-8 text-safe" />
              </div>
              <h3 className="font-semibold mb-1">24 Active</h3>
              <p className="text-sm text-muted-foreground">Safe Travelers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-caution/10 rounded-full">
                <AlertTriangle className="w-8 h-8 text-caution" />
              </div>
              <h3 className="font-semibold mb-1">3 Alerts</h3>
              <p className="text-sm text-muted-foreground">Need Attention</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-info/10 rounded-full">
                <Wifi className="w-8 h-8 text-info" />
              </div>
              <h3 className="font-semibold mb-1">18 Online</h3>
              <p className="text-sm text-muted-foreground">Friends Connected</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-muted/10 rounded-full">
                <WifiOff className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">6 Offline</h3>
              <p className="text-sm text-muted-foreground">Queued Updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-info/5 to-safe/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Travel Safer?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the SafeTour network and experience peace of mind with real-time 
            safety monitoring and instant emergency response.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl"
              variant="hero"
              onClick={() => handleRoleSelect('traveler')}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
            <Button 
              size="xl"
              variant="emergency"
            >
              <Phone className="w-5 h-5 mr-2" />
              Emergency Hotline
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/20 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">SafeTour</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Real-time Safety Monitoring</span>
              <span>•</span>
              <span>End-to-End Encrypted</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;