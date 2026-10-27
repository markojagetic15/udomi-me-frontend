import { useTranslation } from 'react-i18next';
import { LEGAL, LegalLayout } from './LegalLayout';

const Hr = () => (
  <>
    <section>
      <h2>1. O usluzi</h2>
      <p>
        {LEGAL.operator} je besplatna platforma koja povezuje ljude koji traže
        dom za životinju s onima koji je žele udomiti, te pomaže pronaći
        izgubljene i pronađene životinje. Mi nismo strana u dogovoru o
        udomljavanju i ne posjedujemo životinje iz oglasa.
      </p>
    </section>
    <section>
      <h2>2. Korisnički račun</h2>
      <ul>
        <li>Morate imati najmanje 16 godina i navesti istinite podatke.</li>
        <li>
          Odgovorni ste za sigurnost svoje lozinke i sve aktivnosti na računu.
        </li>
        <li>Jedna osoba ili udruga - jedan račun.</li>
      </ul>
    </section>
    <section>
      <h2>3. Pravila objave</h2>
      <ul>
        <li>
          Oglasi moraju biti istiniti, s vlastitim fotografijama stvarne
          životinje.
        </li>
        <li>
          Zabranjena je prodaja životinja radi zarade, uzgoj za prodaju i
          trgovina zaštićenim vrstama. Dopuštena je razumna naknada za
          udomljavanje koja pokriva troškove (cijepljenje, sterilizacija,
          čipiranje).
        </li>
        <li>
          Morate poštovati Zakon o zaštiti životinja i ostale propise - npr. psi
          moraju biti čipirani prije promjene vlasnika.
        </li>
        <li>
          Zabranjen je uvredljiv, nezakonit ili zavaravajući sadržaj, kao i
          neželjene poruke (spam).
        </li>
      </ul>
    </section>
    <section>
      <h2>4. Moderiranje</h2>
      <p>
        Svaki korisnik može prijaviti oglas. Zadržavamo pravo bez najave
        ukloniti oglas ili blokirati račun koji krši ova pravila ili ugrožava
        dobrobit životinja. O uklanjanju vašeg oglasa obavijestit ćemo vas.
      </p>
    </section>
    <section>
      <h2>5. Vaš sadržaj</h2>
      <p>
        Sadržaj koji objavite ostaje vaš. Objavom nam dajete neisključivo,
        besplatno pravo da ga prikazujemo na platformi i u pregledima poveznica
        (npr. kad netko podijeli oglas) dok je oglas objavljen.
      </p>
    </section>
    <section>
      <h2>6. Odgovornost</h2>
      <p>
        Uslugu pružamo "kakva jest". Ne jamčimo za točnost oglasa, zdravlje
        životinja ni ponašanje korisnika. Prije udomljavanja upoznajte životinju
        uživo, tražite veterinarsku dokumentaciju i nikada ne plaćajte unaprijed
        nepoznatim osobama. U najvećoj mjeri dopuštenoj zakonom ne odgovaramo za
        štetu nastalu iz dogovora među korisnicima.
      </p>
    </section>
    <section>
      <h2>7. Prestanak</h2>
      <p>
        Račun možete obrisati u bilo kojem trenutku u postavkama. Mi možemo
        ukinuti račun koji krši ove uvjete.
      </p>
    </section>
    <section>
      <h2>8. Mjerodavno pravo</h2>
      <p>
        Na ove uvjete primjenjuje se pravo Republike Hrvatske. Kontakt:{' '}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. Obradu osobnih
        podataka opisuje <a href='/privacy'>izjava o privatnosti</a>.
      </p>
    </section>
  </>
);

const En = () => (
  <>
    <section>
      <h2>1. The service</h2>
      <p>
        {LEGAL.operator} is a free platform that connects people rehoming an
        animal with people who want to adopt, and helps find lost and found
        animals. We're not a party to any adoption agreement and don't own the
        animals listed.
      </p>
    </section>
    <section>
      <h2>2. Your account</h2>
      <ul>
        <li>You must be at least 16 and give truthful information.</li>
        <li>
          You're responsible for keeping your password safe and for all activity
          on your account.
        </li>
        <li>One person or organisation - one account.</li>
      </ul>
    </section>
    <section>
      <h2>3. Posting rules</h2>
      <ul>
        <li>
          Listings must be truthful, with your own photos of the actual animal.
        </li>
        <li>
          Selling animals for profit, breeding for sale and trading protected
          species are not allowed. A reasonable adoption fee covering costs
          (vaccination, sterilisation, microchip) is fine.
        </li>
        <li>
          You must follow the Croatian Animal Protection Act and other laws -
          e.g. dogs must be microchipped before changing owner.
        </li>
        <li>
          Offensive, illegal or misleading content and spam are not allowed.
        </li>
      </ul>
    </section>
    <section>
      <h2>4. Moderation</h2>
      <p>
        Anyone can report a listing. We may remove a listing or block an account
        that breaks these rules or endangers animal welfare, without notice.
        We'll let you know if we remove your listing.
      </p>
    </section>
    <section>
      <h2>5. Your content</h2>
      <p>
        What you post stays yours. By posting it you grant us a non-exclusive,
        free right to show it on the platform and in link previews (e.g. when
        someone shares a listing) while the listing is published.
      </p>
    </section>
    <section>
      <h2>6. Liability</h2>
      <p>
        The service is provided "as is". We don't guarantee the accuracy of
        listings, animals' health or users' behaviour. Before adopting, meet the
        animal in person, ask for veterinary records and never pay strangers in
        advance. To the fullest extent permitted by law, we're not liable for
        damage arising from arrangements between users.
      </p>
    </section>
    <section>
      <h2>7. Termination</h2>
      <p>
        You can delete your account at any time in settings. We may terminate
        accounts that breach these terms.
      </p>
    </section>
    <section>
      <h2>8. Governing law</h2>
      <p>
        These terms are governed by Croatian law. Contact:{' '}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. How we handle
        personal data is described in the <a href='/privacy'>privacy policy</a>.
      </p>
    </section>
  </>
);

export const Terms = () => {
  const { t, i18n } = useTranslation();
  return (
    <LegalLayout title={t('legal.termsTitle')}>
      {i18n.language === 'en' ? <En /> : <Hr />}
    </LegalLayout>
  );
};
