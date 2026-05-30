import { Container, Title, Text, Table, Card, Badge, Group, Button, Stack, Avatar, Box, Divider, ActionIcon } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Trash2, Edit2, ShieldCheck, Zap, Download, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { notifications } from '@mantine/notifications';
import Layout from '../components/Layout';
import { loadUserBookings, saveUserBookings } from '../utils/bookingStorage';

interface Booking {
    id: string;
    packageName: string;
    bookingDate: string;
    timeSlot: string;
    status: string;
    price: number;
}

const formatDateSafely = (dateStr: string) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '---' : date.toLocaleDateString();
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user] = useState<{
        name: string;
        email: string;
        phone: string;
        address: string;
        avatar: string;
    } | null>(() => {
        const storedUser = localStorage.getItem('car_wash_user');
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (e) {
                console.error('Failed to parse user', e);
            }
        }
        return {
            name: 'Clean User',
            email: 'user@example.com',
            phone: '---',
            address: 'Nepal',
            avatar: 'https://ui-avatars.com/api/?name=Clean+User'
        };
    });
    // Load only THIS user's bookings from the per-user scoped key
    const [bookings, setBookings] = useState<Booking[]>(() => loadUserBookings<Booking>());

    useEffect(() => {
        // Auth Guard
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleCancel = (id: string) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            const updated = bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b);
            saveUserBookings(updated);
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
        // Clear the session email so bookingStorage no longer resolves a key
        localStorage.removeItem('car_wash_logged_in_email');
        localStorage.removeItem('car_wash_user');
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
                            <Card className="luxury-card border-none shadow-xl">
                                <div className="bg-indigo-600 h-40 relative">
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
                                            <div className="flex items-center gap-3">
                                                <Title order={1} className="text-3xl font-black text-slate-900 tracking-tight font-sans uppercase">{user?.name || 'Loading...'}</Title>
                                                <span className="luxury-badge gold" style={{ marginTop: '4px' }}>Premium</span>
                                            </div>
                                            <Group gap="xl" mt="xs">
                                                <Group gap={6} className="text-slate-500 font-bold">
                                                    <Mail size={15} className="text-slate-400" />
                                                    <Text size="sm">{user?.email}</Text>
                                                </Group>
                                                <Group gap={6} className="text-slate-500 font-bold">
                                                    <Phone size={15} className="text-slate-400" />
                                                    <Text size="sm">{user?.phone}</Text>
                                                </Group>
                                                <Group gap={6} className="text-slate-500 font-bold">
                                                    <MapPin size={15} className="text-slate-400" />
                                                    <Text size="sm">{user?.address}</Text>
                                                </Group>
                                            </Group>
                                        </div>
                                        <div className="pb-4 flex gap-3">
                                            <Button 
                                                variant="outline" 
                                                color="indigo"
                                                radius="md" 
                                                size="md"
                                                leftSection={<Edit2 size={16} />}
                                                className="font-extrabold tracking-wide rounded-xl"
                                                onClick={() => navigate('/profile/edit')}
                                            >
                                                Edit Profile
                                            </Button>
                                            <Button 
                                                variant="light" 
                                                color="red"
                                                radius="md" 
                                                size="md"
                                                leftSection={<LogOut size={16} />}
                                                className="font-extrabold tracking-wide rounded-xl"
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
                            <Card padding="xl" className="luxury-card">
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" fw={800} className="uppercase tracking-widest text-slate-400">Total Bookings</Text>
                                        <Text size="xl" fw={900} className="text-3xl mt-1 text-slate-900 font-sans">{bookings.length}</Text>
                                    </div>
                                    <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><Zap size={22} /></div>
                                </Group>
                            </Card>
                            <Card padding="xl" className="luxury-card">
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" fw={800} className="uppercase tracking-widest text-slate-400">Completed</Text>
                                        <Text size="xl" fw={900} className="text-3xl mt-1 text-slate-900 font-sans">{bookings.filter(b => b.status === 'Confirmed').length}</Text>
                                    </div>
                                    <div className="p-3.5 bg-green-50 text-green-600 rounded-2xl shadow-sm"><ShieldCheck size={22} /></div>
                                </Group>
                            </Card>
                            <Card padding="xl" className="luxury-card">
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" fw={800} className="uppercase tracking-widest text-slate-400">Total Spent</Text>
                                        <Text size="xl" fw={900} className="text-3xl mt-1 text-slate-900 font-sans">Rs. {bookings.reduce((sum, b) => sum + (b.status !== 'Cancelled' ? b.price : 0), 0)}</Text>
                                    </div>
                                    <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl shadow-sm"><Zap size={22} /></div>
                                </Group>
                            </Card>
                        </Group>

                        {/* Recent Bookings Table */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="luxury-card border-none shadow-xl p-0">
                                <Group p="xl" justify="space-between" className="bg-slate-50/50">
                                    <Title order={3} className="text-xl font-black text-slate-900 tracking-tight font-sans uppercase">Recent Booking History</Title>
                                    <Button variant="subtle" color="indigo" size="sm" className="font-extrabold underline rounded-xl" onClick={() => navigate('/history')}>View All</Button>
                                </Group>
                                <Divider className="border-slate-100" />
                                <div className="overflow-x-auto">
                                    <Table verticalSpacing="lg" horizontalSpacing="xl" highlightOnHover>
                                        <thead className="bg-slate-50/30 text-slate-400">
                                            <tr>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Reference ID</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Package</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Date & Time</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Status</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Price</th>
                                                <th className="text-right text-[10px] uppercase tracking-widest font-black text-slate-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.length > 0 ? bookings.slice(0, 5).map((booking) => (
                                                <tr key={booking.id} className="transition-colors hover:bg-slate-50/20">
                                                    <td><Text size="sm" fw={800} className="font-mono text-indigo-600">#{booking.id}</Text></td>
                                                    <td><Text size="sm" fw={800} className="text-slate-950">{booking.packageName}</Text></td>
                                                    <td>
                                                        <Group gap="xs">
                                                            <Calendar size={14} className="text-slate-400" />
                                                            <Text size="sm" fw={700} className="text-slate-700">{formatDateSafely(booking.bookingDate)}</Text>
                                                            <Text size="xs" c="indigo" fw={700}>{booking.timeSlot}</Text>
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
                                                    <td><Text size="sm" fw={900} className="text-slate-900">Rs. {booking.price}</Text></td>
                                                    <td>
                                                        <Group justify="flex-end" gap="xs">
                                                            <ActionIcon variant="light" color="indigo" title="Download Invoice" className="rounded-lg">
                                                                <Download size={16} />
                                                            </ActionIcon>
                                                            {booking.status !== 'Cancelled' && (
                                                                <Button 
                                                                    variant="light" 
                                                                    color="red" 
                                                                    size="xs" 
                                                                    radius="md"
                                                                    className="font-extrabold border border-red-50 rounded-xl"
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
                                                            <Calendar size={40} className="text-slate-200 mx-auto mb-4" />
                                                            <Text fw={700} c="dimmed">No recurring bookings found.</Text>
                                                            <Button variant="light" color="indigo" mt="md" radius="xl" className="font-extrabold" onClick={() => navigate('/book')}>Book Your First Wash Now</Button>
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
