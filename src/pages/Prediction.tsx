import { useState, ChangeEvent, FormEvent } from 'react';

interface PredictionResult {
    predicted_delay: number;
    predicted_conflict: number;
    predicted_throughput: number;
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Prediction = () => {
    const [formData, setFormData] = useState({
        trainType: 'Express',
        sectionId: 'SEC_12',
        priority: 'High',
        scheduledArrival: '09:05',
        scheduledDeparture: '09:07',
        trackCapacity: 4,
        hour: 9,
        signalStatus: 'Green',
        platformAvailable: false
    });

    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (name: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const response = await fetch('http://localhost:3001/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Prediction request failed');
            }

            const result = await response.json();
            const parsed = result.prediction || result;
            setPrediction(parsed as PredictionResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Train Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="trainType">Train Type</Label>
                                <Select name="trainType" value={formData.trainType} onValueChange={(value) => handleSelectChange('trainType', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Train Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Express">Express</SelectItem>
                                        <SelectItem value="Passenger">Passenger</SelectItem>
                                        <SelectItem value="Freight">Freight</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sectionId">Section ID</Label>
                                <Input id="sectionId" name="sectionId" value={formData.sectionId} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select name="priority" value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scheduledArrival">Scheduled Arrival</Label>
                                <Input id="scheduledArrival" name="scheduledArrival" type="time" value={formData.scheduledArrival} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scheduledDeparture">Scheduled Departure</Label>
                                <Input id="scheduledDeparture" name="scheduledDeparture" type="time" value={formData.scheduledDeparture} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signalStatus">Signal Status</Label>
                                <Select name="signalStatus" value={formData.signalStatus} onValueChange={(value) => handleSelectChange('signalStatus', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Signal Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Green">Green</SelectItem>
                                        <SelectItem value="Red">Red</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="trackCapacity">Track Capacity</Label>
                                <Input id="trackCapacity" name="trackCapacity" type="number" value={formData.trackCapacity} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hour">Hour of Day</Label>
                                <Input id="hour" name="hour" type="number" value={formData.hour} onChange={handleChange} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="platformAvailable" name="platformAvailable" checked={formData.platformAvailable} onCheckedChange={(checked) => handleSelectChange('platformAvailable', checked)} />
                                <Label htmlFor="platformAvailable">Platform Available</Label>
                            </div>
                        </div>
                        <Button type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Get Prediction'}</Button>
                    </form>

                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {prediction && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Prediction Results</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Predicted Delay:</strong> {prediction.predicted_delay.toFixed(2)} minutes</p>
                                <p><strong>Conflict Probability:</strong> {(prediction.predicted_conflict * 100).toFixed(2)}%</p>
                                <p><strong>Predicted Throughput:</strong> {prediction.predicted_throughput.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Prediction;
