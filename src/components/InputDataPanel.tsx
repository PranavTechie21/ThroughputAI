import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Upload, Play, RotateCcw } from 'lucide-react';

interface TrainData {
  trainType: string;
  sectionId: string;
  priority: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  platformAvailable: boolean;
  signalStatus: string;
  trackCapacity: number;
  hour: number;
}

interface InputDataPanelProps {
  onPredict: (data: any) => void;
}

export function InputDataPanel({ onPredict }: InputDataPanelProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TrainData>({
    trainType: '',
    sectionId: '',
    priority: 2,
    scheduledArrival: '',
    scheduledDeparture: '',
    platformAvailable: true,
    signalStatus: '',
    trackCapacity: 1,
    hour: new Date().getHours()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const trainTypes = [
    'Express',
    'Local',
    'Freight',
    'High-Speed',
    'Intercity',
    'Suburban'
  ];

  const signalStatuses = [
    { value: 'green', label: 'Green - Clear', color: 'bg-green-500' },
    { value: 'yellow', label: 'Yellow - Caution', color: 'bg-yellow-500' },
    { value: 'red', label: 'Red - Stop', color: 'bg-red-500' }
  ];

  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPredictionResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response from server:', response);

      if (!response.ok) {
        throw new Error('Prediction request failed');
      }

      const result = await response.json();
      console.log('Parsed JSON from server:', result);
      setPredictionResult(result.prediction);
      onPredict(result);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('An error occurred during prediction. Check the console for details.');
      setPredictionResult('An error occurred during prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      trainType: '',
      sectionId: '',
      priority: 2,
      scheduledArrival: '',
      scheduledDeparture: '',
      platformAvailable: true,
      signalStatus: '',
      trackCapacity: 1,
      hour: new Date().getHours()
    });
    setPredictionResult(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate backend upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsUploading(false);
    alert(`File "${file.name}" uploaded successfully!`);
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'Medium';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-blue-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-black dark:text-white">
          <Upload className="h-5 w-5" />
          <span>Input Data Entry Panel</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Train Type */}
            <div className="space-y-2">
              <Label htmlFor="trainType" className="text-neutral-700 dark:text-neutral-200">Train Type</Label>
              <Select 
                value={formData.trainType} 
                onValueChange={(value) => setFormData({...formData, trainType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select train type" />
                </SelectTrigger>
                <SelectContent>
                  {trainTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section ID */}
            <div className="space-y-2">
              <Label htmlFor="sectionId" className="text-neutral-700 dark:text-neutral-200">Section ID</Label>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-r-0 rounded-l-md text-sm font-mono text-black dark:text-white">
                  SC_
                </span>
                <Input
                  id="sectionId"
                  type="number"
                  min="1"
                  placeholder="Enter number"
                  value={formData.sectionId.replace('sc_', '')}
                  onChange={(e) => {
                    const number = e.target.value;
                    setFormData({...formData, sectionId: number ? `sc_${number}` : ''});
                  }}
                  className="rounded-l-none flex-1 bg-white dark:bg-neutral-800 text-black dark:text-white border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Example: SC_1, SC_2, SC_3...
              </div>
            </div>

            {/* Signal Status */}
            <div className="space-y-2">
              <Label htmlFor="signalStatus" className="text-neutral-700 dark:text-neutral-200">Signal Status</Label>
              <Select 
                value={formData.signalStatus} 
                onValueChange={(value) => setFormData({...formData, signalStatus: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select signal status" />
                </SelectTrigger>
                <SelectContent>
                  {signalStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full border-2 border-black dark:border-white ${status.color}`}></div>
                        <span className="text-black dark:text-white">{status.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scheduled Arrival */}
            <div className="space-y-2">
              <Label htmlFor="scheduledArrival" className="text-neutral-700 dark:text-neutral-200">Scheduled Arrival</Label>
              <Input
                id="scheduledArrival"
                type="time"
                value={formData.scheduledArrival}
                onChange={(e) => setFormData({...formData, scheduledArrival: e.target.value})}
                className="w-full bg-white dark:bg-neutral-800 text-black dark:text-white border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Scheduled Departure */}
            <div className="space-y-2">
              <Label htmlFor="scheduledDeparture" className="text-neutral-700 dark:text-neutral-200">Scheduled Departure</Label>
              <Input
                id="scheduledDeparture"
                type="time"
                value={formData.scheduledDeparture}
                onChange={(e) => setFormData({...formData, scheduledDeparture: e.target.value})}
                className="w-full bg-white dark:bg-neutral-800 text-black dark:text-white border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Track Capacity */}
            <div className="space-y-2">
              <Label htmlFor="trackCapacity" className="text-neutral-700 dark:text-neutral-200">Track Capacity</Label>
              <Input
                id="trackCapacity"
                type="number"
                min="1"
                max="10"
                value={formData.trackCapacity}
                onChange={(e) => {
                  const value = e.target.value === '' ? 1 : parseInt(e.target.value);
                  setFormData({...formData, trackCapacity: isNaN(value) ? 1 : Math.max(1, Math.min(10, value))});
                }}
                className="w-full bg-white dark:bg-neutral-800 text-black dark:text-white border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-neutral-700 dark:text-neutral-200">Priority Level</Label>
                <Badge className={`${getPriorityColor(formData.priority)} text-white`}>
                  {getPriorityLabel(formData.priority)}
                </Badge>
              </div>
              <Slider
                value={[formData.priority]}
                onValueChange={([value]) => setFormData({...formData, priority: value})}
                max={3}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            {/* Platform Availability */}
            <div className="space-y-3">
              <Label className="text-neutral-700 dark:text-neutral-200">Platform Availability</Label>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.platformAvailable}
                  onCheckedChange={(checked) => setFormData({...formData, platformAvailable: checked})}
                />
                <span className="text-sm">
                  {formData.platformAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hour Input */}
            <div className="space-y-2">
              <Label htmlFor="hour" className="text-neutral-700 dark:text-neutral-200">Hour of Day (0-23)</Label>
              <Input
                id="hour"
                type="number"
                min="0"
                max="23"
                value={formData.hour}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                  setFormData({...formData, hour: isNaN(value) ? 0 : Math.max(0, Math.min(23, value))});
                }}
                className="w-full bg-white dark:bg-neutral-800 text-black dark:text-white border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="flex items-center space-x-2 dark:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Form</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex items-center space-x-2 dark:text-white"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
                <span>{isUploading ? 'Uploading...' : 'Upload CSV'}</span>
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading || !formData.trainType || !formData.sectionId}
                className="flex items-center space-x-2 dark:text-white"
              >
                <Play className="h-4 w-4" />
                <span>{isLoading ? 'Predicting...' : 'Run Prediction'}</span>
              </Button>
            </div>
          </div>
        </form>
        
        {/* Prediction Results Display */}
        {predictionResult && (
          <div className="mt-6 p-4 bg-slate-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
              Prediction Results
            </h3>
            <div className="text-sm text-slate-600 dark:text-neutral-300">
              <pre className="whitespace-pre-wrap">{predictionResult}</pre>
            </div>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
        />

      </CardContent>
    </Card>
  );
}
