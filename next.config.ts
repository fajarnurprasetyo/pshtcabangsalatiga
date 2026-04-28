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
});
