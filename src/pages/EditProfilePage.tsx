import { useState, useEffect } from 'react';
import { Container, Title, Text, TextInput, Button, Stack, Card, Avatar, Group, Box, ActionIcon, Divider } from '@mantine/core';
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft, ShieldCheck, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { notifications } from '@mantine/notifications';
import Layout from '../components/Layout';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        name: 'Ram Karki',
        email: 'ram@example.com',
        phone: '9812345678',
        address: 'Kathmandu, Nepal',
        avatar: 'https://i.pravatar.cc/150?u=ram'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('car_wash_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to load user', e);
            }
        }
    }, []);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('car_wash_user', JSON.stringify(user));
            setLoading(false);
            notifications.show({
                title: 'Profile Updated',
                message: 'Your information has been saved successfully.',
                color: 'green',
                icon: <ShieldCheck size={18} />
            });
            navigate('/');
        }, 1200);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-20">
                <Container size="sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <header className="mb-10 flex items-center justify-between">
                            <Button 
                                variant="subtle" 
                                leftSection={<ArrowLeft size={18} />} 
                                onClick={() => navigate('/profile')}
                                className="text-gray-500 hover:text-primary-600 hover:bg-primary-50 px-0 font-bold"
                            >
                                Back to Profile
                            </Button>
                            <Group gap="xs">
                                <ActionIcon variant="light" color="gray" size="lg" radius="md">
                                    <Bell size={20} />
                                </ActionIcon>
                                <ActionIcon variant="light" color="gray" size="lg" radius="md">
                                    <ShieldCheck size={20} />
                                </ActionIcon>
                            </Group>
                        </header>

                        <Card shadow="xl" radius="lg" padding={40} className="border-none shadow-blue-900/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            
                            <Box className="relative mb-12 flex flex-col items-center">
                                <div className="relative">
                                    <Avatar 
                                        src={user.avatar} 
                                        size={140} 
                                        radius={100} 
                                        className="border-8 border-white shadow-2xl ring-1 ring-gray-100"
                                    >
                                        <User size={60} color="#cbd5e1" />
                                    </Avatar>
                                    <button className="absolute bottom-2 right-2 p-3 bg-primary-600 text-white rounded-2xl shadow-xl hover:bg-primary-700 transition-all border-4 border-white">
                                        <Camera size={20} />
                                    </button>
                                </div>
                                <Title order={2} mt="xl" className="text-3xl font-black text-gray-900 tracking-tight">Edit Profile</Title>
                                <Text size="sm" className="text-gray-400 font-medium mt-1 uppercase tracking-widest">Global Account ID: US-9921</Text>
                            </Box>

                            <Stack gap="xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TextInput
                                        label="Full Name"
                                        placeholder="Enter your name"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        leftSection={<User size={18} className="text-gray-400" />}
                                        size="lg"
                                        radius="md"
                                        className="font-semibold"
                                        labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-gray-500' }}
                                    />

                                    <TextInput
                                        label="Email Address"
                                        placeholder="Enter your email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        leftSection={<Mail size={18} className="text-gray-400" />}
                                        size="lg"
                                        radius="md"
                                        className="font-semibold"
                                        labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-gray-500' }}
                                    />
                                </div>

                                <TextInput
                                    label="Mobile Number"
                                    placeholder="98XXXXXXXX"
                                    value={user.phone}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    leftSection={<Phone size={18} className="text-gray-400" />}
                                    size="lg"
                                    radius="md"
                                    className="font-semibold"
                                    labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-gray-500' }}
                                />

                                <TextInput
                                    label="Primary Address"
                                    placeholder="Enter your address"
                                    value={user.address}
                                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                                    leftSection={<MapPin size={18} className="text-gray-400" />}
                                    size="lg"
                                    radius="md"
                                    className="font-semibold"
                                    labelProps={{ className: 'mb-1 text-xs font-bold uppercase tracking-wider text-gray-500' }}
                                />

                                <Divider my="lg" label={<Text size="xs" c="dimmed" fw={700}>MEMBER SINCE 2024</Text>} labelPosition="center" />

                                <Button 
                                    fullWidth 
                                    size="xl" 
                                    radius="md" 
                                    className="bg-primary-600 hover:bg-primary-700 h-16 shadow-lg shadow-primary-200 font-bold text-lg"
                                    onClick={handleSave}
                                    loading={loading}
                                    leftSection={<Save size={22} />}
                                >
                                    Save Profile Data
                                </Button>
                                <Text size="xs" ta="center" className="text-gray-400 font-medium">
                                    Last synchronized: {new Date().toLocaleDateString()}
                                </Text>
                            </Stack>
                        </Card>
                    </motion.div>
                </Container>
            </div>
        </Layout>
    );
};

export default EditProfilePage;
