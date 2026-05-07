import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetListings, ListingItem } from '_entities/listing';
import { useTranslation } from 'react-i18next';

const floatingAnimals = [
  { emoji: '🐕', delay: '0s', duration: '6s', left: '8%', top: '15%' },
  { emoji: '🐈', delay: '1.2s', duration: '7s', left: '18%', top: '70%' },
  { emoji: '🐇', delay: '0.5s', duration: '5.5s', left: '75%', top: '20%' },
  { emoji: '🐹', delay: '2s', duration: '8s', left: '85%', top: '65%' },
  { emoji: '🦜', delay: '1.8s', duration: '6.5s', left: '55%', top: '10%' },
  { emoji: '🐾', delay: '3s', duration: '7.5s', left: '40%', top: '80%' },
  { emoji: '🐕‍🦺', delay: '0.8s', duration: '9s', left: '92%', top: '40%' },
  { emoji: '🐈‍⬛', delay: '2.5s', duration: '6s', left: '4%', top: '50%' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
};

export const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getAllListings } = useGetListings(1, 4, '', []);

  const categories = [
    { label: t('landing.categories.dogs'), emoji: '🐕', value: 'dog', color: 'bg-amber-100 hover:bg-amber-200 border border-amber-200/60' },
    { label: t('landing.categories.cats'), emoji: '🐈', value: 'cat', color: 'bg-orange-100 hover:bg-orange-200 border border-orange-200/60' },
    { label: t('landing.categories.rabbits'), emoji: '🐇', value: 'rabbit', color: 'bg-pink-100 hover:bg-pink-200 border border-pink-200/60' },
    { label: t('landing.categories.birds'), emoji: '🦜', value: 'bird', color: 'bg-green-100 hover:bg-green-200 border border-green-200/60' },
    { label: t('landing.categories.reptiles'), emoji: '🦎', value: 'reptile', color: 'bg-lime-100 hover:bg-lime-200 border border-lime-200/60' },
    { label: t('landing.categories.horses'), emoji: '🐴', value: 'horse', color: 'bg-yellow-100 hover:bg-yellow-200 border border-yellow-200/60' },
    { label: t('landing.categories.other'), emoji: '🐾', value: 'other', color: 'bg-blue-100 hover:bg-blue-200 border border-blue-200/60' },
  ];

  const steps = [
    {
      number: '01',
      title: t('landing.howItWorks.step1Title'),
      description: t('landing.howItWorks.step1Desc'),
      emoji: '🔍',
      accent: 'bg-blue-50',
    },
    {
      number: '02',
      title: t('landing.howItWorks.step2Title'),
      description: t('landing.howItWorks.step2Desc'),
      emoji: '💌',
      accent: 'bg-pink-50',
    },
    {
      number: '03',
      title: t('landing.howItWorks.step3Title'),
      description: t('landing.howItWorks.step3Desc'),
      emoji: '🏡',
      accent: 'bg-green-50',
    },
  ];

  const reasons = [
    {
      title: t('landing.whyAdopt.reason1Title'),
      description: t('landing.whyAdopt.reason1Desc'),
      emoji: '❤️',
      accent: 'from-red-50 to-pink-50',
    },
    {
      title: t('landing.whyAdopt.reason2Title'),
      description: t('landing.whyAdopt.reason2Desc'),
      emoji: '✨',
      accent: 'from-yellow-50 to-amber-50',
    },
    {
      title: t('landing.whyAdopt.reason3Title'),
      description: t('landing.whyAdopt.reason3Desc'),
      emoji: '🎁',
      accent: 'from-green-50 to-teal-50',
    },
  ];

  const stats = [
    { value: '500+', label: t('landing.stats.animalsListed'), emoji: '🐾' },
    { value: '200+', label: t('landing.stats.happyAdoptions'), emoji: '🏡' },
    { value: '6', label: t('landing.stats.animalCategories'), emoji: '🌿' },
    { value: '100%', label: t('landing.stats.freeForeever'), emoji: '💚' },
  ];

  return (
    <div className='overflow-hidden'>
      {/* Hero */}
      <section
        className='relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden'
        style={{
          background: 'linear-gradient(160deg, #e8f4f0 0%, #d4eae4 30%, #b9cdda 70%, #a8c4d4 100%)',
        }}
      >
        {/* Soft decorative blobs */}
        <div className='absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none' />
        <div className='absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/15 blur-3xl pointer-events-none' />

        {floatingAnimals.map((a, i) => (
          <span
            key={i}
            className='absolute select-none text-5xl pointer-events-none floating-animal'
            style={{
              left: a.left,
              top: a.top,
              animationDuration: a.duration,
              animationDelay: a.delay,
            }}
          >
            {a.emoji}
          </span>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='relative z-10 max-w-3xl'
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary border border-white/80 shadow-sm'
          >
            <span>🐾</span> Free animal adoption platform
          </motion.div>
          <h1 className='text-5xl md:text-7xl font-extrabold text-primary-700 leading-tight mb-6'>
            {t('landing.hero.title1')}
            <br />
            <span className='text-primary'>{t('landing.hero.title2')}</span>
          </h1>
          <p className='text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed'>
            {t('landing.hero.subtitle')}
          </p>
          <div className='flex gap-4 justify-center flex-wrap'>
            <Link
              to='/browse'
              className='px-8 py-3.5 rounded-2xl bg-primary text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5'
            >
              {t('landing.hero.findFriend')}
            </Link>
            <Link
              to='/register'
              className='px-8 py-3.5 rounded-2xl bg-white/80 backdrop-blur-sm text-primary font-semibold text-lg hover:bg-white transition-all shadow-sm border border-white/60'
            >
              {t('landing.cta.createAccount')}
            </Link>
          </div>
        </motion.div>

        {/* Wave divider */}
        <div className='absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none'>
          <svg viewBox='0 0 1440 60' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full'>
            <path d='M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z' fill='#8EAF9D' fillOpacity='0.15' />
            <path d='M0,40 C480,10 960,60 1440,40 L1440,60 L0,60 Z' fill='#8EAF9D' fillOpacity='0.1' />
          </svg>
        </div>
      </section>

      {/* Stats strip */}
      <section className='bg-primary py-14'>
        <div className='max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeUp}
              className='flex flex-col items-center gap-1'
            >
              <div className='text-2xl mb-1'>{s.emoji}</div>
              <div className='text-4xl font-extrabold text-white'>{s.value}</div>
              <div className='text-white/75 text-sm font-medium'>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className='py-24 px-4 max-w-5xl mx-auto'>
        <motion.h2
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className='text-4xl font-extrabold text-center text-primary-700 mb-4'
        >
          {t('landing.categories.title')}
        </motion.h2>
        <motion.p
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className='text-center text-gray-500 mb-12'
        >
          {t('landing.categories.subtitle')}
        </motion.p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4'>
          {categories.map((cat, i) => (
            <motion.button
              key={cat.value}
              custom={i}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeUp}
              onClick={() => navigate(`/browse?category=${cat.value}`)}
              className={`${cat.color} rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-all shadow-sm hover:shadow-md hover:-translate-y-1`}
            >
              <span className='text-4xl'>{cat.emoji}</span>
              <span className='font-semibold text-gray-700 text-sm'>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className='py-24 px-4' style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.5) 100%)' }}>
        <div className='max-w-5xl mx-auto'>
          <motion.h2
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className='text-4xl font-extrabold text-center text-primary-700 mb-4'
          >
            {t('landing.howItWorks.title')}
          </motion.h2>
          <motion.p
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className='text-center text-gray-500 mb-16'
          >
            {t('landing.howItWorks.subtitle')}
          </motion.p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                custom={i}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
                variants={fadeUp}
                className={`${step.accent} rounded-3xl p-8 shadow-sm border border-white/80 text-center relative overflow-hidden`}
              >
                <span className='absolute -top-3 left-5 text-6xl font-extrabold text-primary/10 select-none leading-none'>
                  {step.number}
                </span>
                <div className='text-5xl mb-4 mt-2'>{step.emoji}</div>
                <h3 className='text-xl font-bold text-gray-800 mb-3'>{step.title}</h3>
                <p className='text-gray-500 leading-relaxed'>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Adopt */}
      <section className='py-24 px-4 max-w-5xl mx-auto'>
        <motion.h2
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className='text-4xl font-extrabold text-center text-primary-700 mb-4'
        >
          {t('landing.whyAdopt.title')}
        </motion.h2>
        <motion.p
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className='text-center text-gray-500 mb-16'
        >
          {t('landing.whyAdopt.subtitle')}
        </motion.p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              custom={i}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeUp}
              className={`bg-gradient-to-br ${r.accent} rounded-3xl p-8 shadow-sm border border-white/60 text-center`}
            >
              <div className='w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center text-4xl mx-auto mb-5 shadow-sm'>
                {r.emoji}
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>{r.title}</h3>
              <p className='text-gray-500 leading-relaxed'>{r.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest Animals */}
      <section className='py-24 px-4 max-w-6xl mx-auto'>
        <motion.h2
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className='text-4xl font-extrabold text-center text-primary-700 mb-4'
        >
          {t('landing.recentlyAdded.title')}
        </motion.h2>
        <motion.p
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className='text-center text-gray-500 mb-12'
        >
          {t('landing.recentlyAdded.subtitle')}
        </motion.p>
        {getAllListings.isLoading ? (
          <div className='flex justify-center py-12'>
            <div className='w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin' />
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5'>
            {(getAllListings.data?.listings ?? []).slice(0, 4).map((listing, i) => (
              <motion.div
                key={listing.id}
                custom={i}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <ListingItem listing={listing} />
              </motion.div>
            ))}
          </div>
        )}
        {(getAllListings.data?.listings ?? []).length > 0 && (
          <div className='flex justify-center mt-10'>
            <Link
              to='/browse'
              className='px-8 py-3 rounded-2xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all hover:-translate-y-0.5'
            >
              {t('landing.recentlyAdded.seeAll')}
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className='py-24 px-4 bg-primary relative overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none'>
          <div className='absolute top-10 left-20 w-64 h-64 rounded-full bg-white blur-3xl' />
          <div className='absolute bottom-10 right-20 w-80 h-80 rounded-full bg-white blur-3xl' />
        </div>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className='max-w-2xl mx-auto text-center relative z-10'
        >
          <div className='text-6xl mb-6'>🐾</div>
          <h2 className='text-4xl font-extrabold text-white mb-4'>
            {t('landing.cta.title')}
          </h2>
          <p className='text-white/80 text-lg mb-10'>
            {t('landing.cta.subtitle')}
          </p>
          <div className='flex gap-4 justify-center flex-wrap'>
            <Link
              to='/browse'
              className='px-8 py-3.5 rounded-2xl bg-white text-primary font-semibold text-lg hover:opacity-95 transition-all shadow-lg hover:-translate-y-0.5'
            >
              {t('landing.cta.startBrowsing')}
            </Link>
            <Link
              to='/register'
              className='px-8 py-3.5 rounded-2xl border-2 border-white/70 text-white font-semibold text-lg hover:bg-white/10 transition-all'
            >
              {t('landing.cta.createAccount')}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
