import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow SQLite native module to run on server
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
