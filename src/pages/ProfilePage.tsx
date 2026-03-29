import { Container, Title, Text, Table, Card, Badge, Group, Button, Stack, Avatar, Box, Divider, ActionIcon } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Trash2, Edit2, ShieldCheck, Zap, Download, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { notifications } from '@mantine/notifications';
import Layout from '../components/Layout';

interface Booking {
    id: string;
    packageName: string;
    bookingDate: string;
    timeSlot: string;
    status: string;
    price: number;
}

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{
        name: string;
        email: string;
        phone: string;
        address: string;
        avatar: string;
    } | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        // Auth Guard
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('car_wash_user');
        
        if (!token) {
            navigate('/login');
            return;
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Default mock if login didn't provide it, but it should
            setUser({
                name: 'Clean User',
                email: 'user@example.com',
                phone: '---',
                address: 'Nepal',
                avatar: 'https://ui-avatars.com/api/?name=Clean+User'
            });
        }

        // Fetch Bookings
        const storedBookings = localStorage.getItem('car_wash_bookings');
        if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
        }
    }, [navigate]);

    const handleCancel = (id: string) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            const updated = bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b);
            localStorage.setItem('car_wash_bookings', JSON.stringify(updated));
            setBookings(updated);
            notifications.show({
                title: 'Booking Cancelled',
                message: 'Your booking has been cancelled successfully.',
                color: 'red',
                icon: <Trash2 size={16} />
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        notifications.show({
            title: 'Logged Out',
            message: 'Successfully logged out.',
            color: 'blue',
            icon: <LogOut size={16} />
        });
        navigate('/');
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 pt-28 pb-20">
                <Container size="lg">
                    <Stack gap={40}>
                        {/* Profile Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card shadow="xl" radius="lg" p={0} className="border-none overflow-hidden hover:shadow-2xl transition-all duration-300">
                                <div className="bg-primary-600 h-40 relative">
                                    <div className="absolute top-0 right-0 w-64 h-full bg-white/10 -skew-x-12 translate-x-32"></div>
                                </div>
                                <div className="px-10 pb-10">
                                    <div className="flex flex-col md:flex-row items-end gap-8 -mt-16 relative z-10">
                                        <Avatar 
                                            src={user?.avatar} 
                                            size={160} 
                                            radius={80} 
                                            className="border-8 border-white shadow-2xl"
                                        />
                                        <div className="flex-grow pb-4">
                                            <Title order={1} className="text-4xl font-black text-gray-900 tracking-tight">{user?.name || 'Loading...'}</Title>
                                            <Group gap="xl" mt="xs">
                                                <Group gap={6} className="text-gray-500 font-bold">
                                                    <Mail size={16} />
                                                    <Text size="sm">{user?.email}</Text>
                                                </Group>
                                                <Group gap={6} className="text-gray-500 font-bold">
                                                    <Phone size={16} />
                                                    <Text size="sm">{user?.phone}</Text>
                                                </Group>
                                                <Group gap={6} className="text-gray-500 font-bold">
                                                    <MapPin size={16} />
                                                    <Text size="sm">{user?.address}</Text>
                                                </Group>
                                            </Group>
                                        </div>
                                        <div className="pb-4 flex gap-3">
                                            <Button 
                                                variant="outline" 
                                                radius="md" 
                                                size="md"
                                                leftSection={<Edit2 size={18} />}
                                                className="border-2 font-black tracking-wide"
                                                onClick={() => navigate('/profile/edit')}
                                            >
                                                Edit Profile
                                            </Button>
                                            <Button 
                                                variant="light" 
                                                color="red"
                                                radius="md" 
                                                size="md"
                                                leftSection={<LogOut size={18} />}
                                                className="font-black tracking-wide"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Statistics Strip */}
                        <Group grow gap="xl">
                            <Card p="xl" radius="lg" className="border-none shadow-md bg-white">
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" fw={900} c="dimmed" className="uppercase tracking-widest">Total Bookings</Text>
                                        <Text size="xl" fw={900} className="text-3xl mt-1">{bookings.length}</Text>
                                    </div>
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Zap size={24} /></div>
                                </Group>
                            </Card>
                            <Card p="xl" radius="lg" className="border-none shadow-md bg-white">
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" fw={900} c="dimmed" className="uppercase tracking-widest">Completed</Text>
                                        <Text size="xl" fw={900} className="text-3xl mt-1">{bookings.filter(b => b.status === 'Confirmed').length}</Text>
                                    </div>
                                    <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><ShieldCheck size={24} /></div>
                                </Group>
                            </Card>
                            <Card p="xl" radius="lg" className="border-none shadow-md bg-white">
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" fw={900} c="dimmed" className="uppercase tracking-widest">Total Spent</Text>
                                        <Text size="xl" fw={900} className="text-3xl mt-1">Rs. {bookings.reduce((sum, b) => sum + (b.status !== 'Cancelled' ? b.price : 0), 0)}</Text>
                                    </div>
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Zap size={24} /></div>
                                </Group>
                            </Card>
                        </Group>

                        {/* Recent Bookings Table */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card shadow="xl" radius="lg" p={0} className="border-none overflow-hidden">
                                <Group p="xl" justify="space-between" className="bg-gray-50/50">
                                    <Title order={3} className="text-xl font-black text-gray-900 tracking-tight">Recent Booking History</Title>
                                    <Button variant="subtle" size="sm" className="font-bold underline" onClick={() => navigate('/history')}>View All</Button>
                                </Group>
                                <Divider />
                                <div className="overflow-x-auto">
                                    <Table verticalSpacing="lg" horizontalSpacing="xl" highlightOnHover>
                                        <thead className="bg-gray-50/30">
                                            <tr>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-gray-400">Reference ID</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-gray-400">Package</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-gray-400">Date & Time</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-gray-400">Status</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-gray-400">Price</th>
                                                <th className="text-right text-[10px] uppercase tracking-widest font-black text-gray-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.length > 0 ? bookings.slice(0, 5).map((booking) => (
                                                <tr key={booking.id} className="transition-colors hover:bg-gray-50/50">
                                                    <td><Text size="sm" fw={800} className="font-mono text-primary-600">#{booking.id}</Text></td>
                                                    <td><Text size="sm" fw={800} className="text-gray-900">{booking.packageName}</Text></td>
                                                    <td>
                                                        <Group gap="xs">
                                                            <Calendar size={14} className="text-gray-400" />
                                                            <Text size="sm" fw={700} className="text-gray-700">{booking.bookingDate}</Text>
                                                            <Text size="xs" c="dimmed" fw={700}>{booking.timeSlot}</Text>
                                                        </Group>
                                                    </td>
                                                    <td>
                                                        <Badge 
                                                            variant="light" 
                                                            color={booking.status === 'Cancelled' ? 'red' : 'green'} 
                                                            radius="sm"
                                                            size="sm"
                                                            className="font-black uppercase tracking-widest px-3"
                                                        >
                                                            {booking.status}
                                                        </Badge>
                                                    </td>
                                                    <td><Text size="sm" fw={900} className="text-gray-900">Rs. {booking.price}</Text></td>
                                                    <td>
                                                        <Group justify="flex-end" gap="xs">
                                                            <ActionIcon variant="light" color="blue" title="Download Invoice">
                                                                <Download size={16} />
                                                            </ActionIcon>
                                                            {booking.status !== 'Cancelled' && (
                                                                <Button 
                                                                    variant="light" 
                                                                    color="red" 
                                                                    size="xs" 
                                                                    radius="md"
                                                                    className="font-bold border border-red-100"
                                                                    leftSection={<Trash2 size={14} />}
                                                                    onClick={() => handleCancel(booking.id)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            )}
                                                        </Group>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={6}>
                                                        <Box py={60} ta="center">
                                                            <Calendar size={40} className="text-gray-200 mx-auto mb-4" />
                                                            <Text fw={700} c="dimmed">No recurring bookings found.</Text>
                                                            <Button variant="light" mt="md" onClick={() => navigate('/book')}>Book Your First Wash Now</Button>
                                                        </Box>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card>
                        </motion.div>
                    </Stack>
                </Container>
            </div>
        </Layout>
    );
};

export default ProfilePage;
