import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Three.js + R3F to work without transpilation issues
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;
