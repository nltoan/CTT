export default {
  navigation: {
    home: 'Home',
    news: 'News',
    about: 'About',
    contact: 'Contact'
  },
  actions: {
    viewMore: 'View more',
    primaryCta: 'Contestant Lookup',
    secondaryCta: 'Register now'
  },
  hero: {
    countdownLabel: 'Registration closes in'
  },
  footer: {
    rights: 'All rights reserved.'
  },
  notFound: {
    title: "We can't find the page you're looking for",
    description:
      'The link may be outdated or the content has been removed. Head back to the homepage or try searching to discover more updates.',
    homeCta: 'Back to homepage',
    searchCta: 'Search the site'
  }
} as const;
