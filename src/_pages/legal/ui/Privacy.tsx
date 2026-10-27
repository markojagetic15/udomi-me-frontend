import { useTranslation } from 'react-i18next';
import { LEGAL, LegalLayout } from './LegalLayout';

const Hr = () => (
  <>
    <section>
      <h2>1. Tko obrađuje vaše podatke</h2>
      <p>
        Voditelj obrade je {LEGAL.operator} ({LEGAL.operatorDetails.hr}). Za sva
        pitanja o privatnosti pišite na{' '}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>
    </section>
    <section>
      <h2>2. Koje podatke prikupljamo</h2>
      <ul>
        <li>
          <b>Račun:</b> ime, prezime, e-mail adresa, lozinka (pohranjena
          isključivo kao kriptografski sažetak), jezik i postavke obavijesti,
          profilna fotografija ako je dodate.
        </li>
        <li>
          <b>Oglasi:</b> sadržaj koji objavite - fotografije, opis, podaci o
          životinji, lokacija (grad/kvart i približne koordinate) te, ako ih
          navedete, javni telefon i e-mail za kontakt.
        </li>
        <li>
          <b>Poruke:</b> sadržaj poruka koje razmjenjujete s drugim korisnicima
          putem stranice.
        </li>
        <li>
          <b>Skloništa:</b> naziv, grad, opis, web stranica i telefon udruge
          koje unesete za verifikaciju.
        </li>
        <li>
          <b>Prijave:</b> razlog i opis kad prijavite oglas.
        </li>
        <li>
          <b>Tehnički podaci:</b> IP adresa i vrijeme pristupa u zapisima
          poslužitelja (radi sigurnosti i sprječavanja zlouporabe).
        </li>
      </ul>
    </section>
    <section>
      <h2>3. Zašto i na temelju čega</h2>
      <ul>
        <li>
          <b>Pružanje usluge</b> (čl. 6. st. 1. t. b GDPR-a): otvaranje računa,
          objava oglasa, poruke, obavijesti, spremljene pretrage.
        </li>
        <li>
          <b>Legitimni interes</b> (čl. 6. st. 1. t. f): sigurnost, sprječavanje
          prijevara i zlostavljanja životinja, moderiranje prijavljenih oglasa,
          ograničavanje broja pokušaja prijave.
        </li>
        <li>
          <b>Zakonske obveze</b> (čl. 6. st. 1. t. c) kada nam ih propisuje
          zakon.
        </li>
      </ul>
      <p>
        Ne prodajemo vaše podatke, ne koristimo ih za oglašavanje i ne
        izrađujemo profile za marketing.
      </p>
    </section>
    <section>
      <h2>4. Tko još vidi podatke</h2>
      <ul>
        <li>
          <b>Drugi korisnici</b> vide vaše oglase, ime i inicijal prezimena (ili
          naziv verificiranog skloništa) te poruke koje im pošaljete. Vaša
          e-mail adresa računa nikad nije javna.
        </li>
        <li>
          <b>Pružatelj hostinga</b> (poslužitelj u EU) na kojem se nalaze baza i
          fotografije.
        </li>
        <li>
          <b>Mailjet</b> (Francuska, EU) - slanje e-pošte (potvrda adrese,
          obavijesti, nova lozinka).
        </li>
        <li>
          <b>Google</b> - samo ako se prijavite putem Google računa.
        </li>
        <li>
          <b>OpenStreetMap i Photon (komoot)</b> - karte i pretraga lokacija
          učitavaju se izravno u vašem pregledniku, pa ti servisi vide vašu IP
          adresu.
        </li>
        <li>
          <b>Sentry</b> - ako je uključen, zaprima tehničke izvještaje o
          greškama bez osobnih podataka iz obrazaca.
        </li>
      </ul>
    </section>
    <section>
      <h2>5. Koliko dugo čuvamo podatke</h2>
      <p>
        Podatke računa, oglase i poruke čuvamo dok imate račun. Brisanjem računa
        trajno brišemo račun, sve vaše oglase s fotografijama, razgovore,
        obavijesti i spremljene pretrage. Prijave koje ste podnijeli ostaju
        anonimizirane radi sigurnosti platforme. Sigurnosne kopije brišu se
        automatski nakon 14 dana, a zapisi poslužitelja automatski se rotiraju i
        brišu.
      </p>
    </section>
    <section>
      <h2>6. Vaša prava</h2>
      <p>
        Imate pravo na pristup, ispravak, brisanje, ograničenje obrade,
        prenosivost i prigovor. Kopiju svih podataka možete preuzeti i račun
        obrisati sami u <a href='/profile?tab=settings'>postavkama profila</a>.
        Ako smatrate da kršimo propise, možete podnijeti pritužbu Agenciji za
        zaštitu osobnih podataka (
        <a href='https://azop.hr' target='_blank' rel='noopener noreferrer'>
          azop.hr
        </a>
        ).
      </p>
    </section>
    <section id='cookies'>
      <h2>7. Kolačići i lokalna pohrana</h2>
      <p>
        Koristimo samo ono što je nužno za rad stranice - bez kolačića za
        analitiku ili oglašavanje:
      </p>
      <ul>
        <li>
          <b>token</b> (kolačić, 7 dana) - održava vašu prijavu.
        </li>
        <li>
          <b>udomi-lang</b> (lokalna pohrana) - odabrani jezik.
        </li>
        <li>
          <b>udomi-cookie-notice</b> (lokalna pohrana) - pamti da ste zatvorili
          ovu obavijest.
        </li>
      </ul>
      <p>
        Za nužne kolačiće nije potrebna privola, ali ih možete obrisati u
        postavkama preglednika (tada ćete biti odjavljeni).
      </p>
    </section>
    <section>
      <h2>8. Djeca</h2>
      <p>Usluga je namijenjena osobama starijima od 16 godina.</p>
    </section>
    <section>
      <h2>9. Izmjene</h2>
      <p>
        O bitnim izmjenama ove izjave obavijestit ćemo vas na stranici ili
        e-poštom.
      </p>
    </section>
  </>
);

