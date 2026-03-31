import { Group, Button, Text, Container, Box, Burger, Drawer, Stack, Avatar, Menu, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { Car, User, Settings, LogOut, History, Calendar, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    const [opened, { toggle, close }] = useDisclosure(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [user, setUser] = useState<{ name: string; avatar: string } | null>(() => {
        const storedUser = localStorage.getItem('car_wash_user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error('Failed to parse user', e);
            return null;
        }
    });

    useEffect(() => {
        const token = !!localStorage.getItem('token');
        const storedUser = localStorage.getItem('car_wash_user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        
        Promise.resolve().then(() => {
            if (isLoggedIn !== token) {
                setIsLoggedIn(token);
            }
            
            if (JSON.stringify(user) !== JSON.stringify(parsedUser)) {
                setUser(parsedUser);
            }
        });
    }, [location.pathname, isLoggedIn, user]); // Re-check on navigation

    const handleLogout = () => {
        // Clear auth data
        localStorage.removeItem('token');
        // If we have other user-related data
        // localStorage.removeItem('user_profile'); 

        setIsLoggedIn(false);
        notifications.show({
            title: 'Logged Out',
            message: 'You have been logged out successfully. See you again!',
            color: 'blue',
            icon: <LogOut size={16} />,
        });
        navigate('/');
        close();
    };

    const links = [
        { label: 'Home', link: '/' },
        { label: 'About', link: '/about' },
        { label: 'Locations', link: '/locations' },
        { label: 'Contact', link: '/contact' },
    ];

    const isActive = (path: string) => location.pathname === path;

    const items = links.map((link) => (
        <Text
            key={link.label}
            component={Link}
            to={link.link}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isActive(link.link)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
            onClick={close}
        >
            {link.label}
        </Text>
    ));

    return (
        <Box component="header" className="h-[80px] border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-[1000] flex items-center shadow-sm shadow-gray-100/50">
            <Container size="lg" h="100%" className="w-full">
                <Group justify="space-between" h="100%">
                    <Group gap="xs" className="cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="bg-primary-600 p-2 rounded-xl text-blue-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-primary-200">
                            <Car size={24} />
                        </div>
                        <Text className="text-xl font-black tracking-tighter text-gray-900 group-hover:text-primary-600 transition-colors uppercase">
                            CLEAN <span className="text-primary-600">&</span> GO
                        </Text>
                    </Group>

                    <Group gap={20} visibleFrom="sm">
                        {items}
                    </Group>

                    <Group visibleFrom="sm" gap="lg">
                        {isLoggedIn ? (
                            <Menu shadow="md" width={220} position="bottom-end" radius="lg">
                                <Menu.Target>
                                    <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 pr-3 rounded-2xl transition-all">
                                        <Avatar size="sm" src={user?.avatar} radius="xl" className="border-2 border-primary-50" />
                                        <div className="hidden md:block">
                                            <Text size="sm" fw={800} className="text-gray-900 leading-tight">{user?.name || 'User'}</Text>
                                            <Text size="xs" className="text-gray-400">Premium Member</Text>
                                        </div>
                                    </div>
                                </Menu.Target>

                                <Menu.Dropdown p="xs">
                                    <Menu.Label>Accounting</Menu.Label>
                                    <Menu.Item leftSection={<User size={16} />} onClick={() => navigate('/profile')}>My Profile</Menu.Item>
                                    <Menu.Item leftSection={<History size={16} />} onClick={() => navigate('/history')}>Booking History</Menu.Item>

                                    <Menu.Label>Settings</Menu.Label>
                                    <Menu.Item leftSection={<Settings size={16} />}>Preferences</Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item color="red" leftSection={<LogOut size={16} />} onClick={handleLogout}>
                                        Logout
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <Group gap="sm">
                                <Button variant="subtle" color="gray" leftSection={<LogIn size={18} />} onClick={() => navigate('/login')}>Login</Button>
                                <Button variant="light" color="blue" leftSection={<UserPlus size={18} />} onClick={() => navigate('/register')}>Sign Up</Button>
                            </Group>
                        )}

                        <Button
                            className="bg-primary-600 hover:bg-primary-700 h-12 px-6 rounded-xl font-bold font-sans tracking-wide shadow-md shadow-primary-200"
                            onClick={() => navigate('/book')}
                            leftSection={<Calendar size={18} />}
                        >
                            Book Now
                        </Button>
                    </Group>

                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" className="text-gray-600" />
                </Group>
            </Container>

            <Drawer
                opened={opened}
                onClose={close}
                size="100%"
                padding="xl"
                title={<Text className="text-xl font-black text-primary-600 tracking-tighter uppercase">Menu</Text>}
                hiddenFrom="sm"
                styles={{
                    content: { backgroundColor: '#fff' },
                    header: { padding: '24px', borderBottom: '1px solid #f1f5f9' }
                }}
            >
                <Stack gap="md" mt="xl">
                    {items}
                    <Divider my="md" />
                    {isLoggedIn ? (
                        <>
                            <Button
                                variant="light"
                                size="lg"
                                fullWidth
                                radius="xl"
                                className="bg-primary-50 text-primary-600 hover:bg-primary-100 h-14"
                                onClick={() => { navigate('/profile'); close(); }}
                                leftSection={<User size={18} />}
                            >
                                My Profile
                            </Button>
                            <Button
                                variant="outline"
                                color="red"
                                size="lg"
                                fullWidth
                                radius="xl"
                                className="h-14"
                                onClick={handleLogout}
                                leftSection={<LogOut size={18} />}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="light"
                                size="lg"
                                fullWidth
                                radius="xl"
                                onClick={() => { navigate('/login'); close(); }}
                                leftSection={<LogIn size={18} />}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                fullWidth
                                radius="xl"
                                onClick={() => { navigate('/register'); close(); }}
                                leftSection={<UserPlus size={18} />}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                    <Button
                        size="lg"
                        fullWidth
                        radius="xl"
                        className="bg-primary-600 hover:bg-primary-700 h-14"
                        onClick={() => { navigate('/book'); close(); }}
                        leftSection={<Calendar size={18} />}
                    >
                        Book Now
                    </Button>
                </Stack>
            </Drawer>
        </Box>
    );
};

export default Navbar;
