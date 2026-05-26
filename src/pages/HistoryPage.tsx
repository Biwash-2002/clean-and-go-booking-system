import { Container, Title, Table, Card, Text, Badge, Group, Button, Modal, Stack, Divider, TextInput, Select, ActionIcon, Menu, Box, Grid } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Calendar, Package, User, Car, Trash2, Search, XCircle, MoreVertical, Eye, Download, Clock, SlidersHorizontal } from 'lucide-react';
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

const formatDateSafely = (dateStr: string) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '---' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const HistoryPage = () => {
    const [bookings, setBookings] = useState<Booking[]>(() => {
        const stored = localStorage.getItem('car_wash_bookings');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    const sanitized = parsed.map((b: Booking) => ({
                        ...b,
                        price: b?.price || 0,
                        status: b?.status || 'Confirmed'
                    }));
                    sanitized.sort((a: Booking, b: Booking) => {
                        const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return bTime - aTime;
                    });
                    return sanitized;
                }
            } catch (e) {
                console.error('Failed to parse bookings', e);
            }
        }
        return [];
    });
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [opened, { open, close }] = useDisclosure(false);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [packageFilter, setPackageFilter] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<Date | null>(null);

    useEffect(() => {
        // Initialization moved to useState lazy initializer
    }, []);

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            if (!b) return false;
            const matchesSearch =
                (b.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (b.vehicleNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = !typeFilter || b.bookingType === typeFilter;
            const matchesPackage = !packageFilter || b.package === packageFilter;

            let matchesDate = true;
            if (dateFilter) {
                if (!b.bookingDate) {
                    matchesDate = false;
                } else {
                    const parsedBDate = new Date(b.bookingDate);
                    if (isNaN(parsedBDate.getTime())) {
                        matchesDate = false;
                    } else {
                        matchesDate = parsedBDate.toLocaleDateString() === dateFilter.toLocaleDateString();
                    }
                }
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

    const activeFiltersCount = [searchQuery, typeFilter, packageFilter, dateFilter].filter(Boolean).length;

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50 pt-28 pb-20">
                <Container size="lg">
                    <Stack gap={32}>

                        {/* Page Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                                <div>
                                    <Text size="xs" fw={800} className="uppercase tracking-widest text-indigo-500 mb-2">
                                        Account Activity
                                    </Text>
                                    <Title order={1} className="text-4xl font-black text-slate-900 tracking-tight font-sans">
                                        Booking <span className="text-indigo-600">History</span>
                                    </Title>
                                    <Text size="sm" className="text-slate-400 mt-2 font-medium">
                                        {filteredBookings.length} of {bookings.length} records — sorted by most recent
                                    </Text>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="light"
                                        color="indigo"
                                        radius="md"
                                        leftSection={<Download size={16} />}
                                        className="font-extrabold"
                                    >
                                        Export All
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Strip */}
                        <Group grow gap="lg">
                            {[
                                { label: 'Total Bookings', value: bookings.length, color: 'bg-indigo-50 text-indigo-600' },
                                { label: 'Confirmed', value: bookings.filter(b => b.status === 'Confirmed').length, color: 'bg-green-50 text-green-600' },
                                { label: 'Cancelled', value: bookings.filter(b => b.status === 'Cancelled').length, color: 'bg-red-50 text-red-500' },
                                { label: 'Total Spent', value: `Rs. ${bookings.reduce((s, b) => s + (b.status !== 'Cancelled' ? b.price : 0), 0)}`, color: 'bg-amber-50 text-amber-600' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                >
                                    <Card padding="lg" className="luxury-card border-none">
                                        <Text size="xs" fw={800} className="uppercase tracking-widest text-slate-400 mb-1">{stat.label}</Text>
                                        <Text size="xl" fw={900} className={`text-2xl font-black font-sans ${stat.color.split(' ')[1]}`}>{stat.value}</Text>
                                    </Card>
                                </motion.div>
                            ))}
                        </Group>

                        {/* Filters & Search */}
                        <Card className="luxury-card border-none p-0 overflow-hidden">
                            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                                <SlidersHorizontal size={16} className="text-indigo-500" />
                                <Text size="sm" fw={800} className="uppercase tracking-widest text-slate-500">
                                    Filters & Search
                                </Text>
                                {activeFiltersCount > 0 && (
                                    <Badge size="sm" color="indigo" variant="filled" radius="xl" className="ml-auto font-black">
                                        {activeFiltersCount} active
                                    </Badge>
                                )}
                            </div>
                            <div className="p-6">
                                <Grid align="flex-end" gutter="md">
                                    <Grid.Col span={{ base: 12, md: 4 }}>
                                        <TextInput
                                            placeholder="Search by ID, Name or Vehicle..."
                                            label="Search Bookings"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            leftSection={<Search size={16} className="text-slate-400" />}
                                            radius="md"
                                            size="md"
                                            labelProps={{ className: 'mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500' }}
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
                                            size="md"
                                            labelProps={{ className: 'mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500' }}
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
                                            size="md"
                                            labelProps={{ className: 'mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500' }}
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
                                            size="md"
                                            leftSection={<Calendar size={16} className="text-slate-400" />}
                                            labelProps={{ className: 'mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500' }}
                                        />
                                    </Grid.Col>
                                </Grid>
                                {activeFiltersCount > 0 && (
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            variant="subtle"
                                            color="red"
                                            size="xs"
                                            radius="md"
                                            leftSection={<XCircle size={14} />}
                                            className="font-extrabold"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setTypeFilter(null);
                                                setPackageFilter(null);
                                                setDateFilter(null);
                                            }}
                                        >
                                            Clear All Filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Main Table */}
                        <Card className="luxury-card border-none p-0 overflow-hidden">
                            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                <Text size="sm" fw={800} className="uppercase tracking-widest text-slate-500">
                                    All Records
                                </Text>
                                <Text size="xs" fw={700} className="text-slate-400">
                                    {filteredBookings.length} results
                                </Text>
                            </div>

                            {filteredBookings.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table verticalSpacing="lg" horizontalSpacing="xl" highlightOnHover className="min-w-[1000px]">
                                        <thead>
                                            <tr className="bg-slate-50/20">
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Type</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Package / ID</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Date & Time</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Vehicle</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Status</th>
                                                <th className="text-[10px] uppercase tracking-widest font-black text-slate-400">Amount</th>
                                                <th className="text-right text-[10px] uppercase tracking-widest font-black text-slate-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AnimatePresence>
                                                {filteredBookings.map((booking, i) => (
                                                    <motion.tr
                                                        key={booking.id}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ delay: i * 0.04 }}
                                                        className="transition-colors border-b border-slate-50 last:border-0"
                                                    >
                                                        <td>
                                                            <Badge
                                                                variant="light"
                                                                color={booking.bookingType === 'one-time' ? 'blue' : 'grape'}
                                                                radius="sm"
                                                                size="sm"
                                                                className="font-black uppercase tracking-widest px-3"
                                                            >
                                                                {booking.bookingType === 'one-time' ? 'One-Time' : 'Subscription'}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Text size="sm" fw={800} className="text-slate-900">{booking.packageName}</Text>
                                                            <Text size="xs" fw={700} className="font-mono text-indigo-500 mt-0.5">#{booking.id}</Text>
                                                        </td>
                                                        <td>
                                                            <div className="flex flex-col gap-0.5">
                                                                <Group gap={5}>
                                                                    <Calendar size={13} className="text-slate-400" />
                                                                    <Text size="sm" fw={600} className="text-slate-700">{formatDateSafely(booking.bookingDate)}</Text>
                                                                </Group>
                                                                <Group gap={5}>
                                                                    <Clock size={13} className="text-indigo-400" />
                                                                    <Text size="xs" fw={800} className="text-indigo-500">{booking.timeSlot}</Text>
                                                                </Group>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Text size="sm" fw={800} className="font-mono bg-slate-100 px-2 py-0.5 rounded-md inline-block text-slate-800">
                                                                {booking.vehicleNumber}
                                                            </Text>
                                                        </td>
                                                        <td>
                                                            <Badge
                                                                color={getStatusColor(booking.status)}
                                                                variant="dot"
                                                                size="md"
                                                                className="font-black uppercase tracking-widest"
                                                            >
                                                                {booking.status}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Text size="sm" fw={900} className="text-slate-900">Rs. {booking.price}</Text>
                                                        </td>
                                                        <td>
                                                            <Group justify="flex-end" gap="xs">
                                                                <ActionIcon
                                                                    variant="light"
                                                                    color="indigo"
                                                                    radius="md"
                                                                    title="View Details"
                                                                    onClick={() => handleRead(booking)}
                                                                >
                                                                    <Eye size={16} />
                                                                </ActionIcon>

                                                                <Menu shadow="xl" width={210} position="bottom-end" radius="lg">
                                                                    <Menu.Target>
                                                                        <ActionIcon variant="subtle" color="gray" radius="md">
                                                                            <MoreVertical size={16} />
                                                                        </ActionIcon>
                                                                    </Menu.Target>

                                                                    <Menu.Dropdown className="border-slate-100">
                                                                        <Menu.Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</Menu.Label>
                                                                        <Menu.Item leftSection={<Eye size={14} />} onClick={() => handleRead(booking)}>
                                                                            View Full Details
                                                                        </Menu.Item>
                                                                        <Menu.Item leftSection={<Download size={14} />} onClick={() => handleDownload(booking)}>
                                                                            Download Invoice
                                                                        </Menu.Item>

                                                                        {booking.status !== 'Cancelled' && (
                                                                            <>
                                                                                <Menu.Divider />
                                                                                <Menu.Item
                                                                                    color="orange"
                                                                                    leftSection={<XCircle size={14} />}
                                                                                    onClick={() => handleCancel(booking.id)}
                                                                                >
                                                                                    Cancel Booking
                                                                                </Menu.Item>
                                                                            </>
                                                                        )}
                                                                        <Menu.Divider />
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
                                <div className="text-center py-24">
                                    <div className="inline-flex p-5 bg-slate-100/80 rounded-3xl mb-6">
                                        <Package size={48} className="text-slate-300" />
                                    </div>
                                    <Title order={3} className="text-slate-400 font-black">No records found</Title>
                                    <Text size="sm" className="text-slate-400 mt-2 max-w-xs mx-auto">
                                        Try adjusting your search or filter criteria to see more results.
                                    </Text>
                                    {activeFiltersCount > 0 && (
                                        <Button
                                            variant="light"
                                            color="indigo"
                                            mt="xl"
                                            radius="xl"
                                            className="font-extrabold"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setTypeFilter(null);
                                                setPackageFilter(null);
                                                setDateFilter(null);
                                            }}
                                        >
                                            Clear All Filters
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Card>
                    </Stack>
                </Container>
            </div>

            {/* Detailed Booking Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Group gap="xs">
                        <div className="p-1.5 bg-indigo-100 rounded-lg">
                            <Eye size={16} className="text-indigo-600" />
                        </div>
                        <Text fw={900} size="sm" className="uppercase tracking-widest text-slate-700">
                            Booking Details
                        </Text>
                    </Group>
                }
                centered
                size="lg"
                radius="xl"
                padding="xl"
            >
                {selectedBooking && (
                    <Stack gap="xl">
                        {/* Header Row */}
                        <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
                            <div>
                                <Text size="xs" fw={800} className="uppercase tracking-widest text-slate-400">Reference ID</Text>
                                <Text fw={900} size="lg" className="font-mono text-indigo-600">#{selectedBooking.id}</Text>
                            </div>
                            <Badge
                                size="lg"
                                color={getStatusColor(selectedBooking.status)}
                                variant="filled"
                                className="px-5 rounded-xl font-black uppercase tracking-widest"
                            >
                                {selectedBooking.status}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Customer */}
                            <div className="bg-slate-50 rounded-2xl p-5">
                                <Group gap="xs" mb="sm">
                                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                                        <User size={14} className="text-indigo-600" />
                                    </div>
                                    <Text size="xs" fw={900} className="uppercase tracking-widest text-slate-600">Customer</Text>
                                </Group>
                                <Stack gap="sm">
                                    <div>
                                        <Text size="xs" fw={800} className="text-slate-400 uppercase tracking-widest">Full Name</Text>
                                        <Text fw={700} size="sm" className="text-slate-800">{selectedBooking.firstName} {selectedBooking.lastName}</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" fw={800} className="text-slate-400 uppercase tracking-widest">Email</Text>
                                        <Text fw={600} size="sm" className="text-slate-800">{selectedBooking.email}</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" fw={800} className="text-slate-400 uppercase tracking-widest">Phone</Text>
                                        <Text fw={600} size="sm" className="text-slate-800">{selectedBooking.phone}</Text>
                                    </div>
                                </Stack>
                            </div>

                            {/* Vehicle & Center */}
                            <div className="bg-slate-50 rounded-2xl p-5">
                                <Group gap="xs" mb="sm">
                                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                                        <Car size={14} className="text-indigo-600" />
                                    </div>
                                    <Text size="xs" fw={900} className="uppercase tracking-widest text-slate-600">Vehicle & Center</Text>
                                </Group>
                                <Stack gap="sm">
                                    <div>
                                        <Text size="xs" fw={800} className="text-slate-400 uppercase tracking-widest">Vehicle Number</Text>
                                        <Text fw={900} size="md" className="font-mono text-indigo-600">{selectedBooking.vehicleNumber}</Text>
                                    </div>
                                    <div>
                                        <Text size="xs" fw={800} className="text-slate-400 uppercase tracking-widest">Washing Center</Text>
                                        <Text fw={600} size="sm" className="text-slate-800">{selectedBooking.centerName}</Text>
                                    </div>
                                </Stack>
                            </div>
                        </div>

                        <Divider className="border-slate-100" />

                        {/* Service & Schedule */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Text size="xs" fw={800} className="text-slate-400 uppercase tracking-widest mb-2">Service Plan</Text>
                                <Group gap="xs">
                                    <Text fw={800} size="lg" className="text-slate-900">{selectedBooking.packageName}</Text>
                                    <Badge color={selectedBooking.bookingType === 'subscription' ? 'grape' : 'blue'} variant="light" size="sm" className="font-black">
                                        {selectedBooking.bookingType}
                                    </Badge>
                                </Group>
                                <Text size="xl" fw={900} className="text-indigo-600 mt-1">Rs. {selectedBooking.price}</Text>
                            </div>
                            <div>
                                <Text size="xs" fw={800} className="text-slate-400 uppercase tracking-widest mb-2">Scheduled For</Text>
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl">
                                        <Calendar size={14} />
                                        <Text size="sm" fw={800}>{formatDateSafely(selectedBooking.bookingDate)}</Text>
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl">
                                        <Clock size={14} />
                                        <Text size="sm" fw={800}>{selectedBooking.timeSlot}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedBooking.message && (
                            <Box className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                <Text size="xs" className="text-amber-700 font-black uppercase tracking-widest mb-2">Additional Notes</Text>
                                <Text size="sm" className="italic text-amber-900 leading-relaxed">"{selectedBooking.message}"</Text>
                            </Box>
                        )}

                        <Group grow mt="xs">
                            <Button onClick={close} variant="default" radius="md" size="md" className="font-extrabold">
                                Close
                            </Button>
                            {selectedBooking.status !== 'Cancelled' && (
                                <Button
                                    onClick={() => handleCancel(selectedBooking.id)}
                                    color="red"
                                    variant="light"
                                    leftSection={<XCircle size={18} />}
                                    radius="md"
                                    size="md"
                                    className="font-extrabold"
                                >
                                    Cancel Booking
                                </Button>
                            )}
                            <Button
                                onClick={() => handleDownload(selectedBooking)}
                                color="indigo"
                                leftSection={<Download size={18} />}
                                radius="md"
                                size="md"
                                className="font-extrabold"
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
