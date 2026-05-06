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
    { label: t('landing.categories.dogs'), emoji: '🐕', value: 'dog', color: 'bg-amber-100 hover:bg-amber-200' },
    { label: t('landing.categories.cats'), emoji: '🐈', value: 'cat', color: 'bg-orange-100 hover:bg-orange-200' },
    { label: t('landing.categories.rabbits'), emoji: '🐇', value: 'rabbit', color: 'bg-pink-100 hover:bg-pink-200' },
    { label: t('landing.categories.birds'), emoji: '🦜', value: 'bird', color: 'bg-green-100 hover:bg-green-200' },
    { label: t('landing.categories.reptiles'), emoji: '🦎', value: 'reptile', color: 'bg-lime-100 hover:bg-lime-200' },
    { label: t('landing.categories.horses'), emoji: '🐴', value: 'horse', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { label: t('landing.categories.other'), emoji: '🐾', value: 'other', color: 'bg-blue-100 hover:bg-blue-200' },
  ];

  const steps = [
    {
      number: '01',
      title: t('landing.howItWorks.step1Title'),
      description: t('landing.howItWorks.step1Desc'),
      emoji: '🔍',
    },
    {
      number: '02',
      title: t('landing.howItWorks.step2Title'),
      description: t('landing.howItWorks.step2Desc'),
      emoji: '💌',
    },
    {
      number: '03',
      title: t('landing.howItWorks.step3Title'),
      description: t('landing.howItWorks.step3Desc'),
      emoji: '🏡',
    },
  ];

  const reasons = [
    {
      title: t('landing.whyAdopt.reason1Title'),
      description: t('landing.whyAdopt.reason1Desc'),
      emoji: '❤️',
    },
    {
      title: t('landing.whyAdopt.reason2Title'),
      description: t('landing.whyAdopt.reason2Desc'),
      emoji: '✨',
    },
    {
      title: t('landing.whyAdopt.reason3Title'),
      description: t('landing.whyAdopt.reason3Desc'),
      emoji: '🎁',
    },
  ];

  const stats = [
    { value: '500+', label: t('landing.stats.animalsListed') },
    { value: '200+', label: t('landing.stats.happyAdoptions') },
    { value: '6', label: t('landing.stats.animalCategories') },
    { value: '100%', label: t('landing.stats.freeForeever') },
  ];

  return (
    <div className='overflow-hidden'>
      {/* Hero */}
      <section className='relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden'>
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
          <div className='text-6xl mb-6'>🐾</div>
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
              className='px-8 py-3 rounded-2xl bg-primary text-white font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg'
            >
              {t('landing.hero.findFriend')}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats strip */}
      <section className='bg-primary py-12'>
        <div className='max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className='text-4xl font-extrabold text-white'>{s.value}</div>
              <div className='text-white/80 mt-1 font-medium'>{s.label}</div>
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
              className={`${cat.color} rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-colors shadow-sm`}
            >
              <span className='text-4xl'>{cat.emoji}</span>
              <span className='font-semibold text-gray-700'>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className='py-24 px-4 bg-white/40'>
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
                className='bg-white rounded-3xl p-8 shadow-sm text-center relative'
              >
                <span className='absolute -top-4 left-6 text-5xl font-extrabold text-primary/20 select-none'>
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
              className='bg-white rounded-3xl p-8 shadow-sm text-center'
            >
              <div className='text-5xl mb-4'>{r.emoji}</div>
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
              className='px-8 py-3 rounded-2xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors'
            >
              {t('landing.recentlyAdded.seeAll')}
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className='py-24 px-4 bg-primary'>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className='max-w-2xl mx-auto text-center'
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
              className='px-8 py-3 rounded-2xl bg-white text-primary font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg'
            >
              {t('landing.cta.startBrowsing')}
            </Link>
            <Link
              to='/register'
              className='px-8 py-3 rounded-2xl border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-primary transition-colors'
            >
              {t('landing.cta.createAccount')}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
