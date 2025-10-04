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
  },
  error: {
    badge: 'Unexpected error',
    title: 'Something went wrong',
    description:
      'An unexpected issue prevented the page from loading correctly. You can retry the action or reach out to our team for assistance.',
    retry: 'Try again',
    home: 'Back to homepage',
    contact: 'Contact support',
    eventIdLabel: 'Reference ID',
    eventIdHelp: 'Share this reference when contacting the organisers so we can locate the issue quickly.',
    digestLabel: 'Diagnostic digest: {digest}'
  }
} as const;
