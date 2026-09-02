/** @type {import('next').NextConfig} */
const nextConfig = {
  /* The site is one newspaper now. Old section URLs open it at the page
     they used to be. */
  async redirects() {
    return [
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
