import withFlowbiteReact from "flowbite-react/plugin/nextjs";

export default withFlowbiteReact({
  reactCompiler: true,
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
