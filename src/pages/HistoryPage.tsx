import { Container, Title, Table, Card, Text, Badge, Group, Button, Modal, Stack, Divider, TextInput, Select, ActionIcon, Menu, Box, Grid } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Calendar, Package, User, Car, Trash2, Search, XCircle, MoreVertical, Eye, Download, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notifications } from '@mantine/notifications';

interface Booking {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    vehicleNumber: string;
    package: string;
    packageName: string;
    bookingType: string;
    center: string;
    centerName: string;
    timeSlot: string;
    bookingDate: string;
    message: string;
    status: string;
    price: number;
    createdAt: string;
}

const HistoryPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    
    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [packageFilter, setPackageFilter] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<Date | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('car_wash_bookings');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const sanitized = parsed.map((b: any) => ({
                    ...b,
                    price: b.price || 0,
                    status: b.status || 'Confirmed'
                }));
                sanitized.sort((a: Booking, b: Booking) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setBookings(sanitized);
            } catch (e) {
                console.error('Failed to parse bookings', e);
            }
        }
    }, []);

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const matchesSearch = 
                b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesType = !typeFilter || b.bookingType === typeFilter;
            const matchesPackage = !packageFilter || b.package === packageFilter;
            
            let matchesDate = true;
            if (dateFilter) {
                const bDate = new Date(b.bookingDate).toLocaleDateString();
                const fDate = dateFilter.toLocaleDateString();
                matchesDate = bDate === fDate;
            }

            return matchesSearch && matchesType && matchesPackage && matchesDate;
        });
    }, [bookings, searchQuery, typeFilter, packageFilter, dateFilter]);

    const handleRead = (booking: Booking) => {
        setSelectedBooking(booking);
        open();
    };

    const handleDownload = (booking: Booking) => {
        notifications.show({
            title: 'Invoice Downloaded',
            message: `Booking #${booking.id} invoice has been saved to your device.`,
            color: 'blue'
        });
    };

    const handleCancel = (id: string) => {
        if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            const updated = bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b);
            localStorage.setItem('car_wash_bookings', JSON.stringify(updated));
            setBookings(updated);
            notifications.show({
                title: 'Booking Cancelled',
                message: 'Your booking has been successfully cancelled.',
                color: 'red'
            });
            if (selectedBooking?.id === id) {
                close();
            }
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this record from your history?')) {
            const updated = bookings.filter(b => b.id !== id);
            localStorage.setItem('car_wash_bookings', JSON.stringify(updated));
            setBookings(updated);
            notifications.show({
                title: 'Record Deleted',
                message: 'The booking record has been removed.',
                color: 'gray'
            });
            if (selectedBooking?.id === id) {
                close();
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'green';
            case 'cancelled': return 'red';
            case 'completed': return 'blue';
            default: return 'yellow';
        }
    };

    const packageOptions = Array.from(new Set(bookings.map(b => b.package))).map(pkgId => {
        const pkg = bookings.find(b => b.package === pkgId);
        return { value: pkgId, label: pkg?.packageName || pkgId };
    });

    return (
        <Layout>
            <div className="py-12 bg-gray-50 min-h-screen">
                <Container size="lg">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Title order={1} mb="2rem" ta="center" className="text-4xl font-extrabold tracking-tight">
                            Booking <span className="text-primary-600">History</span>
                        </Title>
                    </motion.div>

                    {/* Filters & Search */}
                    <Card shadow="sm" radius="xl" p="lg" mb="xl" className="border-none">
                        <Grid align="flex-end">
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <TextInput
                                    placeholder="Search by ID, Name or Vehicle..."
                                    label="Search Bookings"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    leftSection={<Search size={16} />}
                                    radius="md"
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 4, md: 2 }}>
                                <Select
                                    label="Type"
                                    placeholder="All"
                                    data={[
                                        { value: 'one-time', label: 'One-Time' },
                                        { value: 'subscription', label: 'Monthly' }
                                    ]}
                                    value={typeFilter}
                                    onChange={setTypeFilter}
                                    clearable
                                    radius="md"
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
                                <Select
                                    label="Package"
                                    placeholder="All Packages"
                                    data={packageOptions}
                                    value={packageFilter}
                                    onChange={setPackageFilter}
                                    clearable
                                    radius="md"
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
                                <DatePickerInput
                                    label="Filter by Date"
                                    placeholder="Pick date"
                                    value={dateFilter}
                                    onChange={(value) => setDateFilter(value as Date | null)}
                                    clearable
                                    radius="md"
                                    leftSection={<Calendar size={16} />}
                                />
                            </Grid.Col>
                        </Grid>
                    </Card>

                    {/* Desktop View Table */}
                    <Card shadow="sm" radius="xl" p="0" className="border-none overflow-hidden">
                        {filteredBookings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table verticalSpacing="md" horizontalSpacing="xl" highlightOnHover className="min-w-[1000px]">
                                    <thead className="bg-gray-50 text-gray-700">
                                        <tr>
                                            <th>Type</th>
                                            <th>Package</th>
                                            <th>Date & Time</th>
                                            <th>Vehicle</th>
                                            <th>Status</th>
                                            <th>Amount</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <AnimatePresence>
                                            {filteredBookings.map((booking) => (
                                                <motion.tr 
                                                    key={booking.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="transition-colors hover:bg-white border-b border-gray-100 last:border-0"
                                                >
                                                    <td>
                                                        <Badge 
                                                            variant="light" 
                                                            color={booking.bookingType === 'one-time' ? 'blue' : 'grape'}
                                                            className="rounded-lg px-2"
                                                        >
                                                            {booking.bookingType === 'one-time' ? 'One-Time' : 'Subscription'}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Text size="sm" fw={700} className="text-gray-900">{booking.packageName}</Text>
                                                        <Text size="xs" className="text-gray-400">ID: {booking.id}</Text>
                                                    </td>
                                                    <td>
                                                        <div className="flex flex-col">
                                                            <Text size="sm" fw={500}>{new Date(booking.bookingDate).toLocaleDateString()}</Text>
                                                            <Text size="xs" className="text-primary-600 font-bold">{booking.timeSlot}</Text>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Text size="sm" className="font-mono bg-gray-100 px-2 py-0.5 rounded inline-block text-gray-800">
                                                            {booking.vehicleNumber}
                                                        </Text>
                                                    </td>
                                                    <td>
                                                        <Badge color={getStatusColor(booking.status)} variant="dot">
                                                            {booking.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Text size="sm" fw={800} className="text-gray-900">Rs. {booking.price}</Text>
                                                    </td>
                                                    <td className="text-right">
                                                        <Group justify="flex-end" gap="xs">
                                                            <ActionIcon 
                                                                variant="subtle" 
                                                                color="blue" 
                                                                onClick={() => handleRead(booking)}
                                                            >
                                                                <Eye size={18} />
                                                            </ActionIcon>
                                                            
                                                            <Menu shadow="md" width={200} position="bottom-end">
                                                                <Menu.Target>
                                                                    <ActionIcon variant="subtle" color="gray">
                                                                        <MoreVertical size={18} />
                                                                    </ActionIcon>
                                                                </Menu.Target>

                                                                <Menu.Dropdown>
                                                                    <Menu.Label>Actions</Menu.Label>
                                                                    <Menu.Item leftSection={<Eye size={14} />} onClick={() => handleRead(booking)}>
                                                                        View Details
                                                                    </Menu.Item>
                                                                    <Menu.Item leftSection={<Download size={14} />} onClick={() => handleDownload(booking)}>
                                                                        Download Invoice
                                                                    </Menu.Item>
                                                                    
                                                                    {booking.status !== 'Cancelled' && (
                                                                        <>
                                                                            <Menu.Divider />
                                                                            <Menu.Item 
                                                                                color="red" 
                                                                                leftSection={<XCircle size={14} />}
                                                                                onClick={() => handleCancel(booking.id)}
                                                                            >
                                                                                Cancel Booking
                                                                            </Menu.Item>
                                                                        </>
                                                                    )}
                                                                    <Menu.Item 
                                                                        color="red" 
                                                                        leftSection={<Trash2 size={14} />}
                                                                        onClick={() => handleDelete(booking.id)}
                                                                    >
                                                                        Delete Record
                                                                    </Menu.Item>
                                                                </Menu.Dropdown>
                                                            </Menu>
                                                        </Group>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white">
                                <Box className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                                    <Package size={48} className="text-gray-300" />
                                </Box>
                                <Title order={3} className="text-gray-400">No bookings found</Title>
                                <Text className="text-gray-500 mt-2">Try adjusting your filters or search query.</Text>
                                <Button variant="light" mt="xl" radius="md" onClick={() => {
                                    setSearchQuery('');
                                    setTypeFilter(null);
                                    setPackageFilter(null);
                                    setDateFilter(null);
                                }}>Clear All Filters</Button>
                            </div>
                        )}
                    </Card>
                </Container>
            </div>

            {/* Detailed Booking Modal */}
            <Modal opened={opened} onClose={close} title="Detailed Booking Information" centered size="lg" radius="xl" padding="xl">
                {selectedBooking && (
                    <Stack gap="xl">
                        <Group justify="space-between" align="center">
                            <Stack gap={0}>
                                <Text size="xs" className="text-gray-400 uppercase tracking-widest font-bold">Booking ID</Text>
                                <Title order={3} className="text-primary-600">#{selectedBooking.id}</Title>
                            </Stack>
                            <Badge size="xl" color={getStatusColor(selectedBooking.status)} variant="filled" className="h-10 px-6 rounded-xl">
                                {selectedBooking.status}
                            </Badge>
                        </Group>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card withBorder radius="xl" p="lg" className="bg-gray-50 border-none shadow-none">
                                <Title order={5} mb="md" className="flex items-center gap-2 text-gray-700">
                                    <User size={18} className="text-primary-600" /> Customer Details
                                </Title>
                                <Stack gap="xs">
                                    <div>
                                        <Text size="xs" className="text-gray-400 font-bold">FULL NAME</Text>
                                        <Text fw={600} size="sm">{selectedBooking.firstName} {selectedBooking.lastName}</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" className="text-gray-400 font-bold">EMAIL ADDRESS</Text>
                                        <Text fw={600} size="sm">{selectedBooking.email}</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" className="text-gray-400 font-bold">PHONE NUMBER</Text>
                                        <Text fw={600} size="sm">{selectedBooking.phone}</Text>
                                    </div>
                                </Stack>
                            </Card>

                            <Card withBorder radius="xl" p="lg" className="bg-gray-50 border-none shadow-none">
                                <Title order={5} mb="md" className="flex items-center gap-2 text-gray-700">
                                    <Car size={18} className="text-primary-600" /> Vehicle & Center
                                </Title>
                                <Stack gap="xs">
                                    <div>
                                        <Text size="xs" className="text-gray-400 font-bold">VEHICLE NUMBER</Text>
                                        <Text fw={700} size="md" className="text-primary-700">{selectedBooking.vehicleNumber}</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" className="text-gray-400 font-bold">WASHING CENTER</Text>
                                        <Text fw={600} size="sm">{selectedBooking.centerName}</Text>
                                    </div>
                                </Stack>
                            </Card>
                        </div>

                        <Divider />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <Text size="xs" className="text-gray-400 font-bold mb-1">SERVICE PLAN</Text>
                                <Group gap="xs">
                                    <Text fw={700} size="lg">{selectedBooking.packageName}</Text>
                                    <Badge color={selectedBooking.bookingType === 'subscription' ? 'grape' : 'blue'}>
                                        {selectedBooking.bookingType}
                                    </Badge>
                                </Group>
                                <Text size="lg" fw={900} mt="xs" className="text-primary-600">Rs. {selectedBooking.price}</Text>
                            </div>
                            <div>
                                <Text size="xs" className="text-gray-400 font-bold mb-1">SCHEDULED FOR</Text>
                                <Group gap="sm">
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                                        <Calendar size={14} />
                                        <Text size="sm" fw={700}>{new Date(selectedBooking.bookingDate).toLocaleDateString()}</Text>
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-lg">
                                        <Clock size={14} />
                                        <Text size="sm" fw={700}>{selectedBooking.timeSlot}</Text>
                                    </div>
                                </Group>
                            </div>
                        </div>

                        {selectedBooking.message && (
                            <Box className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                <Text size="xs" className="text-orange-700 font-bold mb-1">ADDITIONAL NOTES</Text>
                                <Text size="sm" className="italic text-orange-900 leading-relaxed">"{selectedBooking.message}"</Text>
                            </Box>
                        )}

                        <Group grow mt="xl">
                            <Button onClick={close} variant="default" radius="md" size="lg">Close</Button>
                            {selectedBooking.status !== 'Cancelled' && (
                                <Button
                                    onClick={() => handleCancel(selectedBooking.id)}
                                    color="red"
                                    variant="light"
                                    leftSection={<XCircle size={20} />}
                                    radius="md"
                                    size="lg"
                                >
                                    Cancel Booking
                                </Button>
                            )}
                            <Button
                                onClick={() => handleDownload(selectedBooking)}
                                className="bg-primary-600 hover:bg-primary-700"
                                leftSection={<Download size={20} />}
                                radius="md"
                                size="lg"
                            >
                                Get Invoice
                            </Button>
                        </Group>
                    </Stack>
                )}
            </Modal>
        </Layout>
    );
};

export default HistoryPage;
