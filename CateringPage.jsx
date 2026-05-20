import { useEffect, useMemo, useRef, useState } from 'react';
import Navigation from './components/Navigation';
import PromoBanner from './components/PromoBanner';
import Footer from './components/Footer';
import { CONTACT_EMAIL, EVERYDAY_HOURS, LOCATIONS } from './constants/locations';
import { interpolate, useLanguage } from './hooks/useLanguage';
import { useScrollReveal } from './hooks/useScrollReveal';
import { revealStyle } from './utils/revealStyle';

const PACKAGE_IMAGES = [
  '/assets/whole-chicken.avif',
  '/assets/parrillada-familiar.webp',
  '/assets/1lb-beef-fajita.webp',
];

const EVENT_TYPES = [
  'family',
  'office',
  'birthday',
  'graduation',
  'corporate',
  'wedding',
  'other',
];

const SERVICE_STYLES = [
  'pickup',
  'largeOrder',
  'guidance',
];

const DAY_LABELS = {
  es: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
};

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  eventDate: '',
  eventTime: '',
  guests: '',
  eventType: EVENT_TYPES[0],
  preferredLocation: LOCATIONS[0].name,
  serviceStyle: SERVICE_STYLES[0],
  budget: '',
  notes: '',
};

function Field({ label, id, required, children }) {
  return (
    <div className="block">
      <label htmlFor={id} className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-white/50">
        {label}{required ? ' *' : ''}
      </label>
      {children}
    </div>
  );
}

function inputClass() {
  return 'w-full border border-white/10 bg-white/[0.07] px-4 py-3.5 text-sm font-semibold text-white placeholder:text-white/30 transition-colors focus:border-primary focus:bg-white/[0.1] focus:outline-none';
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function getMonthLabel(date, language) {
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-MX', { month: 'long' }).format(date);
}

function formatDisplayDate(value, language, placeholder) {
  const date = parseDateInputValue(value);
  if (!date) return placeholder;

  const month = getMonthLabel(date, language);
  return `${String(date.getDate()).padStart(2, '0')} ${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getCalendarDays(monthDate) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const mondayIndex = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - mondayIndex);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    return day;
  });
}

function CustomSelect({ id, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { t } = useLanguage();
  const selectedOption = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex min-h-[3.25rem] w-full items-center justify-between border px-4 py-3.5 text-left text-sm font-bold text-white transition-colors focus:outline-none ${
          open ? 'border-primary bg-white/[0.1] shadow-[0_0_0_1px_rgba(198,9,9,0.45)]' : 'border-white/10 bg-white/[0.07] hover:border-white/20'
        }`}
      >
        <span>{selectedOption?.label}</span>
        <svg
          className={`h-4 w-4 text-white transition-transform duration-200 ${open ? 'rotate-180 text-primary' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden border border-primary/45 bg-[#121111] shadow-[0_24px_60px_rgba(0,0,0,0.52)]">
          <div className="border-b border-white/10 bg-black/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            {t.catering.form.selectLabel}
          </div>
          <ul role="listbox" aria-labelledby={id} className="max-h-64 overflow-y-auto py-1">
            {options.map((option) => {
              const selected = option.value === value;

              return (
                <li key={option.value} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors ${
                      selected
                        ? 'bg-primary text-white'
                        : 'text-white/75 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    <span>{option.label}</span>
                    {selected && (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function DatePicker({ id, value, onChange, error }) {
  const selectedDate = parseDateInputValue(value);
  const [open, setOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(selectedDate || new Date());
  const wrapperRef = useRef(null);
  const today = startOfDay(new Date());
  const days = getCalendarDays(monthDate);
  const { language, t } = useLanguage();

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setMonthDate(selectedDate);
    }
  }, [value]);

  const changeMonth = (direction) => {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex min-h-[3.25rem] w-full items-center justify-between border px-4 py-3.5 text-left text-sm font-bold transition-colors focus:outline-none ${
          open || error
            ? 'border-primary bg-white/[0.1] shadow-[0_0_0_1px_rgba(198,9,9,0.45)]'
            : 'border-white/10 bg-white/[0.07] hover:border-white/20'
        } ${value ? 'text-white' : 'text-white/40'}`}
      >
        <span>{formatDisplayDate(value, language, t.catering.form.datePlaceholder)}</span>
        <svg
          className={`h-4 w-4 transition-colors ${open ? 'text-primary' : 'text-white/55'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
        </svg>
      </button>

      {error && (
        <p className="mt-2 text-xs font-bold text-primary">{error}</p>
      )}

      {open && (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[20rem] max-w-[calc(100vw-2rem)] border border-primary/45 bg-[#121111] p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.58)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.06] text-white/70 transition-colors hover:border-primary hover:text-primary"
              aria-label="Mes anterior"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <p className="font-display text-2xl uppercase leading-none tracking-[0.03em] text-white">
                {getMonthLabel(monthDate, language)}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.26em] text-primary">{monthDate.getFullYear()}</p>
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.06] text-white/70 transition-colors hover:border-primary hover:text-primary"
              aria-label="Mes siguiente"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
            {DAY_LABELS[language].map((day, index) => (
              <span key={`${day}-${index}`} className="py-1">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayValue = toDateInputValue(day);
              const isSelected = value === dayValue;
              const isCurrentMonth = day.getMonth() === monthDate.getMonth();
              const disabled = startOfDay(day) < today;

              return (
                <button
                  key={dayValue}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(dayValue);
                    setOpen(false);
                  }}
                  className={`flex aspect-square items-center justify-center text-sm font-black transition-colors ${
                    isSelected
                      ? 'bg-primary text-white shadow-cta'
                      : disabled
                        ? 'cursor-not-allowed text-white/15'
                        : isCurrentMonth
                          ? 'bg-white/[0.06] text-white hover:bg-primary/80'
                          : 'bg-white/[0.025] text-white/35 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => {
                const todayValue = toDateInputValue(today);
                onChange(todayValue);
                setMonthDate(today);
                setOpen(false);
              }}
              className="text-xs font-black uppercase tracking-[0.16em] text-primary hover:underline"
            >
              {t.catering.form.today}
            </button>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Al Carbon Catering</span>
          </div>
        </div>
      )}
    </div>
  );
}

