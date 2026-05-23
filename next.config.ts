import withFlowbiteReact from "flowbite-react/plugin/nextjs";

export default withFlowbiteReact({
  reactCompiler: true,
  cacheComponents: true,
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
});
