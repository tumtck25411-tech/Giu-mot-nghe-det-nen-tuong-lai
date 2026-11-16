'use client';

import React from 'react';

interface TayNguyenLandscapeBannerProps {
  className?: string;
}

export default function TayNguyenLandscapeBanner({ className = '' }: TayNguyenLandscapeBannerProps) {
  return (
    <div
      className={`w-full relative overflow-hidden select-none pointer-events-none ${className}`}
      style={{
        backgroundColor: 'transparent',
      }}
      aria-label="Toàn cảnh núi rừng Tây Nguyên mờ sương"
    >
      {/* 
        Container with exact specified height:
        Desktop: 180px - 240px
        Mobile: 120px - 160px
      */}
      <div className="relative w-full h-[130px] sm:h-[160px] md:h-[200px] lg:h-[240px] flex items-end">
        {/* Layer 1: High-Resolution Photographic Highland Mist Texture (Subtle depth) */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-bottom opacity-30 mix-blend-multiply transition-opacity"
          style={{
            backgroundImage: "url('/images/custom/tay_nguyen_misty_mountain.jpg')",
          }}
        />

        {/* Layer 2: Top Feathered Fog Gradient (Seamless dissolve into cotton paper background #FAF7F2) */}
        <div
          className="absolute inset-x-0 top-0 h-16 sm:h-24 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #FAF7F2 10%, rgba(250, 247, 242, 0.7) 45%, rgba(250, 247, 242, 0) 100%)',
          }}
        />

        {/* Layer 3: Multi-Layered Vector Panoramic Landscape SVG (Razor-sharp at any resolution) */}
        <svg
          viewBox="0 0 1440 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-full relative z-20 block"
        >
          <defs>
            {/* Soft Dawn / Mist Gradients */}
            <linearGradient id="skyAtmosphere" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAF7F2" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#EBF4EE" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4E7DC" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="valleyFog1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="45%" stopColor="#FAF5EC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FAF5EC" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="valleyFog2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="55%" stopColor="#EFF5F1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#D8E8DF" stopOpacity="0" />
            </linearGradient>

            {/* Cascading Mountain Ridges - Highland Green Palette */}
            <linearGradient id="gradMountDistant" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ABFA8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#7DA694" />
            </linearGradient>

            <linearGradient id="gradMountMidFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5D947C" />
              <stop offset="100%" stopColor="#437761" />
            </linearGradient>

            <linearGradient id="gradMountMidNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#316B53" />
              <stop offset="100%" stopColor="#235440" />
            </linearGradient>

            <linearGradient id="gradMountNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E543E" />
              <stop offset="100%" stopColor="#174C38" />
            </linearGradient>

            <linearGradient id="gradForeground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#174C38" />
              <stop offset="100%" stopColor="#0B261B" />
            </linearGradient>
          </defs>

          {/* Atmosphere base */}
          <rect width="1440" height="240" fill="url(#skyAtmosphere)" />

          {/* LAYER 1: Distant Undulating Mountain Silhouettes (Peaks around y=65-95) */}
          <path
            d="M 0 120 C 130 90, 240 68, 380 78 C 500 88, 600 115, 720 100 C 840 85, 960 62, 1080 72 C 1200 82, 1330 110, 1440 95 L 1440 240 L 0 240 Z"
            fill="#8BAF9E"
            opacity="0.65"
          />

          {/* Valley Mist 1 */}
          <path
            d="M 0 110 Q 360 85 720 108 T 1440 105 L 1440 145 L 0 145 Z"
            fill="url(#valleyFog1)"
            opacity="0.8"
          />

          {/* LAYER 2: Mid-Distant Mountain Ridge (Peaks at x=280, 770, 1280) */}
          <path
            d="M 0 140 C 90 120, 180 102, 280 108 C 380 114, 460 138, 550 128 C 640 118, 710 95, 800 98 C 890 101, 970 132, 1060 122 C 1150 112, 1240 88, 1340 102 C 1390 109, 1420 118, 1440 122 L 1440 240 L 0 240 Z"
            fill="url(#gradMountMidFar)"
            opacity="0.85"
          />

          {/* Valley Mist 2 */}
          <path
            d="M 0 148 Q 420 130 840 148 T 1440 142 L 1440 180 L 0 180 Z"
            fill="url(#valleyFog2)"
            opacity="0.85"
          />

          {/* LAYER 3: Mid-Near Ridgelines (Chư Păh pine plateaus) */}
          <path
            d="M 0 168 C 100 152, 190 132, 280 138 C 370 144, 450 168, 540 160 C 630 152, 710 128, 800 134 C 890 140, 970 166, 1060 158 C 1150 150, 1250 132, 1340 138 C 1390 141, 1420 152, 1440 150 L 1440 240 L 0 240 Z"
            fill="url(#gradMountMidNear)"
            opacity="0.95"
          />

          {/* LAYER 4: Near Rolling Hills (y=165-200) */}
          <path
            d="M 0 192 C 110 178, 220 162, 330 170 C 440 178, 530 198, 640 190 C 750 182, 840 165, 950 168 C 1060 171, 1160 192, 1270 184 C 1350 178, 1410 184, 1440 188 L 1440 240 L 0 240 Z"
            fill="url(#gradMountNear)"
          />

          {/* LAYER 5: Foreground Rolling Slopes */}
          <path
            d="M 0 216 C 100 206, 200 194, 300 200 C 400 206, 480 220, 580 214 C 680 208, 770 196, 870 199 C 970 202, 1060 218, 1170 212 C 1270 206, 1370 198, 1440 204 L 1440 240 L 0 240 Z"
            fill="url(#gradForeground)"
          />

          {/* 
            LAYER 6: NATIVE PINE TREES (Thông ba lá Tây Nguyên) 
            Detailed evergreen pine silhouettes framing the left and right flanks
          */}
          {/* Left Flank Pine Forest (x = 10 to 240) */}
          <g className="pine-cluster-left">
            {/* Tallest Pines */}
            <path d="M 50 115 L 62 145 L 38 145 Z M 50 135 L 68 175 L 32 175 Z M 50 165 L 75 215 L 25 215 Z M 47 215 L 53 215 L 53 238 L 47 238 Z" fill="#0A2218" />
            <path d="M 22 125 L 34 152 L 10 152 Z M 22 142 L 39 180 L 5 180 Z M 22 170 L 44 218 L 0 218 Z M 19 218 L 25 218 L 25 238 L 19 238 Z" fill="#0D2B1F" />
            <path d="M 85 130 L 96 155 L 74 155 Z M 85 148 L 102 182 L 68 182 Z M 85 174 L 108 220 L 62 220 Z M 82 220 L 88 220 L 88 238 L 82 238 Z" fill="#0B261B" />
            <path d="M 120 145 L 130 168 L 110 168 Z M 120 162 L 135 192 L 105 192 Z M 120 185 L 140 225 L 100 225 Z M 117 225 L 123 225 L 123 238 L 117 238 Z" fill="#113626" />
            <path d="M 155 158 L 164 178 L 146 178 Z M 155 173 L 168 200 L 142 200 Z M 155 194 L 172 228 L 138 228 Z M 153 228 L 157 228 L 157 238 L 153 238 Z" fill="#154230" />
            <path d="M 190 170 L 198 188 L 182 188 Z M 190 184 L 202 208 L 178 208 Z M 190 202 L 206 230 L 174 230 Z M 188 230 L 192 230 L 192 238 L 188 238 Z" fill="#1A4F3A" />
            <path d="M 225 182 L 232 198 L 218 198 Z M 225 194 L 235 214 L 215 214 Z M 225 210 L 238 232 L 212 232 Z M 223 232 L 227 232 L 227 238 L 223 238 Z" fill="#205B43" />
          </g>

          {/* Right Flank Pine Forest (x = 1200 to 1435) */}
          <g className="pine-cluster-right">
            <path d="M 1390 115 L 1402 145 L 1378 145 Z M 1390 135 L 1408 175 L 1372 175 Z M 1390 165 L 1415 215 L 1365 215 Z M 1387 215 L 1393 215 L 1393 238 L 1387 238 Z" fill="#0A2218" />
            <path d="M 1420 128 L 1431 154 L 1409 154 Z M 1420 145 L 1436 182 L 1404 182 Z M 1420 173 L 1442 220 L 1398 220 Z M 1417 220 L 1423 220 L 1423 238 L 1417 238 Z" fill="#0D2B1F" />
            <path d="M 1355 130 L 1366 155 L 1344 155 Z M 1355 148 L 1372 182 L 1338 182 Z M 1355 174 L 1378 220 L 1332 220 Z M 1352 220 L 1358 220 L 1358 238 L 1352 238 Z" fill="#0B261B" />
            <path d="M 1320 145 L 1330 168 L 1310 168 Z M 1320 162 L 1335 192 L 1305 192 Z M 1320 185 L 1340 225 L 1300 225 Z M 1317 225 L 1323 225 L 1323 238 L 1317 238 Z" fill="#113626" />
            <path d="M 1285 158 L 1294 178 L 1276 178 Z M 1285 173 L 1298 200 L 1272 200 Z M 1285 194 L 1302 228 L 1268 228 Z M 1283 228 L 1287 228 L 1287 238 L 1283 238 Z" fill="#154230" />
            <path d="M 1250 170 L 1258 188 L 1242 188 Z M 1250 184 L 1262 208 L 1238 208 Z M 1250 202 L 1266 230 L 1234 230 Z M 1248 230 L 1252 230 L 1252 238 L 1248 238 Z" fill="#1A4F3A" />
            <path d="M 1215 182 L 1222 198 L 1208 198 Z M 1215 194 L 1225 214 L 1205 214 Z M 1215 210 L 1228 232 L 1202 232 Z M 1213 232 L 1217 232 L 1217 238 L 1213 238 Z" fill="#205B43" />
          </g>

          {/* Scattered Mid-Ridge Pines across center horizons */}
          <g className="pines-midground" opacity="0.85">
            <polygon points="360,165 367,185 353,185" fill="#1A4A36" />
            <polygon points="360,180 370,200 350,200" fill="#1A4A36" />
            <polygon points="490,158 496,176 484,176" fill="#215941" />
            <polygon points="490,172 499,190 481,190" fill="#215941" />
            <polygon points="650,188 658,208 642,208" fill="#174431" />
            <polygon points="650,202 662,222 638,222" fill="#174431" />
            <polygon points="820,166 827,184 813,184" fill="#215941" />
            <polygon points="820,180 830,198 810,198" fill="#215941" />
            <polygon points="980,172 987,190 973,190" fill="#215941" />
            <polygon points="980,186 990,204 970,204" fill="#215941" />
          </g>

          {/* Highland Wild Tea Bushes (Foreground left & right corners) */}
          <ellipse cx="25" cy="240" rx="45" ry="18" fill="#081E15" />
          <ellipse cx="70" cy="242" rx="35" ry="14" fill="#0C261B" />
          <ellipse cx="1415" cy="240" rx="45" ry="18" fill="#081E15" />
          <ellipse cx="1370" cy="242" rx="35" ry="14" fill="#0C261B" />
        </svg>

        {/* Bottom Baseline Bar (Seamlessly connects to main dark footer #0B1E15) */}
        <div
          className="absolute inset-x-0 bottom-0 h-1 z-30"
          style={{ backgroundColor: '#0B1E15' }}
        />
      </div>
    </div>
  );
}
