type USALogoProps = {
  width?: number
  height?: number
  topColor?: string
  layerColor?: string
}

export function USALogo({
  width = 118,
  height = 46,
  topColor = "#FFFFFF",
  layerColor = "#FFFFFF",
}: USALogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 8)">
        <path
          d="M58 54C46 61 35 68 23 75C15 70 8 66 0 61V53C8 58 15 62 23 67C35 60 46 53 58 46V54Z"
          fill={layerColor}
          fillOpacity="0.75"
        />
        <path
          d="M58 42C46 49 35 56 23 63C15 58 8 54 0 49V41C8 46 15 50 23 55C35 48 46 41 58 34V42Z"
          fill={layerColor}
          fillOpacity="0.75"
        />
        <path
          d="M58 30C46 37 35 44 23 51C15 46 8 42 0 37V29C8 34 15 38 23 43C35 36 46 29 58 22V30Z"
          fill={layerColor}
          fillOpacity="0.75"
        />
        <path
          d="M0 18C12 11 23 4 35 0C43 5 50 9 58 14V22C50 17 43 13 35 8C23 15 12 22 0 29V18Z"
          fill={topColor}
        />
      </g>

      <text x="74" y="36" fill="white" fontSize="36" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="1">
        USA
      </text>
      <text x="74" y="53" fill="white" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.75" letterSpacing="0.5">
        Estimating Solutions
      </text>
    </svg>
  )
}
