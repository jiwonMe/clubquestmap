/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 필요한 경우 외부 이미지 도메인 설정
    ],
  },
  webpack(config) {
    // SVG 파일을 위한 설정 추가
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  }
}

export default nextConfig;