function PackageCard({ item, index }) {
  const [ref, visible] = useScrollReveal(0.08);

  return (
    <article
      ref={ref}
      className="group overflow-hidden rounded-lg border border-coal-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover"
      style={revealStyle(visible, { y: 26, duration: 0.6, delay: index * 90 })}
    >
      <div className="relative h-64 overflow-hidden bg-coal-900">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-primary">{item.kicker}</p>
          <h3 className="mt-2 font-display text-4xl uppercase leading-[0.86] tracking-[0.03em] text-white">{item.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-7 text-coal-500">{item.desc}</p>
        <div className="mt-5 border-t border-coal-100 pt-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-coal-400">{item.detail}</p>
        </div>
      </div>
    </article>
  );
}

function CateringForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [dateError, setDateError] = useState('');
  const { t } = useLanguage();

  const estimatedSummary = useMemo(() => {
    const guests = Number(form.guests);
    if (!guests || guests < 1) return t.catering.form.emptyGuests;
    if (guests <= 20) return t.catering.form.compact;
    if (guests <= 60) return t.catering.form.event;
    return t.catering.form.large;
  }, [form.guests, t]);

  const eventTypeOptions = EVENT_TYPES.map((type) => ({
    value: type,
    label: t.catering.eventTypes[type],
  }));

  const serviceStyleOptions = SERVICE_STYLES.map((style) => ({
    value: style,
    label: t.catering.serviceStyles[style],
  }));

  const locationOptions = LOCATIONS.map((location) => ({
    value: location.name,
    label: location.name,
  }));

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    if (name === 'eventDate') {
      setDateError('');
    }
  };

  const buildEmailBody = () => [
    'New catering request from alcarbonsatx.com/catering',
    '',
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Company / Organization: ${form.company || 'N/A'}`,
    '',
    `Event date: ${form.eventDate || 'TBD'}`,
    `Event time: ${form.eventTime || 'TBD'}`,
    `Guest count: ${form.guests || 'TBD'}`,
    `Event type: ${t.catering.eventTypes[form.eventType]}`,
    `Preferred location: ${form.preferredLocation}`,
    `Service style: ${t.catering.serviceStyles[form.serviceStyle]}`,
    `Estimated budget: ${form.budget || 'N/A'}`,
    '',
    'Event notes:',
    form.notes || 'N/A',
  ].join('\n');

  const submit = (event) => {
    event.preventDefault();
    if (!form.eventDate) {
      setDateError(t.catering.form.dateError);
      return;
    }

    const subject = `Catering request - ${form.name || 'Al Carbon'} - ${form.eventDate || 'date TBD'}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildEmailBody())}`;

    setSubmitted(true);
    window.location.href = mailto;
  };

  return (
    <form onSubmit={submit} className="grid scroll-mt-56 gap-5 sm:scroll-mt-32" id="catering-form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={t.catering.form.name} required>
          <input id="name" name="name" value={form.name} onChange={update} required className={inputClass()} placeholder={t.catering.form.namePlaceholder} />
        </Field>
        <Field id="email" label={t.catering.form.email} required>
          <input id="email" name="email" type="email" value={form.email} onChange={update} required className={inputClass()} placeholder="tu@email.com" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label={t.catering.form.phone} required>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={update} required className={inputClass()} placeholder="(210) 000-0000" />
        </Field>
        <Field id="company" label={t.catering.form.company}>
          <input id="company" name="company" value={form.company} onChange={update} className={inputClass()} placeholder={t.catering.form.companyPlaceholder} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field id="eventDate" label={t.catering.form.date} required>
          <DatePicker
            id="eventDate"
            value={form.eventDate}
            onChange={(value) => updateField('eventDate', value)}
            error={dateError}
          />
        </Field>
        <Field id="eventTime" label={t.catering.form.time}>
          <input id="eventTime" name="eventTime" type="time" value={form.eventTime} onChange={update} className={inputClass()} />
        </Field>
        <Field id="guests" label={t.catering.form.guests} required>
          <input id="guests" name="guests" type="number" min="1" value={form.guests} onChange={update} required className={inputClass()} placeholder="50" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="eventType" label={t.catering.form.eventType}>
          <CustomSelect
            id="eventType"
            value={form.eventType}
            options={eventTypeOptions}
            onChange={(value) => updateField('eventType', value)}
          />
        </Field>
        <Field id="preferredLocation" label={t.catering.form.location}>
          <CustomSelect
            id="preferredLocation"
            value={form.preferredLocation}
            options={locationOptions}
            onChange={(value) => updateField('preferredLocation', value)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="serviceStyle" label={t.catering.form.service}>
          <CustomSelect
            id="serviceStyle"
            value={form.serviceStyle}
            options={serviceStyleOptions}
            onChange={(value) => updateField('serviceStyle', value)}
          />
        </Field>
        <Field id="budget" label={t.catering.form.budget}>
          <input id="budget" name="budget" value={form.budget} onChange={update} className={inputClass()} placeholder="$500 - $1,000" />
        </Field>
      </div>

      <Field id="notes" label={t.catering.form.notes} required>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={update}
          required
          rows="5"
          className={`${inputClass()} resize-y`}
          placeholder={t.catering.form.notesPlaceholder}
        />
      </Field>

      <div className="grid gap-4 border-y border-white/10 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <p className="text-sm leading-6 text-white/50">{estimatedSummary}</p>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-base font-bold text-white shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-primary-dark hover:shadow-cta-hover active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
        >
          {t.catering.form.submit}
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-16 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <p className="text-xs leading-5 text-white/40" aria-live="polite">
        {submitted
          ? interpolate(t.catering.form.sent, { email: CONTACT_EMAIL })
          : interpolate(t.catering.form.help, { email: CONTACT_EMAIL })}
      </p>
    </form>
  );
}

export default function CateringPage() {
  const [introRef, introVisible] = useScrollReveal();
  const [processRef, processVisible] = useScrollReveal(0.08);
  const [formRef, formVisible] = useScrollReveal(0.08);
  const { t } = useLanguage();
  const packageCards = t.catering.packages.map((item, index) => ({
    ...item,
    image: PACKAGE_IMAGES[index],
  }));

  useEffect(() => {
    document.title = t.catering.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', t.catering.meta);
    }

    if (window.location.hash) {
      window.setTimeout(() => {
        document.querySelector(window.location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }, [t]);

  return (
    <div className="min-h-screen bg-coal-950 text-coal-50">
      <PromoBanner />
      <Navigation />

      <main>
        <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-black">
          <div className="absolute inset-0">
            <img
              src="/assets/parrillada-familiar.webp"
              alt="Parrillada familiar Al Carbon para catering"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.92))]" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_0.52fr] lg:items-end">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex max-w-full items-center gap-3 border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm animate-fade-in sm:px-4 sm:text-xs sm:tracking-[0.28em]">
                <span className="h-2 w-2 bg-primary" />
                {t.catering.heroEyebrow}
              </div>
              <h1 className="font-display mb-5 text-[4rem] font-black uppercase leading-[0.82] tracking-[0.03em] text-white animate-fade-in delay-100 sm:text-[6rem] md:text-[7.6rem]">
                Catering
                <span className="mt-3 block text-[1.65rem] leading-none tracking-[0.18em] text-primary sm:text-[2.35rem] md:text-[3rem]">
                  {t.catering.heroSubtitle}
                </span>
              </h1>
              <p className="mb-8 max-w-2xl text-lg leading-8 text-white/75 animate-fade-in delay-200 md:text-xl">
                {t.catering.heroCopy}
              </p>
              <div className="flex flex-col gap-3 animate-fade-in delay-300 sm:flex-row">
                <a
                  href="#catering-form"
                  className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-lg font-bold text-white shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-primary-dark hover:shadow-cta-hover active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                  {t.catering.quote}
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Catering%20Al%20Carbon`}
                  className="inline-flex items-center justify-center gap-2 border border-white/40 bg-white/10 px-7 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-white hover:bg-white hover:text-black active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                  {t.common.directEmail}
                </a>
              </div>
            </div>

            <aside className="border-y border-white/15 py-6 text-white/75 lg:border-l lg:border-y-0 lg:pl-7 animate-fade-in delay-400">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-primary">{t.catering.statsEyebrow}</p>
              <div className="mt-5 grid grid-cols-3 gap-4 lg:grid-cols-1">
                <div>
                  <p className="font-display text-4xl uppercase text-white">5</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">{t.catering.branches}</p>
                </div>
                <div>
                  <p className="font-display text-4xl uppercase text-white">11-9</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">{t.catering.daily}</p>
                </div>
                <div>
                  <p className="font-display text-4xl uppercase text-white">{t.catering.fire}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">{t.catering.regional}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-coal-50 py-20 text-coal-900 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div
              ref={introRef}
              className="mx-auto mb-12 max-w-3xl text-center"
              style={revealStyle(introVisible, { y: 24 })}
            >
              <span className="mb-3 inline-block text-sm font-black uppercase tracking-[0.32em] text-primary">{t.catering.introEyebrow}</span>
              <h2 className="mb-4 font-display text-5xl uppercase leading-[0.88] tracking-[0.03em] text-coal-900 md:text-7xl">
                {t.catering.introTitle}
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-8 text-coal-500">
                {t.catering.introCopy}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {packageCards.map((item, index) => (
                <PackageCard key={item.title} item={item} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-black py-20 text-white md:py-24">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1fr] lg:items-center">
            <div
              ref={processRef}
              style={revealStyle(processVisible, { y: 24 })}
            >
              <span className="inline-flex items-center gap-3 border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-primary">
                <span className="h-2 w-2 bg-primary" />
                {t.catering.processEyebrow}
              </span>
              <h2 className="mt-6 font-display text-5xl uppercase leading-[0.88] tracking-[0.03em] text-white md:text-6xl">
                {t.catering.processTitle}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/50">
                {t.catering.processCopy}
              </p>
            </div>

            <div className="grid gap-4">
              {t.catering.steps.map((step, index) => (
                <article key={step.title} className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.055] p-5 transition-colors hover:border-primary/40 sm:grid-cols-[auto_1fr]">
                  <span className="font-display text-5xl uppercase leading-none text-primary">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display text-3xl uppercase leading-none tracking-[0.03em] text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/50">{step.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-coal-950 py-20 text-white md:py-24">
          <div className="absolute inset-0 opacity-25">
            <img
              src="/assets/cover.avif"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/80" />
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.58fr_1fr] lg:items-start">
            <div
              ref={formRef}
              className="lg:sticky lg:top-24"
              style={revealStyle(formVisible, { y: 24 })}
            >
              <span className="inline-flex items-center gap-3 border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-primary">
                <span className="h-2 w-2 bg-primary" />
                {t.catering.requestEyebrow}
              </span>
              <h2 className="mt-6 font-display text-5xl uppercase leading-[0.88] tracking-[0.03em] text-white md:text-6xl">
                {t.catering.requestTitle}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/50">
                {t.catering.requestCopy}{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-primary hover:underline">{CONTACT_EMAIL}</a>.
              </p>
              <div className="mt-8 grid gap-3 text-sm text-white/50">
                <div className="border border-white/10 bg-black/40 px-4 py-3">
                  <span className="font-bold text-white">{t.catering.hoursLabel}:</span> {t.catering.everyDay} {EVERYDAY_HOURS}
                </div>
                <div className="border border-white/10 bg-black/40 px-4 py-3">
                  <span className="font-bold text-white">{t.catering.coverageLabel}:</span> {t.catering.coverage}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/75 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.42)] backdrop-blur-md sm:p-7">
              <CateringForm />
            </div>
          </div>
        </section>

        <section className="bg-coal-50 py-16 text-coal-900 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-sm font-black uppercase tracking-[0.32em] text-primary">{t.catering.locationEyebrow}</span>
                <h2 className="mt-3 font-display text-5xl uppercase leading-[0.88] tracking-[0.03em] text-coal-900 md:text-6xl">
                  {t.catering.locationTitle}
                </h2>
              </div>
              <a href="/#locations" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-primary hover:underline">
                {t.catering.viewMap}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {LOCATIONS.map((location) => (
                <article key={location.name} className="rounded-lg border border-coal-100 bg-white p-4 shadow-card">
                  <h3 className="font-display text-2xl uppercase leading-none tracking-[0.03em] text-coal-900">{location.name}</h3>
                  <p className="mt-3 text-xs leading-5 text-coal-500">{location.compactAddress}</p>
                  <a href={location.phoneHref} className="mt-4 inline-flex text-sm font-bold text-primary hover:underline">{location.phone}</a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
