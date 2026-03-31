import { Container, Grid, Text, Group, Stack, Divider, Title, ActionIcon, TextInput, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, Facebook, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: 'Services',
            links: [
                { label: 'One Time Wash', link: '/book' },
                { label: 'Subscriptions', link: '/book' },
                { label: 'Ceramic Coating', link: '/book' },
                { label: 'Interior Detailing', link: '/book' },
                { label: 'Engine Wash', link: '/book' },
            ]
        },
        {
            title: 'Support',
            links: [
                { label: 'Our Locations', link: '/locations' },
                // { label: 'Booking History', link: '/history' },
                { label: 'Edit Profile', link: '/profile' },
                // { label: 'Help Center', link: '/help' },
                // { label: 'Privacy Policy', link: '/privacy' },
            ]
        }
    ];

    return (
        <footer className="bg-slate-900 pt-24 pb-12 text-slate-300 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/4 h-full bg-primary-600/5 -skew-x-12 translate-x-10"></div>
            
            <Container size="lg" className="relative z-10">
                <Grid gutter={80} mb={60}>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Group gap="xs" mb="lg">
                            <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-900/20">
                                <Car size={28} />
                            </div>
                            <Text className="text-2xl font-black tracking-tighter text-white uppercase">
                                CLEAN <span className="text-primary-600">&</span> GO
                            </Text>
                        </Group>
                        <Text className="text-slate-400 mb-8 leading-relaxed pr-8">
                            Premium car detailing and washing services across Nepal. 
                            We combine advanced technology with professional expertise 
                            to give your vehicle the care it truly deserves.
                        </Text>
                        <Stack gap="sm">
                            <div className="flex gap-4 items-start group">
                                <div className="p-2 bg-slate-800 rounded-lg text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all"><Phone size={18} /></div>
                                <div><Text size="xs" className="text-slate-500 font-bold uppercase">Call Us</Text> <Text size="sm" className="font-bold">+977 1 4412345</Text></div>
                            </div>
                            <div className="flex gap-4 items-start group">
                                <div className="p-2 bg-slate-800 rounded-lg text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all"><Mail size={18} /></div>
                                <div><Text size="xs" className="text-slate-500 font-bold uppercase">Email Us</Text> <Text size="sm" className="font-bold">hello@cleanandgo.com.np</Text></div>
                            </div>
                        </Stack>
                    </Grid.Col>

                    {sections.map((section, index) => (
                        <Grid.Col key={index} span={{ base: 6, md: 2 }}>
                            <Title order={4} mb="xl" className="text-white text-lg font-bold tracking-tight">{section.title}</Title>
                            <Stack gap="md">
                                {section.links.map((link, lIndex) => (
                                    <Text
                                        key={lIndex}
                                        component={Link}
                                        to={link.link}
                                        size="sm"
                                        className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                                    >
                                        {link.label}
                                    </Text>
                                ))}
                            </Stack>
                        </Grid.Col>
                    ))}

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Title order={4} mb="xl" className="text-white text-lg font-bold tracking-tight">Stay Updated</Title>
                        <Text className="text-slate-400 text-sm mb-6">Subscribe to our newsletter for exclusive offers and premium car care tips.</Text>
                        <div className="relative group">
                            <TextInput 
                                placeholder="Your email address" 
                                radius="xl" 
                                size="lg"
                                className="bg-slate-800 border-none ring-1 ring-slate-700/50"
                                styles={{ input: { backgroundColor: '#1e293b', border: 'none', color: '#fff', paddingRight: '120px' } }}
                            />
                            <Button 
                                className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary-600 hover:bg-primary-700 px-6 rounded-full font-bold shadow-lg"
                                rightSection={<ArrowRight size={16} />}
                            >
                                Send
                            </Button>
                        </div>
                        <Group mt="xl" gap="md">
                            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                                <ActionIcon key={i} size={42} radius="xl" className="bg-slate-800 hover:bg-primary-600 text-white transition-all border-none">
                                    <Icon size={20} />
                                </ActionIcon>
                            ))}
                        </Group>
                    </Grid.Col>
                </Grid>

                <Divider className="border-slate-800" mb={40} />
                
                <Group justify="space-between" align="center" className="text-slate-500 text-sm">
                    <Text>© {currentYear} Clean & Go Nepal. All rights reserved.</Text>
                    <Group gap="xl">
                        <Text component={Link} to="/terms" className="hover:text-white transition-colors">Terms of Service</Text>
                        <Text component={Link} to="/policy" className="hover:text-white transition-colors">Privacy Policy</Text>
                        <Text component={Link} to="/cookies" className="hover:text-white transition-colors">Cookies</Text>
                    </Group>
                </Group>
            </Container>
        </footer>
    );
};

export default Footer;
