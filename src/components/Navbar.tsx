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
        let parsedUser = null;
        if (storedUser) {
            try {
                parsedUser = JSON.parse(storedUser);
            } catch (e) {
                console.error('Failed to parse user in Navbar useEffect', e);
            }
        }
        
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
            className={`px-4 py-2 rounded-xl text-sm font-bold tracking-tight transition-all duration-300 ${isActive(link.link)
                    ? 'bg-indigo-50/80 text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50/60'
                }`}
            onClick={close}
        >
            {link.label}
        </Text>
    ));

    return (
        <Box component="header" className="h-[80px] border-b border-slate-100 bg-white/80 backdrop-blur-lg sticky top-0 z-[1000] flex items-center shadow-sm shadow-slate-100/30">
            <Container size="lg" h="100%" className="w-full">
                <Group justify="space-between" h="100%">
                    <Group gap="xs" className="cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="bg-indigo-600 p-2.5 rounded-2xl text-white group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 shadow-lg shadow-indigo-500/20">
                            <Car size={22} />
                        </div>
                        <Text className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors uppercase font-sans">
                            Clean <span className="text-indigo-600">&</span> Go
                        </Text>
                    </Group>

                    <Group gap={12} visibleFrom="sm">
                        {items}
                    </Group>

                    <Group visibleFrom="sm" gap="md">
                        {isLoggedIn ? (
                            <Menu shadow="md" width={220} position="bottom-end" radius="lg">
                                <Menu.Target>
                                    <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50/80 p-1.5 pr-3 rounded-2xl transition-all border border-slate-100 bg-white">
                                        <Avatar size="sm" src={user?.avatar} radius="xl" className="border-2 border-indigo-50" />
                                        <div className="hidden md:block">
                                            <Text size="sm" fw={800} className="text-slate-900 leading-none">{user?.name || 'User'}</Text>
                                            <Text size="xs" className="text-amber-500 font-extrabold uppercase tracking-widest mt-0.5" style={{ fontSize: '9px' }}>Premium</Text>
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
                            <Group gap="xs">
                                <Button variant="subtle" color="slate" leftSection={<LogIn size={16} />} onClick={() => navigate('/login')} className="font-bold text-slate-600 hover:text-indigo-600 rounded-xl">Login</Button>
                                <Button variant="light" color="indigo" leftSection={<UserPlus size={16} />} onClick={() => navigate('/register')} className="font-bold rounded-xl">Sign Up</Button>
                            </Group>
                        )}

                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6 rounded-xl font-bold font-sans tracking-wide shadow-md shadow-indigo-600/10 transition-all hover:shadow-indigo-600/20"
                            onClick={() => navigate('/book')}
                            leftSection={<Calendar size={16} />}
                        >
                            Book Now
                        </Button>
                    </Group>

                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" className="text-slate-600" />
                </Group>
            </Container>

            <Drawer
                opened={opened}
                onClose={close}
                size="100%"
                padding="xl"
                title={<Text className="text-xl font-black text-indigo-600 tracking-tight uppercase">Menu</Text>}
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
                                color="indigo"
                                size="lg"
                                fullWidth
                                radius="xl"
                                className="h-14 font-bold"
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
                                className="h-14 font-bold"
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
                                color="indigo"
                                size="lg"
                                fullWidth
                                radius="xl"
                                className="h-14 font-bold"
                                onClick={() => { navigate('/login'); close(); }}
                                leftSection={<LogIn size={18} />}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outline"
                                color="indigo"
                                size="lg"
                                fullWidth
                                radius="xl"
                                className="h-14 font-bold"
                                onClick={() => { navigate('/register'); close(); }}
                                leftSection={<UserPlus size={18} />}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                    <Button
                        size="lg"
                        color="indigo"
                        fullWidth
                        radius="xl"
                        className="bg-indigo-600 hover:bg-indigo-700 h-14 font-bold shadow-md shadow-indigo-600/10"
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
