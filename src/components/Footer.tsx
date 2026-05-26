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
        <footer className="bg-slate-950 pt-24 pb-12 text-slate-400 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/4 h-full bg-indigo-600/5 -skew-x-12 translate-x-10"></div>

            <Container size="lg" className="relative z-10">
                <Grid gutter={80} mb={60}>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Group gap="xs" mb="lg">
                            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                                <Car size={26} />
                            </div>
                            <Text className="text-2xl font-black tracking-tight text-white uppercase font-sans">
                                Clean <span className="text-indigo-500">&</span> Go
                            </Text>
                        </Group>
                        <Text className="text-slate-400 mb-8 leading-relaxed pr-8">
                            Premium car detailing and washing services across Nepal.

                        </Text>
                        <Stack gap="sm">
                            <div className="flex gap-4 items-start group">
                                <div className="p-2 bg-slate-900 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Phone size={18} /></div>
                                <div><Text size="xs" className="text-slate-500 font-bold uppercase">Call Us</Text> <Text size="sm" className="font-bold text-white">+977 9804851228</Text></div>
                            </div>
                            <div className="flex gap-4 items-start group">
                                <div className="p-2 bg-slate-900 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Mail size={18} /></div>
                                <div><Text size="xs" className="text-slate-500 font-bold uppercase">Email Us</Text> <Text size="sm" className="font-bold text-white">Clean&go2026@gmail.com</Text></div>
                            </div>
                        </Stack>
                    </Grid.Col>

                    {sections.map((section, index) => (
                        <Grid.Col key={index} span={{ base: 6, md: 2 }}>
                            <Title order={4} mb="xl" className="text-white text-base font-black tracking-tight uppercase">{section.title}</Title>
                            <Stack gap="md">
                                {section.links.map((link, lIndex) => (
                                    <Text
                                        key={lIndex}
                                        component={Link}
                                        to={link.link}
                                        size="sm"
                                        className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block font-medium"
                                    >
                                        {link.label}
                                    </Text>
                                ))}
                            </Stack>
                        </Grid.Col>
                    ))}

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Title order={4} mb="xl" className="text-white text-base font-black tracking-tight uppercase">Stay Updated</Title>
                        <Text className="text-slate-400 text-sm mb-6 pr-4">Subscribe to our newsletter for exclusive offers and premium car care tips.</Text>
                        <div className="relative group">
                            <TextInput
                                placeholder="Your email address"
                                radius="xl"
                                size="lg"
                                className="bg-slate-900 border-none ring-1 ring-slate-800"
                                styles={{ input: { backgroundColor: '#0f172a', border: 'none', color: '#fff', paddingRight: '120px' } }}
                            />
                            <Button
                                className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-700 px-6 rounded-full font-bold shadow-lg transition-all"
                                rightSection={<ArrowRight size={16} />}
                            >
                                Send
                            </Button>
                        </div>
                        <Group mt="xl" gap="md">
                            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                                <ActionIcon key={i} size={42} radius="xl" className="bg-slate-900 hover:bg-indigo-600 text-white transition-all border-none">
                                    <Icon size={18} />
                                </ActionIcon>
                            ))}
                        </Group>
                    </Grid.Col>
                </Grid>

                <Divider className="border-slate-900" mb={40} />

                <Group justify="space-between" align="center" className="text-slate-500 text-sm">
                    <Text>© {currentYear} Clean & Go Nepal. All rights reserved.</Text>
                    <Group gap="xl">
                        {/* <Text component={Link} to="/terms" className="hover:text-white transition-colors">Terms of Service</Text>
                        <Text component={Link} to="/policy" className="hover:text-white transition-colors">Privacy Policy</Text>
                        <Text component={Link} to="/cookies" className="hover:text-white transition-colors">Cookies</Text> */}
                    </Group>
                </Group>
            </Container>
        </footer>
    );
};

export default Footer;
