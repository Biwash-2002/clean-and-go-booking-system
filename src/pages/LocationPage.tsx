import { useState, useEffect, useMemo } from 'react';
import {
    Container, Title, Text, SimpleGrid, Card, Group, Badge,
    Stack, Button, Box, Loader, Center, SegmentedControl, Alert
} from '@mantine/core';
import { MapPin, Phone, Clock, ArrowRight, AlertCircle, Map as MapIcon } from 'lucide-react';
import Layout from '../components/Layout';
import GoogleMapComponent from '../components/GoogleMap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface WashingCenter {
    id: string;
    name: string;
    location: string;
    coords: { lat: number; lng: number };
    address: string;
}

const LocationPage = () => {
    const navigate = useNavigate();
    const [centers, setCenters] = useState<WashingCenter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string>('All');

    useEffect(() => {
        const fetchCenters = async () => {
            setLoading(true);
            try {
                // Fetching from our public API endpoint
                const response = await fetch('/api/centers.json');
                if (!response.ok) throw new Error('Failed to connect to the server. Please try again later.');
                const data = await response.json();
                setCenters(data);
                setError(null);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
                console.error(err);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchCenters();
    }, []);

    // Filter logic
    const filteredCenters = useMemo(() => {
        if (selectedCity === 'All') return centers;
        return centers.filter(center => center.location === selectedCity);
    }, [centers, selectedCity]);

    const cities = useMemo(() => {
        const uniqueCities = Array.from(new Set(centers.map(c => c.location)));
        return ['All', ...uniqueCities];
    }, [centers]);

    if (loading) {
        return (
            <Layout>
                <Center style={{ height: '80vh' }}>
                    <Stack align="center">
                        <Loader size="xl" variant="dots" color="blue" />
                        <Text size="lg" fw={500} c="blue">Locating premium service points...</Text>
                    </Stack>
                </Center>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <Container size="sm" py={100}>
                    <Alert icon={<AlertCircle size={20} />} title="Error Loading Data" color="red" variant="filled" radius="md">
                        {error}
                        <Button
                            variant="white"
                            color="red"
                            size="xs"
                            mt="md"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </Alert>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' } as React.CSSProperties}>
                {/* Header Section */}
                <Box bg="white" py={70} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Container size="lg">
                        <Stack align="center" ta="center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Badge size="xl" variant="dot" color="indigo" mb="md" className="font-extrabold tracking-widest uppercase pl-0">Nationwide Service</Badge>
                                <Title order={1} className="text-slate-900 font-sans font-black uppercase tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900 } as React.CSSProperties}>
                                    Clean&Go Locations
                                </Title>
                                <Text size="lg" className="text-slate-500 font-medium" style={{ maxWidth: 700, margin: '15px 20px 0' } as React.CSSProperties}>
                                    Find your nearest premium car wash point. Select a city to filter locations.
                                </Text>
                            </motion.div>

                            <Box mt={40} style={{ width: '100%', maxWidth: '600px' }}>
                                <SegmentedControl
                                    fullWidth
                                    size="lg"
                                    radius="xl"
                                    color="indigo"
                                    value={selectedCity}
                                    onChange={setSelectedCity}
                                    data={cities}
                                    className="border border-slate-100 bg-slate-50/50 p-1"
                                />
                            </Box>
                        </Stack>
                    </Container>
                </Box>

                <Container size="lg" py={60}>
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40}>
                        <AnimatePresence mode="popLayout">
                            {filteredCenters.map((center, index) => (
                                <motion.div
                                    key={center.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <Card
                                        padding="xl"
                                        radius="lg"
                                        className="luxury-card"
                                        h="100%"
                                        style={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                        <Group justify="space-between" mb="lg">
                                            <Title order={3} size="1.35rem" fw={900} className="text-slate-900 uppercase font-sans tracking-tight">{center.name}</Title>
                                            <Badge size="lg" color="indigo" radius="md" variant="light" className="font-extrabold uppercase tracking-wider px-3">
                                                {center.location}
                                            </Badge>
                                        </Group>

                                        <Box mb="xl" style={{ height: '240px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                            <GoogleMapComponent
                                                locations={[center]}
                                                zoom={15}
                                            />
                                        </Box>

                                        <Stack gap="md" style={{ flex: 1 }}>
                                            <Group gap="md">
                                                <Box p={10} style={{ backgroundColor: '#f5f3ff', borderRadius: '12px' }}>
                                                    <MapPin size={20} color="#4f46e5" />
                                                </Box>
                                                <Text size="sm" fw={700} className="text-slate-700">{center.address}</Text>
                                            </Group>
                                            <Group gap="md">
                                                <Box p={10} style={{ backgroundColor: '#f5f3ff', borderRadius: '12px' }}>
                                                    <Phone size={20} color="#4f46e5" />
                                                </Box>
                                                <Text size="sm" fw={700} className="text-slate-700">+977-9801234567</Text>
                                            </Group>
                                            <Group gap="md">
                                                <Box p={10} style={{ backgroundColor: '#f5f3ff', borderRadius: '12px' }}>
                                                    <Clock size={20} color="#4f46e5" />
                                                </Box>
                                                <Text size="sm" fw={700} className="text-slate-700">Daily: 08:00 AM - 08:00 PM</Text>
                                            </Group>
                                        </Stack>

                                        <Button
                                            fullWidth
                                            mt={30}
                                            size="lg"
                                            radius="md"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold tracking-wide h-13 shadow-md shadow-indigo-600/10 rounded-xl"
                                            rightSection={<ArrowRight size={18} />}
                                            onClick={() => navigate('/book', { state: { centerId: center.id } })}
                                        >
                                            Book At This Center
                                        </Button>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </SimpleGrid>

                    {filteredCenters.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Center py={100}>
                                <Stack align="center" ta="center">
                                    <MapIcon size={80} color="#cbd5e1" strokeWidth={1} />
                                    <Title order={2} c="slate.4">No Centers Found</Title>
                                    <Text c="dimmed">We haven't expanded to {selectedCity} yet, but we're coming soon!</Text>
                                    <Button variant="light" onClick={() => setSelectedCity('All')}>Show All Locations</Button>
                                </Stack>
                            </Center>
                        </motion.div>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

export default LocationPage;