const En = () => (
  <>
    <section>
      <h2>1. Who processes your data</h2>
      <p>
        The data controller is {LEGAL.operator} ({LEGAL.operatorDetails.en}).
        For any privacy question, write to{' '}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>
    </section>
    <section>
      <h2>2. What we collect</h2>
      <ul>
        <li>
          <b>Account:</b> first and last name, email address, password (stored
          only as a cryptographic hash), language and notification settings,
          profile photo if you add one.
        </li>
        <li>
          <b>Listings:</b> what you publish - photos, description, animal
          details, location (city/area and approximate coordinates) and, if you
          add them, a public contact phone and email.
        </li>
        <li>
          <b>Messages:</b> the content of messages you exchange with other users
          on the site.
        </li>
        <li>
          <b>Shelters:</b> the organisation name, city, description, website and
          phone you submit for verification.
        </li>
        <li>
          <b>Reports:</b> the reason and details when you report a listing.
        </li>
        <li>
          <b>Technical data:</b> IP address and access time in server logs (for
          security and abuse prevention).
        </li>
      </ul>
    </section>
    <section>
      <h2>3. Why, and on what legal basis</h2>
      <ul>
        <li>
          <b>Providing the service</b> (GDPR art. 6(1)(b)): your account,
          listings, messages, notifications, saved searches.
        </li>
        <li>
          <b>Legitimate interest</b> (art. 6(1)(f)): security, preventing fraud
          and animal abuse, moderating reported listings, limiting login
          attempts.
        </li>
        <li>
          <b>Legal obligations</b> (art. 6(1)(c)) where the law requires it.
        </li>
      </ul>
      <p>
        We don't sell your data, use it for advertising, or build marketing
        profiles.
      </p>
    </section>
    <section>
      <h2>4. Who else sees it</h2>
      <ul>
        <li>
          <b>Other users</b> see your listings, your first name and last initial
          (or verified shelter name) and messages you send them. Your account
          email is never public.
        </li>
        <li>
          <b>Our hosting provider</b> (a server in the EU) that stores the
          database and photos.
        </li>
        <li>
          <b>Mailjet</b> (France, EU) - sends email (address confirmation,
          notifications, password reset).
        </li>
        <li>
          <b>Google</b> - only if you sign in with a Google account.
        </li>
        <li>
          <b>OpenStreetMap and Photon (komoot)</b> - maps and location search
          load directly in your browser, so these services see your IP address.
        </li>
        <li>
          <b>Sentry</b> - if enabled, receives technical error reports without
          personal data from forms.
        </li>
      </ul>
    </section>
    <section>
      <h2>5. How long we keep it</h2>
      <p>
        We keep account data, listings and messages while you have an account.
        Deleting your account permanently removes it along with all your
        listings and photos, conversations, notifications and saved searches.
        Reports you filed stay, anonymised, for platform safety. Backups are
        deleted automatically after 14 days, and server logs are rotated and
        deleted automatically.
      </p>
    </section>
    <section>
      <h2>6. Your rights</h2>
      <p>
        You have the right to access, rectify, erase, restrict, port and object.
        You can download a copy of all your data and delete your account
        yourself in <a href='/profile?tab=settings'>profile settings</a>. If you
        believe we break the rules, you can complain to the Croatian Personal
        Data Protection Agency (
        <a href='https://azop.hr' target='_blank' rel='noopener noreferrer'>
          azop.hr
        </a>
        ).
      </p>
    </section>
    <section id='cookies'>
      <h2>7. Cookies and local storage</h2>
      <p>
        We only use what's strictly necessary for the site to work - no
        analytics or advertising cookies:
      </p>
      <ul>
        <li>
          <b>token</b> (cookie, 7 days) - keeps you logged in.
        </li>
        <li>
          <b>udomi-lang</b> (local storage) - your chosen language.
        </li>
        <li>
          <b>udomi-cookie-notice</b> (local storage) - remembers that you closed
          this notice.
        </li>
      </ul>
      <p>
        Strictly necessary storage doesn't require consent, but you can clear it
        in your browser settings (you'll be logged out).
      </p>
    </section>
    <section>
      <h2>8. Children</h2>
      <p>The service is intended for people aged 16 and over.</p>
    </section>
    <section>
      <h2>9. Changes</h2>
      <p>
        We'll let you know about material changes to this policy on the site or
        by email.
      </p>
    </section>
  </>
);

export const Privacy = () => {
  const { t, i18n } = useTranslation();
  return (
    <LegalLayout title={t('legal.privacyTitle')}>
      {i18n.language === 'en' ? <En /> : <Hr />}
    </LegalLayout>
  );
};
