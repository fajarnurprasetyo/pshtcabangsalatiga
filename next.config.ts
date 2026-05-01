import withFlowbiteReact from "flowbite-react/plugin/nextjs";

export default withFlowbiteReact({
  reactCompiler: true,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/sanity-studio",
        permanent: false,
      },
      {
        source: "/article/:slug*",
        destination: "/artikel/:slug*",
        permanent: true,
      },
      {
        source: "/event/:slug*",
        destination: "/kegiatan/:slug*",
        permanent: true,
      },
    ];
  },
});
