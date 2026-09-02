/** @type {import('next').NextConfig} */
const nextConfig = {
  /* The site is one newspaper now. Old section URLs open it at the page
     they used to be. */
  async redirects() {
    return [
      /* One canonical host. Vercel normally settles this at the domain, but
         a misconfiguration must not leave two indexable copies of the site. */
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.yashb.dev" }],
        destination: "https://yashb.dev/:path*",
        permanent: true,
      },
      { source: "/edition", destination: "/", permanent: true },
      { source: "/about", destination: "/#profile", permanent: true },
      { source: "/work", destination: "/#toolkit", permanent: true },
      { source: "/experience", destination: "/#business", permanent: true },
      { source: "/contact", destination: "/#classifieds", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
