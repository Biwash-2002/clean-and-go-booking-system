import { Container, Text, Button, Group, Stack, SimpleGrid, Card, Badge, Avatar, Grid } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, MapPin, Star, Sparkles, Zap } from 'lucide-react';
import { WASH_PACKAGES, WASHING_CENTERS } from '../constants/data';
import Layout from '../components/Layout';
import GoogleMapComponent from '../components/GoogleMap';

const HomePage = () => {
    const navigate = useNavigate();

    const oneTimePlans = WASH_PACKAGES.filter(p => p.planType === 'one-time');
    const subscriptionPlans = WASH_PACKAGES.filter(p => p.planType === 'subscription');

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=2000" 
                        alt="Premium Car Wash" 
                        className="w-full h-full object-cover opacity-40 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                </div>

                <Container size="lg" className="relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <Badge 
                            size="lg" 
                            variant="filled" 
                            className="bg-primary-600 mb-6 px-4 py-1 h-auto rounded-lg text-xs font-bold tracking-widest uppercase"
                        >
                            <Sparkles size={14} className="mr-2 inline" /> #1 Premium Car Care in Nepal
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                            Your Car Deserves <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Absolute Perfection</span>
                        </h1>
                        <Text className="text-xl text-slate-300 mb-10 leading-relaxed max-w-xl">
                            Experience the next generation of car detailing. Eco-friendly technology, 
                            expert care, and seamless online booking at your fingertips.
                        </Text>
                        <Group gap="md">
                            <Button
                                size="xl"
                                radius="md"
                                className="bg-primary-600 hover:bg-primary-700 h-16 px-10 shadow-lg shadow-primary-900/20"
                                onClick={() => navigate('/book')}
                                rightSection={<ArrowRight size={20} />}
                            >
                                Book Now
                            </Button>
                            <Button 
                                size="xl" 
                                radius="md" 
                                variant="outline" 
                                className="h-16 px-10 border-2 text-white border-white/20 hover:bg-white/10"
                            >
                                View Services
                            </Button>
                        </Group>

                        <div className="mt-12 flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1,2,3,4].map(idx => (
                                    <Avatar key={idx} src={`https://i.pravatar.cc/150?u=${idx}`} radius="xl" className="border-2 border-slate-900" />
                                ))}
                            </div>
                            <div>
                                <div className="flex text-yellow-400 gap-0.5 mb-1">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <Text className="text-slate-400 text-sm font-medium">Trusted by 2,000+ car owners</Text>
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* Features Bar */}
            <div className="bg-white border-b border-gray-100 py-10">
                <Container size="lg">
                    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                        {[
                            { icon: <Shield className="text-blue-600" />, title: "Full Protection", desc: "Premium ceramic coatings & wax" },
                            { icon: <Clock className="text-blue-600" />, title: "Fast Turnaround", desc: "Professional wash in 30-60 mins" },
                            { icon: <Zap className="text-blue-600" />, title: "Eco-Friendly", desc: "90% less water usage technology" },
                        ].map((feat, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                                <div className="p-3 bg-blue-50 rounded-xl">{feat.icon}</div>
                                <div>
                                    <Text fw={700} className="text-gray-900">{feat.title}</Text>
                                    <Text size="sm" className="text-gray-500">{feat.desc}</Text>
                                </div>
                            </div>
                        ))}
                    </SimpleGrid>
                </Container>
            </div>

            {/* Service Packages */}
            <section className="py-24 bg-gray-50">
                <Container size="lg">
                    <Stack align="center" ta="center" mb={60}>
                        <h2 className="text-4xl font-black text-gray-900 mb-4">Choose Your <span className="text-primary-600">Perfect Plan</span></h2>
                        <Text className="text-gray-500 max-w-xl text-lg">
                            We offer flexible options for every car owner. Choose a one-time refresh or join our premium club.
                        </Text>
                    </Stack>

                    {/* One Time Plans */}
                    <div className="mb-16">
                        <Badge variant="outline" color="blue" size="lg" mb="xl" className="rounded-md ring-1 ring-blue-100 uppercase tracking-widest">One-Time Refresh</Badge>
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={40}>
                            {oneTimePlans.map((pkg) => (
                                <motion.div 
                                    key={pkg.id} 
                                    variants={itemVariants} 
                                    initial="hidden" 
                                    whileInView="visible" 
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.05 }}
                                    className="h-full"
                                >
                                    <Card className="glass-card glow-effect overflow-hidden p-10 flex flex-col h-full rounded-[2.5rem] relative transition-all duration-500 shadow-2xl shadow-gray-200/40">
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-100/30 rounded-full blur-3xl"></div>
                                        <Text className="uppercase text-[11px] font-black tracking-[0.2em] text-primary-600 mb-4">{pkg.name}</Text>
                                        <div className="flex items-baseline mb-8">
                                            <span className="text-6xl font-black text-gray-950 tracking-tighter">Rs. {pkg.price}</span>
                                        </div>
                                        <Text size="sm" className="text-gray-900 mb-10 leading-relaxed font-semibold h-12 overflow-hidden opacity-90">{pkg.description}</Text>
                                        <Stack gap="xl" mb="2rem" className="flex-grow">
                                            <div className="flex items-center gap-4 text-sm text-gray-950 font-bold">
                                                <div className="w-8 h-8 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm"><Sparkles size={16} /></div>
                                                Crystal Foam Wash
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-950 font-bold">
                                                <div className="w-8 h-8 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm"><Clock size={16} /></div>
                                                {pkg.duration} Mins Express
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-950 font-bold">
                                                <div className="w-8 h-8 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm"><MapPin size={16} /></div>
                                                At Any Center
                                            </div>
                                        </Stack>
                                        <Button 
                                            fullWidth 
                                            size="xl" 
                                            radius="2rem" 
                                            className="bg-primary-600 text-white font-black h-16 text-sm tracking-[0.1em] uppercase hover:bg-primary-700 shadow-xl shadow-primary-200/50 transform active:scale-95 transition-all"
                                            onClick={() => navigate('/book', { state: { pkgId: pkg.id, planType: pkg.planType } })}
                                        >
                                            Book Now
                                        </Button>
                                    </Card>
                                </motion.div>
                            ))}
                        </SimpleGrid>
                    </div>

                    {/* Subscription Plans */}
                    <div className="mt-20">
                        <Badge variant="outline" color="grape" size="lg" mb="xl" className="rounded-md ring-1 ring-grape-100 uppercase tracking-widest px-6 py-4 font-black">Monthly Membership</Badge>
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={40}>
                            {subscriptionPlans.map((pkg) => (
                                <motion.div 
                                    key={pkg.id} 
                                    variants={itemVariants} 
                                    initial="hidden" 
                                    whileInView="visible" 
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10 }}
                                    className="h-full"
                                >
                                    <Card className={`rounded-[2.5rem] overflow-hidden p-10 flex flex-col h-full relative border-none shadow-3xl transition-all duration-500 glow-effect ${pkg.id === 'sub-premium' ? 'gradient-border ring-2 ring-primary-500/20' : 'glass-card'}`}>
                                        {pkg.id === 'sub-premium' && (
                                            <div className="absolute top-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase px-6 py-2 rounded-full shadow-lg border border-white/20 z-10">Best Value</div>
                                        )}
                                        <Text className={`uppercase text-[11px] font-black tracking-[0.2em] mb-4 ${pkg.id === 'sub-premium' ? 'text-primary-600' : 'text-primary-600'}`}>{pkg.name}</Text>
                                        <div className="flex items-baseline mb-8">
                                            <span className={`text-6xl font-black tracking-tighter ${pkg.id === 'sub-premium' ? 'text-gray-950' : 'text-gray-950'}`}>Rs. {pkg.price}</span>
                                            <span className={`text-sm font-bold ml-2 ${pkg.id === 'sub-premium' ? 'text-gray-500' : 'text-gray-500'}`}>/mo</span>
                                        </div>
                                        <Text size="sm" className={`mb-10 leading-relaxed font-semibold h-12 overflow-hidden ${pkg.id === 'sub-premium' ? 'text-gray-950' : 'text-gray-900'}`}>{pkg.description}</Text>
                                        <Stack gap="xl" mb="2rem" className="flex-grow">
                                            <div className={`flex items-center gap-4 text-sm font-bold ${pkg.id === 'sub-premium' ? 'text-gray-950' : 'text-gray-950'}`}>
                                                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${pkg.id === 'sub-premium' ? 'bg-primary-500/10 text-primary-600' : 'bg-primary-50 text-primary-600'}`}><Zap size={16} /></div>
                                                {pkg.limit} Detailed Washes
                                            </div>
                                            <div className={`flex items-center gap-4 text-sm font-bold ${pkg.id === 'sub-premium' ? 'text-gray-950' : 'text-gray-950'}`}>
                                                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${pkg.id === 'sub-premium' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-green-50 text-green-600'}`}><Shield size={16} /></div>
                                                Priority Support
                                            </div>
                                            <div className={`flex items-center gap-4 text-sm font-bold ${pkg.id === 'sub-premium' ? 'text-gray-950' : 'text-gray-950'}`}>
                                                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${pkg.id === 'sub-premium' ? 'bg-purple-500/10 text-purple-600' : 'bg-blue-50 text-blue-600'}`}><MapPin size={16} /></div>
                                                Global Access
                                            </div>
                                        </Stack>
                                        <Button 
                                            fullWidth 
                                            size="xl" 
                                            radius="2rem" 
                                            className={`font-black h-16 text-sm tracking-[0.1em] uppercase shadow-2xl transform active:scale-95 transition-all ${pkg.id === 'sub-premium' ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:opacity-90 shadow-primary-200' : 'bg-gray-950 text-white hover:bg-black'}`}
                                            onClick={() => navigate('/book', { state: { pkgId: pkg.id, planType: pkg.planType } })}
                                        >
                                            Join
                                        </Button>
                                    </Card>
                                </motion.div>
                            ))}
                        </SimpleGrid>
                    </div>
                </Container>
            </section>

            {/* Map Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/5 -skew-x-12 translate-x-20"></div>
                <Container size="lg" className="relative z-10">
                    <Grid gutter={80} align="center">
                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <Badge variant="dot" color="primary" size="lg" mb="md" className="uppercase tracking-widest pl-0">Our Network</Badge>
                            <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">Find Us in Your <br/><span className="text-primary-600">Local Area</span></h2>
                            <Text className="text-gray-600 text-lg mb-10 leading-relaxed">
                                We have flagship service centers across Kathmandu valley, 
                                each equipped with state-of-the-art washing technology and 
                                comfortable waiting lounges.
                            </Text>
                            
                            <Stack gap="lg">
                                {WASHING_CENTERS.slice(0, 3).map(center => (
                                    <div key={center.id} className="flex gap-4 group cursor-pointer" onClick={() => navigate('/book', { state: { centerId: center.id } })}>
                                        <div className="w-12 h-12 shrink-0 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <Text fw={800} className="text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{center.name}</Text>
                                            <Text size="sm" className="text-gray-500">{center.address}</Text>
                                        </div>
                                    </div>
                                ))}
                            </Stack>

                            <Button 
                                variant="subtle" 
                                size="lg" 
                                mt="xl" 
                                className="text-primary-600 font-bold p-0 hover:bg-transparent hover:translate-x-1 transition-transform"
                                rightSection={<ArrowRight size={18} />}
                                onClick={() => navigate('/locations')}
                            >
                                View all 4 locations
                            </Button>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-200/50 border-8 border-white h-[550px]">
                                <GoogleMapComponent locations={WASHING_CENTERS} />
                            </div>
                        </Grid.Col>
                    </Grid>
                </Container>
            </section>
        </Layout>
    );
};

export default HomePage;
