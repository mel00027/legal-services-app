// GROQ queries for all content types — aligned with schema definitions

export const SITE_CONFIG_QUERY = `*[_type == "siteConfig"][0] {
  botLink,
  pricingAmount,
  pricingTitle,
  pricingHeadingStart,
  pricingHeadingGradient,
  pricingDisclaimer,
  pricingCtaLabel,
  pricingFeatures[] { _key, label, desc },
  seoDefaults { title, description }
}`;

export const NAVIGATION_QUERY = `*[_type == "navigation"][0] {
  brand { name, accentName },
  desktopLinks[] { _key, label, target },
  mobileTabs[] { _key, label, target, iconName },
  footerLinks[] { _key, label, href }
}`;

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0] {
  hero {
    titleStart,
    titleGradient,
    titleEnd,
    subtitle,
    ctaLabel,
    secondaryCtaLabel
  },
  chatMessages[] { _key, text },
  serviceCards[] { _key, name, iconName, gradient, path },
  advantages[] { _key, iconName, gradient, title, items },
  howItWorks[] { _key, number, title, desc, accent },
  stats[] { _key, value, label },
  trustCard {
    authorName,
    quote,
    reply
  },
  footerCta {
    heading,
    subtitle,
    buttonLabel
  }
}`;

export const SERVICE_PAGE_QUERY = `*[_type == "servicePage" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  hero {
    badgeIconName,
    badge,
    titleStart,
    titleGradient,
    titleEnd,
    gradient,
    subtitle,
    ctaLabel
  },
  services[] { _key, title, desc, iconName, gradient },
  stats[] { _key, value, label },
  expertise { heading, description },
  footerCta { heading, subtitle, buttonLabel },
  seo { title, description }
}`;

export const NOT_FOUND_QUERY = `*[_type == "notFoundPage"][0] {
  badge,
  heading,
  description,
  primaryCtaLabel,
  secondaryCtaLabel,
  helperText
}`;

export const FAQ_QUERY = `*[_type == "faqItem"] | order(order asc) {
  _id,
  question,
  answer
}`;

export const REVIEWS_QUERY = `*[_type == "review"] | order(order asc) {
  _id,
  name,
  role,
  text,
  stars
}`;
